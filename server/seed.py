#!/usr/bin/env python3
"""
Seed script for InvoiceAI App
Populates the database with sample clients and invoices for development and testing.
"""

import sys
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Client, Invoice, InvoiceItem

# Add the current directory to the Python path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


def create_sample_data(db: Session):
    """Create sample clients and invoices"""

    # Clear existing data (optional - comment out if you want to keep existing data)
    db.query(InvoiceItem).delete()
    db.query(Invoice).delete()
    db.query(Client).delete()
    db.commit()

    print("🗑️  Cleared existing data...")

    # Create sample clients
    clients = [
        Client(
            name="Acme Corporation",
            email="billing@acme.com",
            phone="+1-555-0101",
            address="123 Business Ave, Suite 100\nNew York, NY 10001",
            company_name="Acme Corporation",
            tax_id="US-123-456-789",
            notes="Preferred client, net 30 terms",
        ),
        Client(
            name="Tech Innovations LLC",
            email="accounting@techinnovations.com",
            phone="+1-555-0102",
            address="456 Tech Drive\nSan Francisco, CA 94105",
            company_name="Tech Innovations LLC",
            tax_id="US-987-654-321",
            notes="Fast payer, net 15 terms",
        ),
        Client(
            name="Global Solutions Inc",
            email="finance@globalsolutions.com",
            phone="+1-555-0103",
            address="789 World Street\nChicago, IL 60601",
            company_name="Global Solutions Inc",
            tax_id="US-456-789-123",
            notes="Large corporation, net 45 terms",
        ),
        Client(
            name="Startup Ventures",
            email="ops@startupventures.com",
            phone="+1-555-0104",
            address="321 Innovation Lane\nAustin, TX 73301",
            company_name="Startup Ventures",
            tax_id="US-789-123-456",
            notes="New client, watch payment terms",
        ),
    ]

    # Add clients to database
    for client in clients:
        db.add(client)
    db.commit()
    db.refresh(clients[0])  # Refresh to get IDs
    db.refresh(clients[1])
    db.refresh(clients[2])
    db.refresh(clients[3])

    print("👥 Created 4 sample clients...")

    # Create sample invoices
    invoices = [
        Invoice(
            invoice_number="INV-2024-001",
            client_id=clients[0].id,
            due_date=datetime.now() + timedelta(days=30),
            status="sent",
            notes="Web development services for Q1 2024",
            payment_terms="Net 30",
            tax_rate=10.0,
        ),
        Invoice(
            invoice_number="INV-2024-002",
            client_id=clients[0].id,
            due_date=datetime.now() + timedelta(days=15),
            status="draft",
            notes="Monthly maintenance contract",
            payment_terms="Net 15",
            tax_rate=10.0,
        ),
        Invoice(
            invoice_number="INV-2024-003",
            client_id=clients[1].id,
            due_date=datetime.now() + timedelta(days=20),
            status="paid",
            notes="AI integration project - completed",
            payment_terms="Net 20",
            tax_rate=8.5,
        ),
        Invoice(
            invoice_number="INV-2024-004",
            client_id=clients[2].id,
            due_date=datetime.now() + timedelta(days=45),
            status="sent",
            notes="Annual software license renewal",
            payment_terms="Net 45",
            tax_rate=9.0,
        ),
        Invoice(
            invoice_number="INV-2024-005",
            client_id=clients[3].id,
            due_date=datetime.now() + timedelta(days=10),
            status="overdue",
            notes="Initial consultation and setup",
            payment_terms="Net 10",
            tax_rate=0.0,  # Startup discount
        ),
    ]

    # Add invoices to database
    for invoice in invoices:
        db.add(invoice)
    db.commit()
    db.refresh(invoices[0])  # Refresh to get IDs
    db.refresh(invoices[1])
    db.refresh(invoices[2])
    db.refresh(invoices[3])
    db.refresh(invoices[4])

    print("🧾 Created 5 sample invoices...")

    # Create sample invoice items
    invoice_items = [
        # Invoice 1 items
        InvoiceItem(
            invoice_id=invoices[0].id,
            description="Frontend development (40 hours)",
            quantity=40,
            unit_price=75.00,
            total=3000.00,
        ),
        InvoiceItem(
            invoice_id=invoices[0].id,
            description="Backend API development (30 hours)",
            quantity=30,
            unit_price=85.00,
            total=2550.00,
        ),
        # Invoice 2 items
        InvoiceItem(
            invoice_id=invoices[1].id,
            description="Monthly website maintenance",
            quantity=1,
            unit_price=500.00,
            total=500.00,
        ),
        # Invoice 3 items
        InvoiceItem(
            invoice_id=invoices[2].id,
            description="AI model integration",
            quantity=1,
            unit_price=2500.00,
            total=2500.00,
        ),
        InvoiceItem(
            invoice_id=invoices[2].id,
            description="Data preprocessing services",
            quantity=1,
            unit_price=1200.00,
            total=1200.00,
        ),
        # Invoice 4 items
        InvoiceItem(
            invoice_id=invoices[3].id,
            description="Enterprise software license",
            quantity=1,
            unit_price=15000.00,
            total=15000.00,
        ),
        # Invoice 5 items
        InvoiceItem(
            invoice_id=invoices[4].id,
            description="Initial consultation (2 hours)",
            quantity=2,
            unit_price=100.00,
            total=200.00,
        ),
        InvoiceItem(
            invoice_id=invoices[4].id,
            description="Project setup and configuration",
            quantity=1,
            unit_price=300.00,
            total=300.00,
        ),
    ]

    # Add invoice items to database
    for item in invoice_items:
        db.add(item)
    db.commit()

    print("📦 Created sample invoice items...")

    # Calculate and update invoice totals
    for invoice in invoices:
        items_total = sum(
            item.total for item in invoice_items if item.invoice_id == invoice.id
        )
        tax_amount = items_total * (invoice.tax_rate / 100)
        invoice.total_amount = items_total + tax_amount
        invoice.tax_amount = tax_amount

    db.commit()
    print("💰 Calculated and updated invoice totals...")

    return len(clients), len(invoices), len(invoice_items)


def main():
    """Main function to run the seed script"""
    print("🌱 Starting database seeding...")
    print("=" * 50)

    db = SessionLocal()
    try:
        client_count, invoice_count, item_count = create_sample_data(db)

        print("=" * 50)
        print("✅ Seeding completed successfully!")
        print(
            (
                f"📊 Created: {client_count} clients, {invoice_count} invoices, "
                f"{item_count} invoice items"
            )
        )
        print("\n🎯 Sample data includes:")
        print("   • 4 clients with different business profiles")
        print("   • 5 invoices with various statuses (draft, sent, paid, overdue)")
        print("   • Realistic invoice items with proper calculations")
        print("   • Different tax rates and payment terms")
        print("\n🚀 You can now start the application and explore the sample data!")

    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
