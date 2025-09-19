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
      alert("As senhas não conferem!");
      return;
    }
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

        if (res.status === 400 ) {

          if (errorData.message === "body/name must NOT have fewer than 3 characters") {
            setError("O nome deve ter pelo menos 3 caracteres.");
          } 
          else{
            setError(errorData.error);
          }
          
        }

        if (res.status === 500) {
          setError("Erro no servidor. Tente novamente mais tarde.");
        }
        
        return;
      }
      const data = await res.json();
      setError(""); // Limpa a mensagem de erro em caso de sucesso
      alert("Usuário cadastrado com sucesso! Faça login para continuar.");
      router.push("/login");
      console.log(data);
    } 
    catch (err) {
      console.error(err);
      alert("Erro na requisição");
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
        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
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
                type="submit"
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
                  type="button"
                  onClick={handleBack}
                  className="w-full bg-gray-300 text-gray-700 font-semibold p-3 rounded-lg hover:bg-gray-400 transition"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={`w-full bg-red-600 text-white font-semibold p-3 rounded-lg transition hover:bg-red-700
                        ${!isFormValid ? "bg-gray-400 cursor-not-allowed opacity-80" : ""}`}
                  disabled={!isFormValid}
                >

                  Cadastrar
                </button>
              </div>
              {error && (
                        <div className="text-yellow-600 text-sm text-center mt-0">
                            {error}
                        </div>
                    )}
            </>
          )}
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Já tem conta?{" "}
          <a href="/login" className="text-red-600 font-semibold hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}

   
