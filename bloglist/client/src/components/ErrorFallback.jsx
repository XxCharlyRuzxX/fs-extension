import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";

const ErrorFallback = ({ error }) => (
  <Container sx={{ mt: 4 }}>
    <Alert severity="error">
      Something went wrong while displaying this page.
      {error?.message && ` ${error.message}`}
    </Alert>
  </Container>
);

export default ErrorFallback;
