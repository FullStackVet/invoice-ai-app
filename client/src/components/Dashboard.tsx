import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  clientAPI,
  invoiceAPI,
  type Client,
  type Invoice,
} from "../services/api";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, invoicesData] = await Promise.all([
          clientAPI.getClients(),
          invoiceAPI.getInvoices(),
        ]);
        setClients(clientsData);
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  const totalInvoices = invoices.length;
  const totalClients = clients.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const draftInvoices = invoices.filter((inv) => inv.status === "draft").length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards using Flexbox */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
        <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Clients
            </Typography>
            <Typography variant="h4">{totalClients}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Invoices
            </Typography>
            <Typography variant="h4">{totalInvoices}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Paid Invoices
            </Typography>
            <Typography variant="h4">{paidInvoices}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Draft Invoices
            </Typography>
            <Typography variant="h4">{draftInvoices}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => onNavigate("create-client")}
            >
              Add New Client
            </Button>
            <Button
              variant="contained"
              onClick={() => onNavigate("create-invoice")}
            >
              Create Invoice
            </Button>
            <Button variant="outlined" onClick={() => onNavigate("clients")}>
              View All Clients
            </Button>
            <Button variant="outlined" onClick={() => onNavigate("invoices")}>
              View All Invoices
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Content Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Recent Invoices */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Invoices
            </Typography>
            {invoices.slice(0, 5).map((invoice) => (
              <Box
                key={invoice.id}
                sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1">
                    #{invoice.invoice_number}
                  </Typography>
                  <Chip
                    label={invoice.status}
                    size="small"
                    color={invoice.status === "paid" ? "success" : "default"}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Amount: ${invoice.total_amount.toFixed(2)}
                </Typography>
              </Box>
            ))}
            {invoices.length === 0 && (
              <Typography color="textSecondary">No invoices yet</Typography>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Clients
            </Typography>
            {clients.slice(0, 5).map((client) => (
              <Box
                key={client.id}
                sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 1 }}
              >
                <Typography variant="body1">{client.name}</Typography>
                {client.company_name && (
                  <Typography variant="body2" color="textSecondary">
                    {client.company_name}
                  </Typography>
                )}
                {client.email && (
                  <Typography variant="body2" color="textSecondary">
                    {client.email}
                  </Typography>
                )}
              </Box>
            ))}
            {clients.length === 0 && (
              <Typography color="textSecondary">No clients yet</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
