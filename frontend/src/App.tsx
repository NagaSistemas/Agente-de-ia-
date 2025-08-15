import { useState } from "react";
import Login from "./components/Login";
import QaTable from "./components/QaTables";
import QaForm from "./components/QaForms";
import Navbar from "./components/Navbar";
import WhatsappConfig from "./components/WhatsappConfig";
import PromptConfig from "./components/PromptConfig";
import ChatTesteAgente from "./components/ChatTesteAgente";
import "./App.css";

// TabKey deve incluir "agente" que representa o teste do bot
type TabKey = "qa" | "whatsapp" | "prompt" | "agente";

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Navbar lateral */}
      <Navbar onLogout={handleLogout} tab={tab} onTabChange={setTab} />
      
      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col py-4 px-2 md:ml-64 transition-all min-h-screen">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-2 sm:p-4 md:p-8 min-h-[500px]">
          {tab === "qa" && (
            <>
              <QaForm onAdd={() => setReload(reload + 1)} />
              <QaTable key={reload} token={token} />
            </>
          )}

          {tab === "whatsapp" && <WhatsappConfig />}
          {tab === "prompt" && <PromptConfig />}
          
          {tab === "agente" && <ChatTesteAgente />}
        </div>
      </main>
    </div>
  );
}

export default App;
