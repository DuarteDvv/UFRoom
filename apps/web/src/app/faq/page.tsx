"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../global-contexts/authcontext";

type ChatIntent = "complaint" | "question";

type ChatMessage = {
	id: string;
	sender: "user" | "assistant";
	text: string;
	createdAt: string;
};

const formatTime = (date: Date) =>
	date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const assistantGreetingMessages = [
	{
		prefix: "welcome",
		text: "Olá! Eu sou a assistente virtual da UFRoom. Estou aqui para registrar reclamações ou tirar suas dúvidas.",
	},
	{
		prefix: "instructions",
		text: "Comece escolhendo o motivo do contato ou envie sua mensagem diretamente.",
	},
];

const generateId = (prefix: string) =>
	`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const generateThreadId = () => {
	const hasCrypto = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function";
	return hasCrypto ? crypto.randomUUID() : generateId("thread");
};

const createInitialMessages = (): ChatMessage[] =>
	assistantGreetingMessages.map(({ prefix, text }) => ({
		id: generateId(prefix),
		sender: "assistant",
		text,
		createdAt: formatTime(new Date()),
	}));

const quickPrompts = [
	"Quero reportar um problema com o anúncio",
	"Como acompanho o status da minha reclamação?",
	"Qual o prazo para retorno da equipe?",
	"Tenho dúvidas sobre pagamentos",
];

const SUPPORT_API_URL =
	process.env.NEXT_PUBLIC_SUPPORT_API_URL || "http://127.0.0.1:8000/answer";

const SUPPORT_CLEAR_THREADS_URL = (() => {
	try {
		const base = new URL(SUPPORT_API_URL);
		base.pathname = "/threads/clear";
		base.search = "";
		return base.toString();
	} catch (error) {
		console.error("Failed to derive clear threads URL", error);
		return "http://127.0.0.1:8000/threads/clear";
	}
})();

export default function FaqChatPage() {
	const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages());
	const [intent, setIntent] = useState<ChatIntent | null>(null);
	const [inputValue, setInputValue] = useState("");
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [lastError, setLastError] = useState<string | null>(null);

	const messageListRef = useRef<HTMLDivElement>(null);
	const sessionThreadIdsRef = useRef<{ complaint: string; question: string } | null>(null);
	const { user } = useAuth() ?? {};

	const resolvedUserName = useMemo(() => {
		const name = user?.name;
		if (typeof name === "string" && name.trim().length > 0) {
			return name.trim();
		}
		return "Visitante";
	}, [user?.name]);

	useEffect(() => {
		if (!sessionThreadIdsRef.current) {
			sessionThreadIdsRef.current = {
				complaint: generateThreadId(),
				question: generateThreadId(),
			};
		}
	}, []);

	const flushThreadHistory = useCallback(() => {
		if (typeof window === "undefined") return;
		const threadIds = sessionThreadIdsRef.current;
		if (!threadIds) return;
		const payload = JSON.stringify({
			thread_ids: [threadIds.complaint, threadIds.question].filter(Boolean),
		});
		if (payload === '{"thread_ids":[]}') return;
		try {
			if (navigator?.sendBeacon) {
				const blob = new Blob([payload], { type: "application/json" });
				navigator.sendBeacon(SUPPORT_CLEAR_THREADS_URL, blob);
			} else {
				void fetch(SUPPORT_CLEAR_THREADS_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: payload,
					keepalive: true,
				}).catch(() => {
					/* swallow network errors on unload */
				});
			}
		} catch (error) {
			console.error("Failed to flush thread history", error);
		}
	}, []);

	useEffect(() => {
		const handleBeforeUnload = () => {
			flushThreadHistory();
		};

		if (typeof window !== "undefined") {
			window.addEventListener("beforeunload", handleBeforeUnload);
		}

		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("beforeunload", handleBeforeUnload);
			}
			flushThreadHistory();
		};
	}, [flushThreadHistory]);

	useEffect(() => {
		if (messageListRef.current) {
			messageListRef.current.scrollTo({
				top: messageListRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages, isBotTyping]);

	const assistantIntroByIntent = useMemo(
		() => ({
			complaint:
				"Vamos registrar sua reclamação. Compartilhe detalhes como local, data e impacto para acelerar a análise.",
			question:
				"Ótimo! Envie sua dúvida com o máximo de contexto possível e eu já trago orientações.",
		}),
		[]
	);

	const appendMessage = useCallback((message: ChatMessage) => {
		setMessages((prev) => [...prev, message]);
	}, []);

	const resolveSupportType = useCallback(
		(currentIntent: ChatIntent | null) =>
			currentIntent === "complaint" ? "reclamacoes" : "duvidas",
		[]
	);

	const resolveThreadId = useCallback(
		(currentIntent: ChatIntent | null) => {
			const threadIds = sessionThreadIdsRef.current;
			if (!threadIds) {
				return generateThreadId();
			}
			if (currentIntent === "complaint") {
				return threadIds.complaint;
			}
			return threadIds.question;
		},
		[]
	);

	const requestAssistantReply = useCallback(
		async (currentIntent: ChatIntent | null, userMessage: string) => {
			setIsBotTyping(true);
			setLastError(null);
			try {
				const response = await fetch(SUPPORT_API_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: userMessage,
						user_name: resolvedUserName,
						type: resolveSupportType(currentIntent),
						thread_id: resolveThreadId(currentIntent),
					}),
				});
				if (!response.ok) {
					throw new Error(`Resposta inválida: ${response.status}`);
				}
				const data = await response.json();
				const answer = (data?.resposta ?? "").toString().trim();
				appendMessage({
					id: generateId("assistant-response"),
					sender: "assistant",
					text:
						answer ||
						"Não consegui obter uma resposta agora. Pode tentar novamente em instantes?",
					createdAt: formatTime(new Date()),
				});
			} catch (error) {
				console.error("Chat request error:", error);
				const friendlyError =
					"Estamos com instabilidade no atendimento automático. Tente novamente em alguns minutos.";
				setLastError(friendlyError);
				appendMessage({
					id: generateId("assistant-error"),
					sender: "assistant",
					text: friendlyError,
					createdAt: formatTime(new Date()),
				});
			} finally {
				setIsBotTyping(false);
			}
		},
		[appendMessage, resolveSupportType, resolveThreadId, resolvedUserName]
	);

	const resetChat = useCallback(() => {
		setMessages(createInitialMessages());
		setIntent(null);
		setInputValue("");
		setIsBotTyping(false);
		setLastError(null);
	}, []);

	const handleIntentChange = (value: ChatIntent) => {
		setIsBotTyping(false);
		setInputValue("");
		setIntent(value);
		setLastError(null);

		const resetMessages = createInitialMessages();
		const introMessage: ChatMessage = {
			id: generateId(`assistant-intent-${value}`),
			sender: "assistant",
			text: assistantIntroByIntent[value],
			createdAt: formatTime(new Date()),
		};

		setMessages([...resetMessages, introMessage]);
	};

	const handleSendMessage = async (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || isBotTyping) return;

		appendMessage({
			id: `user-${Date.now()}`,
			sender: "user",
			text: trimmed,
			createdAt: formatTime(new Date()),
		});

		setInputValue("");
		await requestAssistantReply(intent, trimmed);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await handleSendMessage(inputValue);
	};

	const handleQuickPrompt = async (prompt: string) => {
		setInputValue("");
		await handleSendMessage(prompt);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Header />

			<main className="max-w-6xl mx-auto px-4 py-12">
				<div className="mb-10 text-center">
					<span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-600">
						Central de Atendimento
					</span>
					<h1 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
						Chat de Reclamações &amp; Dúvidas
					</h1>
					<p className="mt-3 text-base text-gray-600 md:text-lg">
						Resolva questões com a equipe UFRoom em tempo real. Compartilhe o que está acontecendo e receba orientações sem sair da página.
					</p>
					<div className="mt-6 inline-flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-left text-sm text-amber-800">
						<span className="mt-[3px] inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
						<div>
							<strong className="block font-semibold">Atenção</strong>
							<p>
								Não feche o chat nem altere o objetivo enquanto conversa: o histórico pode ser perdido e será necessário começar novamente.
							</p>
						</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-[320px_1fr]">
					<aside className="space-y-6">
						<section className="rounded-3xl bg-white p-6 shadow-xl">
							<h2 className="text-lg font-bold text-red-600">Escolha o objetivo</h2>
							<p className="mt-2 text-sm text-gray-600">
								Personalize o atendimento selecionando o tipo de suporte desejado.
							</p>
							<div className="mt-4 flex flex-col gap-3">
								<button
									onClick={() => handleIntentChange("complaint")}
									className={`rounded-2xl border-2 px-4 py-3 text-left transition hover:border-red-600 hover:bg-red-50 ${
										intent === "complaint"
											? "border-red-600 bg-red-50 text-red-700"
											: "border-gray-200 text-gray-700"
									}`}
								>
									<span className="block text-sm font-semibold">Registrar reclamação</span>
									<span className="mt-1 block text-xs text-gray-500">
										Problemas com anúncios, pagamentos ou convivência.
									</span>
								</button>
								<button
									onClick={() => handleIntentChange("question")}
									className={`rounded-2xl border-2 px-4 py-3 text-left transition hover:border-red-600 hover:bg-red-50 ${
										intent === "question"
											? "border-red-600 bg-red-50 text-red-700"
											: "border-gray-200 text-gray-700"
									}`}
								>
									<span className="block text-sm font-semibold">Tirar dúvida</span>
									<span className="mt-1 block text-xs text-gray-500">
										Informações sobre reservas, políticas e documentação.
									</span>
								</button>
							</div>
						</section>

						<section className="rounded-3xl bg-white p-6 shadow-xl">
							<h2 className="text-lg font-bold text-gray-900">Como funciona?</h2>
							<ul className="mt-4 space-y-3 text-sm text-gray-600">
								<li className="flex items-start gap-2">
									<span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
									Descreva o cenário com detalhes para agilizar a solução.
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
									Acompanhe o protocolo e receba notificações pelo chat e e-mail.
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
									Se preferir falar com uma pessoa, solicite atendimento humano.
								</li>
							</ul>
						</section>

						<section className="rounded-3xl bg-red-600 p-6 text-white shadow-xl">
							<h2 className="text-lg font-bold">Atendimento prioritário</h2>
							<p className="mt-2 text-sm text-red-100">
								Casos urgentes como segurança, saúde ou pagamento retido recebem prioridade máxima.
							</p>
							<div className="mt-4 space-y-2 text-sm">
								<p className="font-semibold">Plantão 24h</p>
								<p>0800 000 4545</p>
								<p className="text-red-100">suporte@ufroom.com</p>
							</div>
						</section>
					</aside>

					<section className="rounded-3xl bg-white p-6 shadow-xl flex h-[65vh] md:h-[88vh] overflow-hidden">
						<div className="flex h-full w-full flex-col">
							<header className="flex items-center justify-between border-b border-gray-100 pb-4">
								<div>
									<h2 className="text-xl font-bold text-gray-900">Fale com a UFRoom</h2>
									<p className="text-sm text-gray-500">
										Tempo médio de resposta: menos de 5 minutos.
									</p>
								</div>
								<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
									Online agora
								</span>
							</header>

							<div className="mt-3 flex justify-between text-xs text-gray-500">
								<span>
									{intent === "complaint"
										? "Objetivo selecionado: Reclamações"
										: intent === "question"
										? "Objetivo selecionado: Dúvidas"
										: "Selecione um objetivo para personalizar o atendimento"}
								</span>
								<button
									onClick={resetChat}
									className="font-semibold text-red-600 transition hover:text-red-700"
									type="button"
								>
									Reiniciar chat
								</button>
							</div>

							<div
								ref={messageListRef}
								className="mt-6 flex-1 space-y-4 overflow-y-auto pr-2"
							>
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.sender === "user"
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm transition ${
												message.sender === "user"
													? "bg-red-600 text-white"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											<p>{message.text}</p>
											<span
												className={`mt-2 block text-[11px] font-semibold uppercase tracking-wide ${
													message.sender === "user"
														? "text-red-100"
														: "text-gray-400"
												}`}
											>
												{message.sender === "user" ? "Você" : "Assistente"} · {message.createdAt}
											</span>
										</div>
									</div>
								))}

								{isBotTyping && (
									<div className="flex justify-start">
										<div className="flex items-center gap-2 rounded-3xl bg-gray-100 px-4 py-2 text-sm text-gray-500 shadow-sm">
											<span className="relative flex h-2 w-2">
												<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
												<span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
											</span>
											Digitando...
										</div>
									</div>
								)}
							</div>

							<div className="mt-6 border-t border-gray-100 pt-4">
								{lastError && (
									<div className="mb-3 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">
										{lastError}
									</div>
								)}
								<div className="mb-3 flex flex-wrap gap-2">
									{quickPrompts.map((prompt) => (
										<button
											key={prompt}
											onClick={() => handleQuickPrompt(prompt)}
											className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 transition hover:border-red-600 hover:text-red-600"
										>
											{prompt}
										</button>
									))}
								</div>

								<form
									onSubmit={handleSubmit}
									className="flex items-center gap-3 rounded-full bg-gray-50 px-4 py-2"
								>
									<input
										value={inputValue}
										onChange={(event) => setInputValue(event.target.value)}
										placeholder="Digite sua mensagem..."
										className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
									/>
									<button
										type="submit"
										className="flex items-center justify-center rounded-full bg-red-600 p-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
										disabled={!inputValue.trim() || isBotTyping}
										aria-label="Enviar mensagem"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.8}
											stroke="currentColor"
											className="h-5 w-5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6 12L3 3l18 9-18 9 3-9h12"
											/>
										</svg>
									</button>
								</form>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
