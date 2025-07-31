import { useState } from "react";
import Login from "./components/Login";
import QaTable from "./components/QaTables";
import QaForm from "./components/QaForms";
import Navbar from "./components/Navbar";
import WhatsappConfig from "./components/WhatsappConfig";
import PromptConfig from "./components/PromptConfig";
import "./App.css";

// Adicione todas as abas possíveis!
type TabKey = "qa" | "whatsapp" | "prompt";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [reload, setReload] = useState(0);
  const [tab, setTab] = useState<TabKey>("qa");

  const handleLogin = (tk: string) => {
    setToken(tk);
    localStorage.setItem("token", tk);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  if (!token) {
    return (
      <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <Navbar onLogout={handleLogout} tab={tab} onTabChange={setTab} />
      {/* Conteúdo com margem à esquerda */}
      <main className="ml-64 flex flex-col items-center justify-center py-4 transition-all">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 min-h-[500px]">
          {tab === "qa" && (
            <>
              <QaForm onAdd={() => setReload(reload + 1)} />
              <QaTable key={reload} token={token} />
            </>
          )}
          {tab === "whatsapp" && <WhatsappConfig />}
          {tab === "prompt" && <PromptConfig />}
        </div>
      </main>
    </div>
  );
}

export default App;
