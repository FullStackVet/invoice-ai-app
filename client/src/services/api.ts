import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Client type and API call
export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company_name?: string;
  tax_id?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateClientRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company_name?: string;
  tax_id?: string;
  notes?: string;
}

// Client API functions
export const clientAPI = {
  // get all clients
  getClients: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>("/clients");
    return response.data;
  },

  // get client by id
  getClient: async (id: number): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  // create a new client
  createClient: async (clientData: CreateClientRequest): Promise<Client> => {
    const response = await api.post<Client>("/clients", clientData);
    return response.data;
  },
};

// invoice type and API call
export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  due_date?: string;
  status: string;
  notes?: string;
  payment_terms?: string;
  tax_rate: number;
  total_amount: number;
  tax_amount: number;
  issue_date: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateInvoiceRequest {
  invoice_number: string;
  client_id: number;
  due_date?: string;
  status?: string;
  notes?: string;
  payment_terms?: string;
  tax_rate?: number;
  items: InvoiceItem[];
}

export const invoiceAPI = {
  // get all invoices
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>("/invoices");
    return response.data;
  },

  // get invoice by id
  getInvoice: async (id: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  // create a new invoice
  createInvoice: async (
    invoiceData: CreateInvoiceRequest
  ): Promise<Invoice> => {
    const response = await api.post<Invoice>("/invoices", invoiceData);
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<{
  status: string;
  messsage: string;
}> => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
