from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
import database

# Import db models from the models.py file
from models import Client, Invoice, InvoiceItem

# Initialize the FastAPI app
app = FastAPI(
    title="InvoiceAI App",
    description="API for AI-Powered Invoicing",
    version="0.1.0",
)

# Configure CORS to allow reqs from React server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create db tables on startup
@app.on_event("startup")
def create_tables():
    database.Base.metadata.create_all(bind=database.engine)


# Pydantic models for req/res
class ClientBase(BaseModel):
    name: str
    email: str = None
    phone: str = None
    address: str = None
    company_name: str = None
    tax_id: str = None
    notes: str = None


class ClientCreate(ClientBase):
    pass


class ClientResponse(ClientBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class InvoiceItemBase(BaseModel):
    description: str
    quantity: float
    unit_price: float
    total: float


class InvoiceBase(BaseModel):
    invoice_number: str
    client_id: int
    due_date: datetime = None
    status: str = "draft"
    notes: str = None
    payment_terms: str = None
    tax_rate: float = 0.0


class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemBase] = []


class InvoiceResponse(InvoiceBase):
    id: int
    total_amount: float
    tax_amount: float
    issue_date: datetime
    created_at: datetime
    updated_at: datetime = None

    class Config:
        from_attributes = True


# Client endpoints
@app.post("/api/clients", response_model=ClientResponse)
def create_client(
    client: ClientCreate,
    db: Session = Depends(database.get_db),
):
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@app.get("/api/clients", response_model=List[ClientResponse])
def get_clients(
    skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)
):
    clients = (
        db.query(Client)
        .filter(Client.is_active.is_(True))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return clients


@app.get("/api/clients/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(database.get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


# Invoice endpoints
@app.post("/api/invoices", response_model=InvoiceResponse)
def create_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(database.get_db),
):
    # Calculate totals
    items_total = sum(item.total for item in invoice.items)
    tax_amount = items_total * (invoice.tax_rate / 100)
    total_amount = items_total + tax_amount

    # create an invoice
    db_invoice = Invoice(
        invoice_number=invoice.invoice_number,
        client_id=invoice.client_id,
        due_date=invoice.due_date,
        status=invoice.status,
        notes=invoice.notes,
        payment_terms=invoice.payment_terms,
        tax_rate=invoice.tax_rate,
        tax_amount=tax_amount,
        total_amount=total_amount,
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)

    # create invoie items
    for item in invoice.items:
        db_item = InvoiceItem(
            invoice_id=db_invoice.id,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total=item.total,
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


@app.get("/api/invoices", response_model=List[InvoiceResponse])
def get_invoices(
    skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)
):
    invoices = db.query(Invoice).offset(skip).limit(limit).all()
    return invoices


@app.get("/api/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(database.get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


# health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "message": "Backend server with db is connected",
    }
