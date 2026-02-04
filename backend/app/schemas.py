from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


from typing import Literal

class RegistrationCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=200)
    email: EmailStr
    pass_type: Literal['silver', 'gold', 'vip']
    variant: str | None = 'A'


class RegistrationOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    pass_type: Literal['silver', 'gold', 'vip']
    variant: str | None
    created_at: datetime

    model_config = {
        'from_attributes': True
    }
