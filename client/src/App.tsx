import { useEffect, useState } from "react";
import "./App.css";

// Interface For Health Check
interface HealthStatus {
  status: string;
  message: string;
}

// Interface For Dummy Invoices
interface Invoice {
  id: number;
  client: string;
  amount: number;
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch health status
  const fetchHealth = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/health");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: HealthStatus = await response.json();
      setHealth(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // fetch dummy invoices
  const fetchInvoices = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/invoices");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Invoice[] = await response.json();
      setInvoices(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // fetch data on component mount
  useEffect(() => {
    fetchHealth();
    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>InvoiceAI App</h1>
        {/* Display health status */}
        {health && (
          <p>
            Backend Status: <strong>{health.status}</strong> - {health.message}
          </p>
        )}

        {/* Display the dummy invoices */}
        <h2>Invoices</h2>
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              {invoice.client} - ${invoice.amount}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
