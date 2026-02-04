import sys
import os
import random

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db import SessionLocal, engine
from app import models

# Ensure tables exist (redundant if alembic run, but safe)
models.Base.metadata.create_all(bind=engine)

def seed():
    db: Session = SessionLocal()
    try:
        print("Seeding data...")
        first_names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"]
        last_names = ["Smith", "Doe", "Johnson", "Brown", "Williams", "Jones", "Garcia", "Miller"]
        pass_types = ["silver", "gold", "vip"]
        variants = ["A", "B"]

        registrations = []
        for _ in range(50):
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            reg = models.Registration(
                full_name=f"{fn} {ln}",
                email=f"{fn.lower()}.{ln.lower()}{random.randint(1,999)}@example.com",
                pass_type=random.choice(pass_types),
                variant=random.choice(variants)
            )
            registrations.append(reg)

        db.add_all(registrations)
        db.commit()
        print(f"Successfully added {len(registrations)} demo registrations.")
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
