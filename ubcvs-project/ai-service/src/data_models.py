# /ai-service/src/data_models.py

from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

# This model defines the structure of data received from Member 2's backend.
class UniversalCertificateData(BaseModel):
    """
    The Pydantic model for the Universal Certificate Schema (UCS) payload.
    This defines the input for the Classification and Fraud Detection engines.
    """
    issuer_address: str = Field(..., description="Blockchain address of the issuer.")
    certificate_hash: str = Field(..., description="The unique hash recorded on the blockchain.")
    
    # Core achievement details used for classification
    achievement_name: str = Field(..., description="The name of the certification (e.g., 'BSc Computer Science').")
    achievement_description: str = Field(..., description="A detailed description of the achievement.")
    
    # Date fields for time-series analysis in fraud detection
    date_issued: str = Field(..., description="ISO 8601 issuance date.")
    
    # The flexible part: dictionary of any extra fields
    custom_fields: Dict[str, Any] = Field(default_factory=dict, description="All non-standard, flexible certificate data.")


class ClassificationResult(BaseModel):
    """
    The output format for the Classification Engine.
    """
    type_id: int = Field(..., description="The numerical ID for the certificate type (e.g., 1 for Education).")
    type_name: str = Field(..., description="The human-readable type name.")


class FraudDetectionResult(BaseModel):
    """
    The output format for the Fraud Detection Engine.
    """
    authenticity_score: float = Field(..., description="A score from 0.0 (high fraud risk) to 1.0 (authentic).")
    anomaly_detected: bool = Field(..., description="True if the certificate exhibits suspicious patterns.")