import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";

export default function AppRoute() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
    </Routes>
  );
}
