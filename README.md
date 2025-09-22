# InvoiceAI App

AI-Enhanced invoicing app via React (frontend) + FastAPI (backend)

## Features

- Invoice creation and management
- AI-powered data extraction from uploaded invoices
- Client management
- Modern React frontend with TypeScript
- FastAPI backend with Python
- Google Document AI integration
- Tesseract OCR integration

## Setup

### Prerequisites

- Node.js
- Python
- Tesseract OCR (**must download to system**)

### Installation

1. Clone the repository
2. Setup backend:
   ```bash
   cd server
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## Database Seeding

The application includes a seed script to populate the database with sample data for testing and development.

### Running the Seed Script

1. **Make sure your virtual environment is activated**:
   ```bash
   cd server
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
