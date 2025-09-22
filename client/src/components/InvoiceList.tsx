import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { invoiceAPI, type Invoice } from "../services/api";

interface InvoiceListProps {
  onNavigate: (view: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onNavigate }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceAPI.getInvoices();
      setInvoices(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch invoices");
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "sent":
        return "info";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Invoices</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => onNavigate("create-invoice")}
        >
          Create Invoice
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>#{invoice.invoice_number}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status.toUpperCase()}
                    color={getStatusColor(invoice.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>${invoice.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  {invoice.due_date
                    ? new Date(invoice.due_date).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {new Date(invoice.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary" sx={{ py: 2 }}>
                    No invoices found. Create your first invoice!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvoiceList;
