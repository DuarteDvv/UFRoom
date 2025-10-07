"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = form.email.includes("@") && form.password.length >= 6;

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limitedNumbers = numbers.slice(0, 11);
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    } else if (limitedNumbers.length <= 9) {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limitedNumbers = numbers.slice(0, 11);
    if (limitedNumbers.length === 0) {
      return "";
    } else if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{2})(\d{1,4})/, "($1) $2");
    } else if (limitedNumbers.length <= 10) {
      return limitedNumbers.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
    } else {
      return limitedNumbers.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      const formattedCPF = formatCPF(value);
      setForm({ ...form, [name]: formattedCPF });
    } else if (name === "phone") {
      const formattedPhone = formatPhone(value);
      setForm({ ...form, [name]: formattedPhone });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("As senhas não conferem!");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        cpf: form.cpf,
        phone: form.phone,
        password: form.password,
      };
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json();

        if (res.status === 400) {
          if (errorData.message === "body/name must NOT have fewer than 3 characters") {
            setError("O nome deve ter pelo menos 3 caracteres.");
          } else {
            setError(errorData.error);
          }
        }

        if (res.status === 500) {
          setError("Erro no servidor. Tente novamente mais tarde.");
        }
        
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      console.log(data);
      
      // Mostra o modal de sucesso
      setShowSuccessModal(true);
      
      // Redireciona após 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err) {
      console.error(err);
      setError("Erro na requisição. Verifique sua conexão.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={200} height={80} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Criar Conta
        </h1>
        <div className="space-y-4">
          {step === 1 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nome completo"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                required
              />
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={form.cpf}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                required
                maxLength={14}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Telefone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                required
              />
              <button
                onClick={handleNext}
                className="w-full bg-red-600 text-white font-semibold p-3 rounded-lg hover:bg-red-700 transition"
              >
                Continuar
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                required
              />
              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  className="w-full bg-gray-300 text-gray-700 font-semibold p-3 rounded-lg hover:bg-gray-400 transition"
                  disabled={isSubmitting}
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  className={`w-full bg-red-600 text-white font-semibold p-3 rounded-lg transition hover:bg-red-700 flex items-center justify-center gap-2
                    ${(!isFormValid || isSubmitting) ? "bg-gray-400 cursor-not-allowed opacity-80" : ""}`}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </button>
              </div>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </>
          )}
        </div>
        <p className="text-center text-gray-600 text-sm mt-6">
          Já tem conta?{" "}
          <a href="/login" className="text-red-600 font-semibold hover:underline">
            Entrar
          </a>
        </p>
      </div>

      {/* Notificação de Sucesso */}
      {showSuccessModal && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="font-medium">Usuário cadastrado com sucesso!</span>
          </div>
        </div>
      )}
    </div>
  );
}