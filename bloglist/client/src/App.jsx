import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import BlogPage from "./pages/BlogPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import NotFound from "./pages/NotFound";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import Navigation from "./components/Navigation";
import ErrorFallback from "./components/ErrorFallback";
import { UserProvider } from "./context/UserContext";
import { useUser } from "./context/useUser";

const theme = createTheme({
  palette: {
    primary: { main: "#26765b" },
    secondary: { main: "#a84631" },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Trebuchet MS", sans-serif',
    button: { fontWeight: 700, textTransform: "none" },
  },
});

const AppContent = () => {
  const { user, setUser } = useUser();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navigation user={user} handleLogout={() => setUser(null)} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/blogs/:id" element={<BlogPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserPage />} />
            <Route
              path="/create"
              element={user?.token ? <CreateBlogPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={user?.token ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const App = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;
