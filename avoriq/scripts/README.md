# Scholarship Dataset Scraper

This script collects scholarship information from public data.gov.in resource
pages and Buddy4Study listing/detail pages, then writes:

- `raw_records.jsonl` with provenance and source excerpts
- `normalized_scholarships.csv` for manual review and app import
- `gemma_instruction_dataset.jsonl` for Gemma-style instruction tuning
- `summary.json` with counts and output paths

## Setup
```powershell
cd E:\AvorIQ-Lab
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r avoriq\scripts\requirements.txt
```

## Run

```powershell
python avoriq\scripts\scrape_scholarships.py --output-dir datasets\scholarships
```

For data.gov.in resources that expose an API, set an API key:

```powershell
$env:DATA_GOV_IN_API_KEY = "your_api_key"
python avoriq\scripts\scrape_scholarships.py --output-dir datasets\scholarships
```

Use small limits while testing:

```powershell
python avoriq\scripts\scrape_scholarships.py --max-buddy-pages 1 --max-buddy-details 10
```

## Notes

- Validate records before training or fine-tuning a model.
- Keep crawl limits modest and review each site's terms before large scraping
  runs.
- The referenced data.gov.in pages may expose only metadata when the resource API
  is unavailable.
