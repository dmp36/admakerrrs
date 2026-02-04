from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .db import Base, engine, get_db

app = FastAPI(title='Ad Makerrrs API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8000',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('startup')
def on_startup():
    # Base.metadata.create_all(bind=engine)
    pass


@app.get('/api/health')
def health():
    return {'status': 'ok'}


@app.post('/api/registrations', response_model=schemas.RegistrationOut, status_code=201)
def create_registration(payload: schemas.RegistrationCreate, db: Session = Depends(get_db)):
    return crud.create_registration(db, payload)


@app.get('/api/registrations', response_model=list[schemas.RegistrationOut])
def get_registrations(limit: int = 100, db: Session = Depends(get_db)):
    if limit > 200:
        raise HTTPException(status_code=400, detail='limit must be <= 200')
    return crud.list_registrations(db, limit=limit)


@app.get('/admin', response_class=HTMLResponse)
def admin_dashboard():
    with open('static/admin.html', 'r') as f:
        return f.read()
