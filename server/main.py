from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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


# Health Check Endpoint
@app.get("/")
async def root():
    return {"message": "InvoiceAI API Is Running!"}


@app.get("/api/health")
async def health_check():
    return {"status": "Online", "message": "Backend Connected Successfully!"}


# Test Endpoint for dummy invoices
class Invoice(BaseModel):
    id: int
    client: str
    amount: float


@app.get("/api/invoices")
async def get_invoices():
    # Return dummy data
    dummy_invoices = [
        {"id": 1, "client": "Sample One", "amount": 3526.45},
        {"id": 2, "client": "Sample Two", "amount": 999.99},
    ]
    return dummy_invoices
