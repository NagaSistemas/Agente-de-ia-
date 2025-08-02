import { useState } from "react";
import { FaUserCircle, FaRobot, FaWhatsapp, FaEdit, FaBars } from "react-icons/fa";

type TabKey = "qa" | "whatsapp" | "prompt";

type Props = {
  onLogout: () => void;
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

export default function Navbar({ onLogout, tab, onTabChange }: Props) {
  const [open, setOpen] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);

  const menus = [
    { key: "qa", label: "Perguntas & Respostas", icon: <FaRobot /> },
    { key: "prompt", label: "Prompt do Assistente", icon: <FaEdit /> },
    { key: "whatsapp", label: "Configurar WhatsApp", icon: <FaWhatsapp /> },
  ];

  return (
    <>
      {/* Botão Hamburguer: apenas mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded-full shadow-lg"
        onClick={() => setMenuMobile(true)}
        aria-label="Abrir menu"
      >
        <FaBars size={22} />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-blue-800 shadow-lg z-40
        flex flex-col
        transition-transform duration-200
        ${menuMobile ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block
      `}>
        {/* Título do app */}
        <div className="flex items-center gap-3 px-6 pt-12 md:pt-6 pb-6 border-b border-blue-700 relative">
          <span className="text-2xl font-bold tracking-tight select-none text-white">Agente de IA</span>
        </div>
        {/* FLEX-1 + flex-col + gap para distribuir menu e usuário */}
        <div className="flex-1 flex flex-col justify-between">
          <nav className="flex flex-col px-2 py-6 gap-2">
            {menus.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onTabChange(item.key as TabKey);
                  setMenuMobile(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left font-medium transition
                  ${tab === item.key
                    ? "bg-blue-600 text-white shadow"
                    : "text-white hover:bg-blue-700 hover:text-white"}
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          {/* Botão Usuário sempre no rodapé! */}
          <div className="px-6 py-4 border-t border-blue-700">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 focus:outline-none text-white font-medium"
              aria-label="Menu usuário"
            >
              <FaUserCircle size={28} />
              <span>Usuário</span>
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
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(8px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in { animation: fade-in 0.15s ease;}
        `}</style>
      </aside>

      {/* Overlay para fechar o menu mobile */}
      {menuMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMenuMobile(false)}
        />
      )}
    </>
  );
}