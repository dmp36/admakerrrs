from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class RegistrationCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=200)
    email: EmailStr
    pass_type: str = Field(min_length=3, max_length=50)


class RegistrationOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    pass_type: str
    created_at: datetime

    model_config = {
        'from_attributes': True
    }
