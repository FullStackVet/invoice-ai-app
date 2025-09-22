import React from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

interface InvoiceFormProps {
  onNavigate: (view: string) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onNavigate }) => {
  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => onNavigate("invoices")}
        sx={{ mb: 2 }}
      >
        Back to Invoices
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Invoice
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          Invoice creation form will be implemented in the next phase. This will
          include client selection, item management, and AI integration.
        </Alert>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => onNavigate("invoices")}>
            Back to Invoices
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoiceForm;
