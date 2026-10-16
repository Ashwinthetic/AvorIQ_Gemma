"""
AvorIQ Backend — SQLAlchemy ORM Models
Maps the Scholarship TypeScript interface to a PostgreSQL table with pgvector embeddings.
"""

from sqlalchemy import Column, String, Integer, Float, Text, JSON, Boolean
from pgvector.sqlalchemy import Vector
from app.database import Base


class ScholarshipDB(Base):
    __tablename__ = "scholarships"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    provider = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    amount_formatted = Column(String, nullable=False)
    deadline = Column(String, nullable=False)

    # Eligibility — stored as JSON
    eligibility_education_level = Column(JSON, nullable=False, default=[])
    eligibility_gender = Column(String, nullable=False, default="All")
    eligibility_family_income_max = Column(Integer, nullable=False, default=0)
    eligibility_states = Column(JSON, nullable=False, default=[])
    eligibility_castes = Column(JSON, nullable=False, default=[])
    eligibility_fields_of_study = Column(JSON, nullable=False, default=[])

    category = Column(String, nullable=False)  # Government | Private | NGO | International
    description = Column(Text, nullable=False)
    documents = Column(JSON, nullable=False, default=[])
    official_link = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Open")  # Open | Closed | Ending Soon
    coverage = Column(String, nullable=False)
    selection_process = Column(Text, nullable=False)
    benefits = Column(Text, nullable=False)
    faqs = Column(JSON, nullable=False, default=[])

    # pgvector embedding (1024-dim for BAAI/bge-m3 served by TEI)
    embedding = Column(Vector(1024), nullable=True)

    def to_dict(self):
        """Convert to API-compatible dict matching the TypeScript Scholarship interface."""
        return {
            "id": self.id,
            "name": self.name,
            "provider": self.provider,
            "amount": self.amount,
            "amountFormatted": self.amount_formatted,
            "deadline": self.deadline,
            "eligibility": {
                "educationLevel": self.eligibility_education_level or [],
                "gender": self.eligibility_gender,
                "familyIncomeMax": self.eligibility_family_income_max,
                "states": self.eligibility_states or [],
                "castes": self.eligibility_castes or [],
                "fieldsOfStudy": self.eligibility_fields_of_study or [],
            },
            "category": self.category,
            "description": self.description,
            "documents": self.documents or [],
            "officialLink": self.official_link,
            "status": self.status,
            "coverage": self.coverage,
            "selectionProcess": self.selection_process,
            "benefits": self.benefits,
            "faqs": self.faqs or [],
        }


class UserProfileDB(Base):
    __tablename__ = "user_profiles"

    uid = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, nullable=False)
    education_level = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    family_income_max = Column(Integer, nullable=True, default=0)
    state = Column(String, nullable=True)
    caste = Column(String, nullable=True)
    college_name = Column(String, nullable=True)
    enrollment_number = Column(String, nullable=True)
    target_exam = Column(String, nullable=True)
    career_interest = Column(String, nullable=True)
    enable_autofill = Column(Boolean, nullable=True, default=True)
    calibration_answers = Column(JSON, nullable=True)
    calibration_csv = Column(Text, nullable=True)

    def to_dict(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "educationLevel": self.education_level,
            "gender": self.gender,
            "familyIncomeMax": self.family_income_max,
            "state": self.state,
            "caste": self.caste,
            "collegeName": self.college_name,
            "enrollmentNumber": self.enrollment_number,
            "targetExam": self.target_exam,
            "careerInterest": self.career_interest,
            "enableAutofill": self.enable_autofill,
            "calibrationAnswers": self.calibration_answers,
            "calibrationCsv": self.calibration_csv,
        }


class ChatMessageDB(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    uid = Column(String, index=True, nullable=False)
    chat_id = Column(String, index=True, nullable=False, default="default")
    sender = Column(String, nullable=False)  # "user" | "ai"
    text = Column(Text, nullable=False)
    created_at = Column(Float, nullable=False)  # timestamp for ordering
    results = Column(JSON, nullable=True)  # matching scholarships in that turn

    def to_dict(self):
        return {
            "id": self.id,
            "chatId": self.chat_id,
            "sender": self.sender,
            "text": self.text,
            "results": self.results or [],
        }

