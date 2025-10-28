import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Finarix Web läuft 🚀</h1>
      <p>Verbunden mit der API unter {import.meta.env.VITE_API_URL}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
