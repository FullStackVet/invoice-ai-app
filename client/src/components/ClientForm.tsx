import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { clientAPI, type CreateClientRequest } from "../services/api";

interface ClientFormProps {
  onNavigate: (view: string) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<CreateClientRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
    company_name: "",
    tax_id: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await clientAPI.createClient(formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        company_name: "",
        tax_id: "",
        notes: "",
      });
      setTimeout(() => onNavigate("clients"), 2000);
    } catch (err) {
      setError("Failed to create client");
      console.error("Error creating client:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => onNavigate("clients")}
        sx={{ mb: 2 }}
      >
        Back to Clients
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Client
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Client created successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
              }}
            >
              <TextField
                required
                fullWidth
                label="Client Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
              }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Box>

            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleInputChange}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Tax ID"
              name="tax_id"
              value={formData.tax_id}
              onChange={handleInputChange}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              disabled={loading}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formData.name.trim()}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : "Create Client"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => onNavigate("clients")}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ClientForm;
