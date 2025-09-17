"use client";

import { useState } from "react";
import Image from "next/image";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf:"",
    phone:"",
    password: "",
    confirmPassword: "",
  });

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    const limitedNumbers = numbers.slice(0, 11);
    
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (limitedNumbers.length <= 9) {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    const limitedNumbers = numbers.slice(0, 11);
    
    if (limitedNumbers.length === 0) {
      return '';
    } else if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    } else if (limitedNumbers.length <= 10) {
      return limitedNumbers.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    } else {
      return limitedNumbers.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const formattedCPF = formatCPF(value);
      setForm({ ...form, [name]: formattedCPF });
    } else if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setForm({ ...form, [name]: formattedPhone });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => { // <- async aqui
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
        alert("Erro ao cadastrar: " + (errorData.error || "Tente novamente"));
        return;
      }

      const data = await res.json();
      alert("Cadastro realizado com sucesso!");
      console.log(data);
    } catch (err) {
      console.error(err);
      alert("Erro na requisição");
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={120} height={120} />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Criar Conta
        </h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
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

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold p-3 rounded-lg hover:bg-red-700 transition"
          >
            Cadastrar
          </button>
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

