import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import "./config/i18n.ts";

export default function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}
