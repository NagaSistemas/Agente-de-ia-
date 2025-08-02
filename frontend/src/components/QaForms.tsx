import { useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaSyncAlt } from "react-icons/fa";

type Props = {
  onAdd: () => void;
};

export default function QaForm({ onAdd }: Props) {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(false);

  // Backend principal (Python)
  const apiUrl = import.meta.env.VITE_API_URL || "https://agente-de-ia-production-73f7.up.railway.app";
  // URL do seu bot Node.js (ajuste se for diferente)
  const botUrl = import.meta.env.VITE_BOT_API_URL || "https://SEU-BOT-NODE/api/reload";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    setMsgType("");
    const resp = await fetch(`${apiUrl}/qa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta, resposta }),
    });
    setLoading(false);
    if (resp.ok) {
      setMsg("Cadastrado com sucesso!");
      setMsgType("success");
      setPergunta("");
      setResposta("");
      onAdd();
    } else {
      const data = await resp.json();
      setMsg(data.detail || "Erro ao cadastrar.");
      setMsgType("error");
    }
    setTimeout(() => setMsg(""), 3000); // Limpa mensagem após 3s
  };

  // Função para treinar agente manualmente
  const handleReload = async () => {
    setReloading(true);
    setMsg("");
    setMsgType("");
    try {
      // Faz POST nos dois endpoints
      await fetch(`${apiUrl}/reload`, { method: "POST" });
      await fetch(botUrl, { method: "POST" });
      setMsg("Agente treinado com sucesso!");
      setMsgType("success");
    } catch {
      setMsg("Erro ao treinar agente.");
      setMsgType("error");
    }
    setReloading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-6 mb-12 p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-4"
    >
      <h2 className="font-bold text-xl text-blue-800 mb-1">Adicionar Pergunta e Resposta</h2>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-blue-900">
          Pergunta
          <input
            className="border rounded p-2 mt-1 w-full focus:ring-2 focus:ring-blue-300"
            placeholder="Ex: Qual o horário de funcionamento?"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            required
            disabled={loading}
            maxLength={140}
          />
        </label>
        <label className="font-semibold text-blue-900">
          Resposta
          <input
            className="border rounded p-2 mt-1 w-full focus:ring-2 focus:ring-blue-300"
            placeholder="Ex: Segunda a sexta, 8h às 18h"
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            required
            disabled={loading}
            maxLength={500}
          />
        </label>
      </div>
      {msg && (
        <div
          className={`flex items-center gap-2 mb-1 ${
            msgType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {msgType === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
          {msg}
        </div>
      )}
      <button
        type="submit"
        disabled={
          !pergunta.trim() ||
          !resposta.trim() ||
          loading
        }
        className={`bg-blue-700 text-white rounded px-4 py-2 font-bold hover:bg-blue-900 transition disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? "Adicionando..." : "Adicionar"}
      </button>
      {/* Botão Treinar agente */}
      <button
        type="button"
        onClick={handleReload}
        disabled={reloading}
        className="flex items-center gap-2 bg-green-700 text-white rounded px-4 py-2 font-bold hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {reloading ? (
          <>
            <FaSyncAlt className="animate-spin" />
            Treinando agente...
          </>
        ) : (
          <>
            <FaSyncAlt />
            Treinar agente
          </>
        )}
      </button>
    </form>
  );
}
