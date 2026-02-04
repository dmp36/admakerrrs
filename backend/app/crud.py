from sqlalchemy.orm import Session
from . import models, schemas


def create_registration(db: Session, payload: schemas.RegistrationCreate) -> models.Registration:
    registration = models.Registration(
        full_name=payload.full_name,
        email=payload.email,
        pass_type=payload.pass_type,
        variant=payload.variant,
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    return registration


def list_registrations(db: Session, limit: int = 100):
    return db.query(models.Registration).order_by(models.Registration.created_at.desc()).limit(limit).all()
