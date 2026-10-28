import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import BlogPage from "./pages/BlogPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import Navigation from "./components/Navigation";
import ErrorFallback from "./components/ErrorFallback";

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

const App = () => {
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
  });

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navigation user={user} handleLogout={handleLogout} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/blogs/:id" element={<BlogPage />} />
            <Route
              path="/create"
              element={user?.token ? <CreateBlogPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={user?.token ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
