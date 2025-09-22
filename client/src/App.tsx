import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import ClientList from "./components/ClientList";
import ClientForm from "./components/ClientForm";
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import Dashboard from "./components/Dashboard";
import { healthCheck } from "./services/api"; // Import the healthCheck function
import "./App.css";

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

type View =
  | "dashboard"
  | "clients"
  | "invoices"
  | "create-client"
  | "create-invoice";

function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">(
    "checking"
  );

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      // Fixed: Define checkHealth function
      try {
        await healthCheck(); // Now using the imported function
        setApiStatus("online");
      } catch (error) {
        setApiStatus("offline");
        console.error("API Health Check failed", error);
      }
    };

    checkHealth();
    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderView = () => {
    // Fix the type issue by casting setCurrentView to accept strings
    const navigate = (view: string) => setCurrentView(view as View);

    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case "clients":
        return <ClientList onNavigate={navigate} />;
      case "invoices":
        return <InvoiceList onNavigate={navigate} />;
      case "create-client":
        return <ClientForm onNavigate={navigate} />;
      case "create-invoice":
        return <InvoiceForm onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              InvoiceAI App
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: apiStatus === "online" ? "#a5d6a7" : "#ef9a9a",
                }}
              >
                API: {apiStatus.toUpperCase()}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
          {/* Sidebar Navigation */}
          <Box
            sx={{
              width: 200,
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {(
                [
                  { key: "dashboard", label: "Dashboard" },
                  { key: "clients", label: "Clients" },
                  { key: "invoices", label: "Invoices" },
                ] as const
              ).map((item) => (
                <Box
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    bgcolor:
                      currentView === item.key ? "primary.main" : "transparent",
                    color: currentView === item.key ? "white" : "text.primary",
                    "&:hover": {
                      bgcolor:
                        currentView === item.key
                          ? "primary.dark"
                          : "action.hover",
                    },
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Container maxWidth="lg">{renderView()}</Container>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
