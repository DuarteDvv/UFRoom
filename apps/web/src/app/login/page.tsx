"use client";

import { useRouter } from "next/navigation";
// useRouter permite navegação programática entre páginas.
import { useState } from "react"; 
// useState cria uma variável reativa dentro do componente. 
// Ler: form, 
// Atualizar: setForm(novoValor) 
// Quando atualiza, a tela é re-renderizada automaticamente.

import Image from "next/image";
// Componente de imagem do Next.js, otimizado para performance.

import { useAuth } from "../../global-contexts/authcontext";



export default function LoginPage() {

    const { login } = useAuth();

    const router = useRouter();

    const [form, setForm] = useState({ //Estado do formulário
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState(""); // Estado para a mensagem de erro

    const [showPassword, setShowPassword] = useState(false); //Estado para mostrar/ocultar senha


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; //Desestruturação do evento de mudança (change event)
        setForm({ ...form, [name]: value }); //Atualiza o estado com o novo valor do campo alterado
    }

    const isFormValid = form.email.includes("@") && form.password.length >= 6;
       
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();

        try {
            const payload = {
                email: form.email,
                password: form.password,
            };

            const res = await fetch("http://localhost:3001/auth/login", { 
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();

                if (res.status === 401) {
                    setErrorMessage("E-mail ou senha inválidos");
                }

                if (res.status === 500) {
                    setErrorMessage("Erro no servidor. Tente novamente mais tarde.");
                }

                if (res.status === 400) {
                    setErrorMessage("Email com formato inválido ou senha com menos de 6 caracteres.");
                }

                return;
            }

            const responsebody = await res.json();

            const data = responsebody.data;

            setErrorMessage(""); // Limpa a mensagem de erro em caso de sucesso

            await login(data.user, data.access_token );
            router.push("/search");
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
                <div className="flex justify-center mb-0">
                    <Image src="/logo.png" alt="Logo" width={200} height={80} />
                </div>

                <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
                    Login
                </h1>



                <form onSubmit={handleSubmit} className="space-y-6">

                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Senha"
                            value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
                        required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3C5 3 1.73 7.11 1.07 10c.66 2.89 4 7 8.93 7s8.27-4.11 8.93-7c-.66-2.89-4-7-8.93-7zM10 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                                    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M4.03 3.97a.75.75 0 10-1.06 1.06l1.528 1.528C3.17 7.11 1.73 10 1.07 10c.66 2.89 4 7 8.93 7a8.96 8.96 0 004.58-1.23l2.46 2.46a.75.75 0 101.06-1.06l-14-14zM10 15c-2.76 0-5-2.24-5-5 0-.77.18-1.5.5-2.15l6.65 6.65A4.98 4.98 0 0110 15zm3.5-2.85l1.43 1.43C16.83 12.89 18.27 10 18.93 10c-.66-2.89-4-7-8.93-7a8.96 8.96 0 00-4.58 1.23l1.43 1.43A4.98 4.98 0 0113.5 12.15z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Botão de submit que só é habilitado se o formulário for válido */}

                    <button
                        type="submit"
                        className={`w-full bg-red-600 text-white font-semibold p-3 rounded-lg transition hover:bg-red-700
                        ${!isFormValid ? "bg-gray-400 cursor-not-allowed opacity-80" : ""}`}
                        disabled={!isFormValid}
                    >
                        Entrar
                    </button>

                    {/* Exibir mensagem de erro se existir */}
                    {errorMessage && (
                        <div className="text-yellow-600 text-sm text-center mt-0">
                            {errorMessage}
                        </div>
                    )}


                    {/* Link para página de recuperação de senha */}
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            className="text-gray-400 hover:underline text-sm"
                            onClick={() => router.push('/forgot-password')}
                        >
                            Esqueci minha senha
                        </button>
                    </div>

                </form>
                
            </div>
        
        </div>
    )



}