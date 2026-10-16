"""
AvorIQ Backend — Pydantic Schemas
Request/Response models for the REST API.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ── Scholarship Schemas ──


class EligibilitySchema(BaseModel):
    educationLevel: list[str] = []
    gender: str = "All"
    familyIncomeMax: int = 0
    states: list[str] = []
    castes: list[str] = []
    fieldsOfStudy: list[str] = []


class FAQSchema(BaseModel):
    question: str
    answer: str


class ScholarshipResponse(BaseModel):
    id: str
    name: str
    provider: str
    amount: int
    amountFormatted: str
    deadline: str
    eligibility: EligibilitySchema
    category: str
    description: str
    documents: list[str] = []
    officialLink: str
    status: str
    coverage: str
    selectionProcess: str
    benefits: str
    faqs: list[FAQSchema] = []


# ── Search Schemas ──


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    limit: int = Field(default=5, ge=1, le=20)


class SearchResult(BaseModel):
    scholarship: ScholarshipResponse
    similarity_score: float = 0.0


# ── Student Profile Schema ──


class StudentProfileSchema(BaseModel):
    educationLevel: Optional[str] = None
    gender: Optional[str] = None
    familyIncomeMax: Optional[int] = None
    state: Optional[str] = None
    caste: Optional[str] = None
    collegeName: Optional[str] = None
    enrollmentNumber: Optional[str] = None
    targetExam: Optional[str] = None
    careerInterest: Optional[str] = None
    enableAutofill: Optional[bool] = True
    calibrationAnswers: Optional[dict] = None
    calibrationCsv: Optional[str] = None


# ── Chat Schemas ──


class ChatMessagePayload(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    profile: Optional[StudentProfileSchema] = None
    stream: bool = Field(default=True)
    active_scholarships: Optional[list[ScholarshipResponse]] = None
    history: Optional[list[ChatMessagePayload]] = None
    file_base64: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    system_prompt: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    scholarships: list[ScholarshipResponse] = []


# ── Health Check ──


class HealthResponse(BaseModel):
    status: str
    database: str
    ollama: str
    tei: str = "unknown"
    hf_api: str = "unknown"
    embedding_primary: str = "tei"
    embedding_model: str = ""
    embedding_dim: int = 0
    models_loaded: list[str] = []
