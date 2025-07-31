import { useState } from "react";
import { FaUserCircle, FaRobot, FaWhatsapp, FaEdit } from "react-icons/fa";

// Mantenha a tipagem igual ao App.tsx!
type TabKey = "qa" | "whatsapp" | "prompt";

type Props = {
  onLogout: () => void;
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

export default function Navbar({ onLogout, tab, onTabChange }: Props) {
  const [open, setOpen] = useState(false);

  // Menus principais com nova aba "Prompt"
  const menus = [
    { key: "qa", label: "Perguntas & Respostas", icon: <FaRobot /> },
    { key: "prompt", label: "Prompt do Assistente", icon: <FaEdit /> },
    { key: "whatsapp", label: "Configurar WhatsApp", icon: <FaWhatsapp /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-blue-800 shadow-lg flex flex-col text-white z-40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-700">
        <span className="text-2xl font-bold tracking-tight select-none">Agente de IA</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-6 px-2">
        {menus.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key as TabKey)}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left font-medium transition
              ${tab === item.key
                ? "bg-blue-600 shadow"
                : "hover:bg-blue-700 hover:shadow"}
            `}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-blue-700 mt-auto relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 focus:outline-none"
          aria-label="Menu usuário"
        >
          <FaUserCircle size={28} />
          <span className="font-semibold">Usuário</span>
        </button>
        {open && (
          <div className="absolute left-2 bottom-16 bg-white text-blue-900 rounded-lg shadow-lg min-w-[140px] z-50 border animate-fade-in">
            <button
              className="w-full px-4 py-2 text-left hover:bg-blue-100 rounded-t-lg"
              onClick={onLogout}
            >
              Sair
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in { animation: fade-in 0.15s ease;}
      `}</style>
    </aside>
  );
}
