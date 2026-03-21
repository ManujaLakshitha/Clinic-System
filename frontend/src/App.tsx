import Home from "./pages/Home";
import "./index.css";
import Login from "./pages/Login";

export default function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Login />;
  }
  return <Home />;
}