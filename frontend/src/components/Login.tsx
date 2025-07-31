import { useState } from "react";

type Props = { onLogin: (token: string) => void };

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simula delay e validação fake para MVP
    await new Promise((res) => setTimeout(res, 600));

    // Troque por sua regra/API real!
    if (email === "clientemuzza@nagasisitemas.com" && password === "Muzza@2025") {
      onLogin("token-fake");
    } else {
      setError("E-mail ou senha incorretos.");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[350px] p-8 bg-white rounded-2xl shadow-2xl flex flex-col"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
        Login do Painel
      </h2>
      <input
        type="email"
        className="w-full border rounded p-2 mb-2 text-gray-900"
        placeholder="E-mail"
        value={email}
        autoComplete="username"
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />
      <div className="relative">
        <input
          className="w-full border rounded p-2 mb-2 pr-10 text-gray-900"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white rounded p-2 font-semibold hover:bg-blue-900 transition flex justify-center items-center"
      >
        {loading ? (
          <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-blue-700 rounded-full mr-2"></span>
        ) : null}
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
