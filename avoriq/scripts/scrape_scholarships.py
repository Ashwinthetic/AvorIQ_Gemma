#!/usr/bin/env python3
"""
Collect scholarship data from data.gov.in and Buddy4Study.

Outputs:
  - raw_records.jsonl: source-preserving records
  - normalized_scholarships.csv: flat dataset for inspection/search
  - gemma_instruction_dataset.jsonl: instruction-tuning rows for Gemma-style SFT

The scraper is intentionally polite: it uses a clear User-Agent, retries transient
errors, and sleeps between requests. Review each target site's terms before large
runs, especially for commercial sources.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import os
import re
import sys
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

try:
    import requests
except ModuleNotFoundError:  # pragma: no cover - exercised only on bare envs
    requests = None  # type: ignore[assignment]

try:
    from bs4 import BeautifulSoup
except ModuleNotFoundError:  # pragma: no cover - exercised only on bare envs
    BeautifulSoup = None  # type: ignore[assignment,misc]


DEFAULT_DATA_GOV_URLS = [
    "https://www.data.gov.in/resource/scholarship-data-2024-25",
    "https://www.data.gov.in/resource/scholarships-students-community-districts-2016-17-shb-2018",
]

DEFAULT_BUDDY4STUDY_URL = "https://www.buddy4study.com/scholarships"
BUDDY4STUDY_API_BASE = "https://api.buddy4study.com/api/v1.0/ssms"
BUDDY4STUDY_PUBLIC_TOKEN_FALLBACK = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJzY29wZSI6WyJyZWFkIiwid3JpdGUiLCJ0cnVzdCJdLCJleHAiOjE4MDM3OTY3ODYs"
    "ImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiNTFiNmEwMTMtYTAxYi00OGQ5LTgy"
    "MDAtYWY1Y2IxOTY3NGE5IiwiY2xpZW50X2lkIjoiYjRzIn0."
    "fo7pgKtKPCGJiQrCs2lqaYPUqB0u-pWzENdkxA4AMHM"
)

CSV_COLUMNS = [
    "id",
    "title",
    "provider",
    "source",
    "source_url",
    "source_type",
    "category",
    "amount",
    "deadline",
    "education_level",
    "location",
    "eligibility",
    "benefits",
    "documents",
    "application_url",
    "description",
    "tags",
    "scraped_at",
]

SCHOLARSHIPS_EXPORT_COLUMNS = [
    "id",
    "scholarship_name",
    "provider",
    "amount",
    "eligibility",
    "education_level",
    "category",
    "state",
    "deadline",
    "required_documents",
    "official_link",
    "application_link",
    "description",
]


@dataclass
class ScholarshipRecord:
    title: str
    source: str
    source_url: str
    source_type: str
    provider: str = ""
    category: str = ""
    amount: str = ""
    deadline: str = ""
    education_level: str = ""
    location: str = ""
    eligibility: str = ""
    benefits: str = ""
    documents: str = ""
    application_url: str = ""
    description: str = ""
    tags: list[str] = field(default_factory=list)
    raw: dict[str, Any] = field(default_factory=dict)
    scraped_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    @property
    def id(self) -> str:
        stable = f"{self.source}|{self.source_url}|{self.title}"
        return hashlib.sha1(stable.encode("utf-8")).hexdigest()[:16]

    def to_csv_row(self) -> dict[str, str]:
        data = asdict(self)
        data["id"] = self.id
        data["tags"] = ", ".join(self.tags)
        data.pop("raw", None)
        return {column: str(data.get(column, "") or "") for column in CSV_COLUMNS}


class HttpClient:
    def __init__(
        self,
        delay_seconds: float,
        timeout_seconds: float,
        user_agent: str,
        retries: int,
    ) -> None:
        self.delay_seconds = delay_seconds
        self.timeout_seconds = timeout_seconds
        self.retries = retries
        if requests is None:
            raise RuntimeError(
                "Missing dependency: requests. Install with "
                "`pip install -r avoriq/scripts/requirements.txt`."
            )
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": user_agent,
                "Accept": "text/html,application/xhtml+xml,application/json,text/csv;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-IN,en;q=0.9",
            }
        )
        self._last_request_at = 0.0

    def get(self, url: str, **kwargs: Any) -> requests.Response:
        elapsed = time.monotonic() - self._last_request_at
        if elapsed < self.delay_seconds:
            time.sleep(self.delay_seconds - elapsed)

        last_error: Exception | None = None
        for attempt in range(self.retries + 1):
            try:
                response = self.session.get(
                    url,
                    timeout=self.timeout_seconds,
                    allow_redirects=True,
                    **kwargs,
                )
                self._last_request_at = time.monotonic()
                if response.status_code in {429, 500, 502, 503, 504}:
                    raise requests.HTTPError(
                        f"Transient HTTP {response.status_code} for {url}",
                        response=response,
                    )
                response.raise_for_status()
                return response
            except requests.RequestException as exc:
                last_error = exc
                if attempt >= self.retries:
                    break
                time.sleep(min(2**attempt, 8))

        raise RuntimeError(f"Failed to fetch {url}: {last_error}") from last_error


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    value = value.replace("\xa0", " ")
    return re.sub(r"\s+", " ", value).strip()


def title_from_slug(url_or_slug: str) -> str:
    slug = urlparse(url_or_slug).path.rstrip("/").split("/")[-1] or url_or_slug
    return clean_text(slug.replace("-", " ").replace("_", " ").title())


def is_generic_title(title: str) -> bool:
    lowered = title.lower()
    return (
        not lowered
        or "open government data" in lowered
        or lowered.startswith("resource |")
        or lowered in {"scholarships", "scholarship"}
    )


def soup_text(soup: BeautifulSoup) -> str:
    for bad in soup(["script", "style", "noscript"]):
        bad.decompose()
    return clean_text(soup.get_text(" "))


def html_to_text(fragment: Any) -> str:
    if fragment is None:
        return ""
    text = str(fragment)
    if "<" in text and BeautifulSoup is not None:
        return clean_text(BeautifulSoup(text, "html.parser").get_text(" "))
    return clean_text(text)


def first_non_empty(*values: str | None) -> str:
    for value in values:
        cleaned = clean_text(value)
        if cleaned:
            return cleaned
    return ""


def meta_content(soup: BeautifulSoup, *names: str) -> str:
    for name in names:
        tag = soup.find("meta", attrs={"property": name}) or soup.find(
            "meta", attrs={"name": name}
        )
        if tag and tag.get("content"):
            return clean_text(tag["content"])
    return ""


def extract_between(text: str, start_patterns: list[str], end_patterns: list[str]) -> str:
    lowered = text.lower()
    start_index = -1
    start_label = ""

    for pattern in start_patterns:
        match = re.search(pattern, lowered, flags=re.IGNORECASE)
        if match and (start_index == -1 or match.start() < start_index):
            start_index = match.end()
            start_label = pattern

    if start_index == -1:
        return ""

    end_index = len(text)
    for pattern in end_patterns:
        match = re.search(pattern, lowered[start_index:], flags=re.IGNORECASE)
        if match:
            end_index = min(end_index, start_index + match.start())

    extracted = clean_text(text[start_index:end_index])
    if extracted.lower().startswith(start_label.lower()):
        extracted = clean_text(extracted[len(start_label) :])
    return extracted[:4000]


def regex_first(text: str, patterns: list[str]) -> str:
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return clean_text(match.group(1))
    return ""


def parse_table_records(html: str) -> list[dict[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    rows: list[dict[str, str]] = []
    for table in soup.find_all("table"):
        headers = [clean_text(cell.get_text(" ")) for cell in table.find_all("th")]
        if not headers:
            first_row = table.find("tr")
            if first_row:
                headers = [
                    clean_text(cell.get_text(" "))
                    for cell in first_row.find_all(["td", "th"])
                ]
        if not headers:
            continue

        for tr in table.find_all("tr")[1:]:
            cells = [clean_text(cell.get_text(" ")) for cell in tr.find_all("td")]
            if cells and len(cells) == len(headers):
                rows.append(dict(zip(headers, cells)))
    return rows


def parse_csv_response(response: requests.Response) -> list[dict[str, str]]:
    text = response.content.decode(response.encoding or "utf-8", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        return []
    return [{clean_text(k): clean_text(v) for k, v in row.items()} for row in reader]


def row_value(row: dict[str, Any], candidates: list[str]) -> str:
    normalized = {clean_text(key).lower(): value for key, value in row.items()}
    for candidate in candidates:
        candidate = candidate.lower()
        for key, value in normalized.items():
            if candidate == key or candidate in key:
                return clean_text(str(value))
    return ""


def record_from_data_gov_row(
    row: dict[str, Any],
    source_url: str,
    fallback_title: str,
    source_metadata: dict[str, Any],
) -> ScholarshipRecord:
    title = first_non_empty(
        row_value(row, ["scheme name", "scholarship", "scheme", "title", "name"]),
        fallback_title,
    )
    district = row_value(row, ["district"])
    ward = row_value(row, ["ward"])
    location = ", ".join(part for part in [ward, district] if part)
    amount = row_value(row, ["amount", "rupees", "rs"])
    beneficiaries = row_value(row, ["beneficiaries"])

    description_parts = []
    if beneficiaries:
        description_parts.append(f"Beneficiaries: {beneficiaries}")
    if location:
        description_parts.append(f"Location: {location}")

    return ScholarshipRecord(
        title=title,
        source="data.gov.in",
        source_url=source_url,
        source_type="government_open_data",
        provider=source_metadata.get("contributor", ""),
        amount=amount,
        location=location,
        description="; ".join(description_parts),
        tags=["government", "open-data", "scholarship"],
        raw={"row": row, "resource_metadata": source_metadata},
    )


def find_download_links(soup: BeautifulSoup, page_url: str) -> list[str]:
    links: list[str] = []
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        label = clean_text(anchor.get_text(" ")).lower()
        lowered_href = href.lower()
        if (
            "download" in label
            or "download" in lowered_href
            or lowered_href.endswith(".csv")
            or "/download/" in lowered_href
            or "format=csv" in lowered_href
        ):
            links.append(urljoin(page_url, href))
    return dedupe_keep_order(links)


def data_gov_api_url(resource_url: str, api_key: str, limit: int) -> str:
    slug = urlparse(resource_url).path.rstrip("/").split("/")[-1]
    return (
        f"https://api.data.gov.in/resource/{slug}"
        f"?api-key={api_key}&format=json&offset=0&limit={limit}"
    )


def scrape_data_gov_resource(
    client: HttpClient,
    resource_url: str,
    api_key: str,
    api_limit: int,
) -> list[ScholarshipRecord]:
    response = client.get(resource_url)
    html = response.text
    soup = BeautifulSoup(html, "html.parser")
    text = soup_text(soup)

    title = first_non_empty(
        clean_text(soup.find(["h1", "h2"]).get_text(" ") if soup.find(["h1", "h2"]) else ""),
        meta_content(soup, "og:title", "title"),
        resource_url.rstrip("/").split("/")[-1].replace("-", " ").title(),
    )
    if is_generic_title(title):
        title = title_from_slug(resource_url)
    description = meta_content(soup, "og:description", "description")

    metadata = {
        "title": title,
        "published_on": regex_first(text, [r"Published On:\s*([0-9/.-]+)"]),
        "updated_on": regex_first(text, [r"Updated On\s*([0-9/.-]+)"]),
        "file_size": regex_first(text, [r"File size:\s*([0-9.]+\s*[A-Za-z]+)"]),
        "granularity": regex_first(text, [r"Granularity:\s*([A-Za-z0-9 /.-]+?)\s+Reference URL"]),
        "fields": regex_first(text, [r"Fields:\s*(.+?)\s+Keywords:"]),
        "note": regex_first(text, [r"Note:\s*(.+?)\s+Fields:"]),
        "catalog": regex_first(text, [r"Catalog\s*:\s*(.+?)\s+Download:"]),
        "contributor": regex_first(text, [r"Contributor:\s*(.+?)\s+Domain:"]),
        "license": regex_first(text, [r"Released Under:\s*(.+?)\s+Contributor:"]),
    }

    records: list[ScholarshipRecord] = []

    if api_key:
        try:
            api_response = client.get(data_gov_api_url(resource_url, api_key, api_limit))
            payload = api_response.json()
            api_rows = payload.get("records") or []
            if isinstance(api_rows, list) and api_rows:
                for row in api_rows:
                    if isinstance(row, dict):
                        records.append(
                            record_from_data_gov_row(row, resource_url, title, metadata)
                        )
        except Exception as exc:
            metadata["api_error"] = str(exc)

    if not records:
        for download_url in find_download_links(soup, resource_url):
            try:
                download_response = client.get(download_url)
                content_type = download_response.headers.get("content-type", "").lower()
                download_rows: list[dict[str, str]] = []
                if "csv" in content_type or download_url.lower().endswith(".csv"):
                    download_rows = parse_csv_response(download_response)
                else:
                    download_rows = parse_table_records(download_response.text)
                for row in download_rows:
                    records.append(
                        record_from_data_gov_row(row, resource_url, title, metadata)
                    )
            except Exception as exc:
                metadata.setdefault("download_errors", []).append(
                    {"url": download_url, "error": str(exc)}
                )

    if records:
        return records

    return [
        ScholarshipRecord(
            title=title,
            source="data.gov.in",
            source_url=resource_url,
            source_type="government_open_data_metadata",
            provider=metadata.get("contributor", ""),
            description=first_non_empty(description, metadata.get("note", "")),
            tags=["government", "open-data", "scholarship", "metadata-only"],
            raw={"resource_metadata": metadata, "page_excerpt": text[:5000]},
        )
    ]


def extract_buddy_links(html: str, base_url: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    links: list[str] = []

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        url = urljoin(base_url, href)
        path = urlparse(url).path
        if path.startswith("/scholarship/") or path.startswith("/page/"):
            links.append(url)

    for match in re.findall(r'["\'](/(?:scholarship|page)/[^"\'<> ]+)', html):
        links.append(urljoin(base_url, match))

    cleaned = []
    for url in links:
        parsed = urlparse(url)
        if parsed.netloc and "buddy4study.com" not in parsed.netloc:
            continue
        if parsed.path.rstrip("/") in {"/scholarships", "/scholarship"}:
            continue
        if any(skip in parsed.path.lower() for skip in ["/login", "/register", "/news"]):
            continue
        cleaned.append(parsed._replace(query="", fragment="").geturl())

    return dedupe_keep_order(cleaned)


def collect_listing_records(html: str, listing_url: str) -> list[ScholarshipRecord]:
    rows: list[ScholarshipRecord] = []
    soup = BeautifulSoup(html, "html.parser")

    for card in soup.find_all(["article", "li", "div"]):
        card_text = clean_text(card.get_text(" "))
        if len(card_text) < 40 or "scholarship" not in card_text.lower():
            continue

        link = card.find("a", href=True)
        if not link:
            continue
        detail_url = urljoin(listing_url, link["href"])
        path = urlparse(detail_url).path
        if not (path.startswith("/scholarship/") or path.startswith("/page/")):
            continue

        title = clean_text(link.get_text(" ")) or regex_first(
            card_text, [r"([^|]{10,120}?Scholarship[^|]{0,120})"]
        )
        if not title:
            continue

        rows.append(
            ScholarshipRecord(
                title=title,
                source="buddy4study.com",
                source_url=detail_url,
                source_type="scholarship_listing_card",
                amount=regex_first(
                    card_text,
                    [r"((?:Rs\.?|INR|₹)\s*[0-9][0-9,]*(?:\s*(?:per|/)\s*[A-Za-z]+)?)"],
                ),
                deadline=regex_first(
                    card_text,
                    [
                        r"(?:Deadline|Last Date|Apply by)\s*:?\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})",
                        r"(?:Deadline|Last Date|Apply by)\s*:?\s*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})",
                    ],
                ),
                description=card_text[:1000],
                tags=["private", "scholarship", "listing-card"],
                raw={"listing_card_text": card_text},
            )
        )

    return rows


def extract_section_by_heading(soup: BeautifulSoup, headings: list[str]) -> str:
    heading_pattern = re.compile("|".join(re.escape(h) for h in headings), re.I)
    heading = soup.find(
        lambda tag: tag.name in {"h1", "h2", "h3", "h4", "strong", "b"}
        and heading_pattern.search(clean_text(tag.get_text(" ")))
    )
    if not heading:
        full_text = soup_text(soup)
        return extract_between(
            full_text,
            [heading for heading in headings],
            [
                "benefits",
                "documents",
                "how can you apply",
                "application process",
                "terms and conditions",
                "contact",
                "faq",
            ],
        )

    parts: list[str] = []
    for sibling in heading.find_all_next():
        if sibling.name in {"h1", "h2", "h3", "h4"} and sibling is not heading:
            break
        text = clean_text(sibling.get_text(" "))
        if text:
            parts.append(text)
        if len(" ".join(parts)) > 2500:
            break
    return clean_text(" ".join(parts))[:3000]


def scrape_buddy_detail(client: HttpClient, detail_url: str) -> ScholarshipRecord | None:
    response = client.get(detail_url)
    soup = BeautifulSoup(response.text, "html.parser")
    text = soup_text(soup)

    title = first_non_empty(
        clean_text(soup.find("h1").get_text(" ") if soup.find("h1") else ""),
        meta_content(soup, "og:title", "twitter:title"),
        clean_text(soup.title.get_text(" ") if soup.title else ""),
    )
    title = re.sub(r"\s*-\s*Buddy4Study.*$", "", title, flags=re.I).strip()
    if not title or "buddy4study" == title.lower():
        return None

    description = first_non_empty(
        meta_content(soup, "og:description", "description"),
        text[:1000],
    )

    application_url = ""
    for anchor in soup.find_all("a", href=True):
        label = clean_text(anchor.get_text(" ")).lower()
        if "apply" in label:
            application_url = urljoin(detail_url, anchor["href"])
            break

    record = ScholarshipRecord(
        title=title,
        source="buddy4study.com",
        source_url=detail_url,
        source_type="scholarship_detail_page",
        provider=regex_first(
            text,
            [
                r"(?:Provider|Offered by|Provided by)\s*:?\s*([^|]{2,120}?)(?:\s+Eligibility|\s+Benefits|\s+Deadline|$)",
            ],
        ),
        amount=regex_first(
            text,
            [
                r"(?:Award|Benefits?|Scholarship Amount)\s*:?\s*((?:Rs\.?|INR|₹)\s*[0-9][^|]{0,120})",
                r"((?:Rs\.?|INR|₹)\s*[0-9][0-9,]*(?:\s*(?:per|/)\s*[A-Za-z]+)?)",
            ],
        ),
        deadline=regex_first(
            text,
            [
                r"(?:Deadline|Last Date|Apply by)\s*:?\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})",
                r"(?:Deadline|Last Date|Apply by)\s*:?\s*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})",
            ],
        ),
        education_level=regex_first(
            text,
            [
                r"(?:Class|Course|Education Qualification)\s*:?\s*([^|]{2,160}?)(?:\s+Benefits|\s+Documents|\s+Deadline|$)",
            ],
        ),
        eligibility=extract_section_by_heading(soup, ["Eligibility", "Who can apply"]),
        benefits=extract_section_by_heading(soup, ["Benefits", "Award", "Rewards"]),
        documents=extract_section_by_heading(
            soup, ["Documents", "Documents required", "Required documents"]
        ),
        application_url=application_url,
        description=description,
        tags=["private", "scholarship", "buddy4study"],
        raw={"page_text_excerpt": text[:8000]},
    )
    return record


def extract_buddy_public_token(client: HttpClient, listing_url: str) -> str:
    try:
        response = client.get(listing_url)
        soup = BeautifulSoup(response.text, "html.parser")
        app_scripts = [
            urljoin(listing_url, script["src"])
            for script in soup.find_all("script", src=True)
            if "/_next/static/chunks/pages/_app-" in script["src"]
        ]
        for script_url in app_scripts:
            script_response = client.get(script_url)
            match = re.search(r'ey="(eyJ[^"]+)"', script_response.text)
            if match:
                return match.group(1)
    except Exception as exc:
        print(f"[warn] Buddy4Study token discovery failed: {exc}", file=sys.stderr)
    return BUDDY4STUDY_PUBLIC_TOKEN_FALLBACK


def first_mapping(values: Any) -> dict[str, Any]:
    if isinstance(values, list) and values and isinstance(values[0], dict):
        return values[0]
    if isinstance(values, dict):
        return values
    return {}


def join_values(values: list[str]) -> str:
    return "; ".join(value for value in [clean_text(item) for item in values] if value)


def buddy_rule_summary(detail: dict[str, Any]) -> str:
    values: list[str] = []
    for item in detail.get("scholarshipRules") or []:
        if not isinstance(item, dict):
            continue
        rule = item.get("rule") or {}
        rule_type = ((rule.get("ruletype") or {}).get("ruleType") or "").replace("_", " ")
        rule_value = item.get("ruleValue") or rule.get("ruleName") or ""
        if rule_type or rule_value:
            values.append(f"{rule_type}: {rule_value}".strip(": "))

    incomes = []
    for income in detail.get("scholarshipFamilyIncomes") or []:
        if isinstance(income, dict):
            max_value = income.get("maxValue")
            min_value = income.get("minValue")
            if max_value is not None:
                incomes.append(f"family income {min_value or 0}-{max_value}")
    values.extend(incomes)
    return join_values(values)


def buddy_documents(detail: dict[str, Any]) -> str:
    docs: list[str] = []
    for item in detail.get("scholarshipDocuments") or []:
        if not isinstance(item, dict):
            continue
        document = item.get("document") or item.get("documentName") or item.get("name")
        if isinstance(document, dict):
            document = document.get("documentName") or document.get("name")
        if document:
            docs.append(str(document))
    return join_values(docs)


def buddy_provider(detail: dict[str, Any], list_row: dict[str, Any]) -> str:
    multilingual = first_mapping(detail.get("scholarshipMultilinguals"))
    provider = multilingual.get("providerName") or list_row.get("providerName")
    if provider:
        return clean_text(str(provider))

    providers = []
    for item in detail.get("scholarshipProviders") or []:
        if isinstance(item, dict) and item.get("providerName"):
            providers.append(str(item["providerName"]))
    return join_values(providers)


def buddy_application_url(detail: dict[str, Any], slug: str) -> str:
    for item in detail.get("scholarshipWebsiteLinks") or []:
        if isinstance(item, dict) and item.get("url"):
            return clean_text(str(item["url"]))
    return f"https://www.buddy4study.com/page/{slug}"


def record_from_buddy_api_row(
    list_row: dict[str, Any],
    detail: dict[str, Any] | None = None,
) -> ScholarshipRecord:
    detail = detail or {}
    body = first_mapping(detail.get("scholarshipBodyMultilinguals"))
    multilingual = first_mapping(detail.get("scholarshipMultilinguals"))
    meta = first_mapping(detail.get("scholarshipMetaTags"))
    slug = str(detail.get("slug") or list_row.get("slug") or "").strip("/")
    title = first_non_empty(
        str(detail.get("scholarshipName") or ""),
        str(multilingual.get("title") or ""),
        str(list_row.get("title") or ""),
        title_from_slug(slug),
    )
    applicable_for = first_non_empty(
        str(multilingual.get("applicableFor") or ""),
        str(list_row.get("applicableFor") or ""),
    )
    purpose_award = first_non_empty(
        str(multilingual.get("purposeAward") or ""),
        str(list_row.get("purposeAward") or ""),
    )
    benefits = first_non_empty(
        html_to_text(body.get("benefits")),
        html_to_text(body.get("awardDetails")),
        purpose_award,
    )
    eligibility = first_non_empty(
        html_to_text(body.get("eligibility")),
        buddy_rule_summary(detail),
        applicable_for,
    )
    description = first_non_empty(
        html_to_text(body.get("description")),
        html_to_text(body.get("aboutScholarship")),
        html_to_text(meta.get("description")),
        f"{title}. Applicable for: {applicable_for}. Award: {purpose_award}.",
    )
    source_url = f"https://www.buddy4study.com/page/{slug}" if slug else DEFAULT_BUDDY4STUDY_URL

    return ScholarshipRecord(
        title=title,
        source="buddy4study.com",
        source_url=source_url,
        source_type="scholarship_api",
        provider=buddy_provider(detail, list_row),
        category="Private",
        amount=first_non_empty(
            str(list_row.get("awardAmount") or ""),
            str(detail.get("awardAmount") or ""),
            purpose_award,
        ),
        deadline=first_non_empty(
            str(detail.get("deadlineDate") or ""),
            str(detail.get("onlineDeadline") or ""),
            str(list_row.get("deadlineDate") or ""),
        ),
        education_level=applicable_for,
        location=join_values(
            [
                str((country.get("country") or {}).get("name") or country.get("name") or "")
                for country in detail.get("scholarshipSourceCountries") or []
                if isinstance(country, dict)
            ]
        ),
        eligibility=eligibility,
        benefits=benefits,
        documents=buddy_documents(detail),
        application_url=buddy_application_url(detail, slug),
        description=description,
        tags=["private", "scholarship", "buddy4study", "api"],
        raw={"listing": list_row, "detail": detail},
    )


def scrape_buddy4study_api(
    client: HttpClient,
    listing_url: str,
    max_pages: int,
    max_details: int,
) -> list[ScholarshipRecord]:
    token = extract_buddy_public_token(client, listing_url)
    headers = {
        "Authorization": f"Bearer {token}",
        "Origin": "https://www.buddy4study.com",
        "Referer": listing_url,
        "Accept": "application/json",
    }
    rows: list[dict[str, Any]] = []
    page_size = min(max(max_details, 10), 100)

    for page_number in range(max_pages):
        response = client.get(
            f"{BUDDY4STUDY_API_BASE}/scholarshipResult",
            headers=headers,
            params={"page": page_number, "size": page_size},
        )
        payload = response.json()
        page_rows = payload.get("data") or payload.get("content") or []
        if not isinstance(page_rows, list) or not page_rows:
            break
        rows.extend(row for row in page_rows if isinstance(row, dict))
        if len(rows) >= max_details:
            break

    records: list[ScholarshipRecord] = []
    for row in rows[:max_details]:
        slug = str(row.get("slug") or "").strip("/")
        detail: dict[str, Any] | None = None
        if slug:
            try:
                detail_response = client.get(
                    f"{BUDDY4STUDY_API_BASE}/scholarship/{slug}",
                    headers=headers,
                )
                detail_payload = detail_response.json()
                if isinstance(detail_payload, dict):
                    detail = detail_payload
            except Exception as exc:
                print(
                    f"[warn] Buddy4Study API detail failed for {slug}: {exc}",
                    file=sys.stderr,
                )
        records.append(record_from_buddy_api_row(row, detail))

    return dedupe_records(records)


def scrape_buddy4study(
    client: HttpClient,
    listing_url: str,
    max_pages: int,
    max_details: int,
) -> list[ScholarshipRecord]:
    try:
        api_records = scrape_buddy4study_api(client, listing_url, max_pages, max_details)
        if api_records:
            return api_records
    except Exception as exc:
        print(f"[warn] Buddy4Study API scrape failed: {exc}", file=sys.stderr)

    records: list[ScholarshipRecord] = []
    detail_links: list[str] = []

    for page_number in range(1, max_pages + 1):
        url = listing_url if page_number == 1 else f"{listing_url}?page={page_number}"
        try:
            response = client.get(url)
        except Exception as exc:
            print(f"[warn] Buddy4Study listing failed: {url}: {exc}", file=sys.stderr)
            continue
        html = response.text
        records.extend(collect_listing_records(html, url))
        detail_links.extend(extract_buddy_links(html, url))

    for detail_url in dedupe_keep_order(detail_links)[:max_details]:
        try:
            record = scrape_buddy_detail(client, detail_url)
            if record:
                records.append(record)
        except Exception as exc:
            print(f"[warn] Buddy4Study detail failed: {detail_url}: {exc}", file=sys.stderr)

    return dedupe_records(records)


def dedupe_keep_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for value in values:
        if value not in seen:
            seen.add(value)
            output.append(value)
    return output


def dedupe_records(records: list[ScholarshipRecord]) -> list[ScholarshipRecord]:
    seen: set[str] = set()
    output: list[ScholarshipRecord] = []
    for record in records:
        key = record.id
        if key in seen:
            continue
        seen.add(key)
        output.append(record)
    return output


def make_training_example(record: ScholarshipRecord) -> dict[str, Any]:
    structured_output = {
        "title": record.title,
        "provider": record.provider,
        "category": record.category,
        "amount": record.amount,
        "deadline": record.deadline,
        "education_level": record.education_level,
        "location": record.location,
        "eligibility": record.eligibility,
        "benefits": record.benefits,
        "documents": record.documents,
        "application_url": record.application_url or record.source_url,
        "source_url": record.source_url,
    }
    source_text = "\n".join(
        part
        for part in [
            f"Title: {record.title}",
            f"Provider: {record.provider}",
            f"Description: {record.description}",
            f"Eligibility: {record.eligibility}",
            f"Benefits: {record.benefits}",
            f"Documents: {record.documents}",
            f"Amount: {record.amount}",
            f"Deadline: {record.deadline}",
            f"Source: {record.source_url}",
        ]
        if part.split(": ", 1)[-1]
    )

    return {
        "instruction": "Extract a clean scholarship profile for an Indian student scholarship matching assistant. Return only JSON with the requested fields.",
        "input": source_text,
        "output": json.dumps(structured_output, ensure_ascii=False),
        "metadata": {
            "record_id": record.id,
            "source": record.source,
            "source_type": record.source_type,
            "scraped_at": record.scraped_at,
        },
    }


def write_outputs(records: list[ScholarshipRecord], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    raw_path = output_dir / "raw_records.jsonl"
    with raw_path.open("w", encoding="utf-8", newline="\n") as handle:
        for record in records:
            payload = asdict(record)
            payload["id"] = record.id
            handle.write(json.dumps(payload, ensure_ascii=False) + "\n")

    csv_path = output_dir / "normalized_scholarships.csv"
    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for record in records:
            writer.writerow(record.to_csv_row())

    scholarships_csv_path = output_dir / "scholarships.csv"
    with scholarships_csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=SCHOLARSHIPS_EXPORT_COLUMNS)
        writer.writeheader()
        for record in records:
            writer.writerow(to_scholarships_export_row(record))

    training_path = output_dir / "gemma_instruction_dataset.jsonl"
    with training_path.open("w", encoding="utf-8", newline="\n") as handle:
        for record in records:
            handle.write(json.dumps(make_training_example(record), ensure_ascii=False) + "\n")

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "record_count": len(records),
        "outputs": {
            "raw_records": str(raw_path),
            "normalized_csv": str(csv_path),
            "scholarships_csv": str(scholarships_csv_path),
            "gemma_instruction_dataset": str(training_path),
        },
        "sources": sorted({record.source for record in records}),
        "notes": [
            "Validate scraped data before training or fine-tuning.",
            "Buddy4Study is a commercial site; keep crawl limits modest and review their terms.",
            "data.gov.in rows are licensed by the owning publisher under the listed open-data license when available.",
        ],
    }
    with (output_dir / "summary.json").open("w", encoding="utf-8") as handle:
        json.dump(summary, handle, indent=2, ensure_ascii=False)


def to_scholarships_export_row(record: ScholarshipRecord) -> dict[str, str]:
    state = record.location
    official_link = record.source_url
    application_link = record.application_url
    if record.source == "data.gov.in" and not application_link:
        application_link = ""

    if record.source == "buddy4study.com" and not official_link:
        official_link = record.source_url

    return {
        "id": record.id,
        "scholarship_name": record.title,
        "provider": record.provider,
        "amount": record.amount,
        "eligibility": record.eligibility,
        "education_level": record.education_level,
        "category": record.category or ("Government" if record.source == "data.gov.in" else "Private"),
        "state": state,
        "deadline": record.deadline,
        "required_documents": record.documents,
        "official_link": official_link,
        "application_link": application_link,
        "description": record.description,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scrape scholarship sources into normalized and Gemma SFT datasets."
    )
    parser.add_argument(
        "--output-dir",
        default="datasets/scholarships",
        help="Directory for generated dataset files.",
    )
    parser.add_argument(
        "--data-gov-url",
        action="append",
        default=[],
        help="data.gov.in resource URL. Can be passed multiple times.",
    )
    parser.add_argument(
        "--data-gov-api-key",
        default=os.getenv("DATA_GOV_IN_API_KEY", ""),
        help="Optional data.gov.in API key. Uses DATA_GOV_IN_API_KEY if set.",
    )
    parser.add_argument(
        "--data-gov-api-limit",
        type=int,
        default=1000,
        help="Max rows to request from a data.gov.in API resource.",
    )
    parser.add_argument(
        "--buddy4study-url",
        default=DEFAULT_BUDDY4STUDY_URL,
        help="Buddy4Study listing URL.",
    )
    parser.add_argument(
        "--max-buddy-pages",
        type=int,
        default=2,
        help="Max Buddy4Study listing pages to inspect.",
    )
    parser.add_argument(
        "--max-buddy-details",
        type=int,
        default=50,
        help="Max Buddy4Study detail pages to fetch.",
    )
    parser.add_argument(
        "--skip-buddy4study",
        action="store_true",
        help="Skip Buddy4Study scraping.",
    )
    parser.add_argument(
        "--skip-data-gov",
        action="store_true",
        help="Skip data.gov.in scraping.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.5,
        help="Delay in seconds between HTTP requests.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=30,
        help="HTTP timeout in seconds.",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=2,
        help="Number of retries for transient HTTP errors.",
    )
    parser.add_argument(
        "--user-agent",
        default="AvorIQ scholarship dataset builder/0.1 (contact: local-dev)",
        help="HTTP User-Agent string.",
    )
    return parser.parse_args()


def require_dependencies() -> None:
    missing = []
    if requests is None:
        missing.append("requests")
    if BeautifulSoup is None:
        missing.append("beautifulsoup4")

    if missing:
        packages = ", ".join(missing)
        raise RuntimeError(
            f"Missing Python package(s): {packages}. Install them with "
            "`pip install -r avoriq/scripts/requirements.txt`."
        )


def main() -> int:
    args = parse_args()
    require_dependencies()
    client = HttpClient(
        delay_seconds=args.delay,
        timeout_seconds=args.timeout,
        user_agent=args.user_agent,
        retries=args.retries,
    )

    records: list[ScholarshipRecord] = []

    if not args.skip_data_gov:
        data_gov_urls = args.data_gov_url or DEFAULT_DATA_GOV_URLS
        for url in data_gov_urls:
            try:
                records.extend(
                    scrape_data_gov_resource(
                        client=client,
                        resource_url=url,
                        api_key=args.data_gov_api_key,
                        api_limit=args.data_gov_api_limit,
                    )
                )
            except Exception as exc:
                print(f"[warn] data.gov.in resource failed: {url}: {exc}", file=sys.stderr)

    if not args.skip_buddy4study:
        records.extend(
            scrape_buddy4study(
                client=client,
                listing_url=args.buddy4study_url,
                max_pages=args.max_buddy_pages,
                max_details=args.max_buddy_details,
            )
        )

    records = dedupe_records(records)
    write_outputs(records, Path(args.output_dir))
    print(f"Wrote {len(records)} records to {args.output_dir}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
