"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../global-contexts/authcontext";
import { Twitter, Instagram, Facebook } from "lucide-react";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";

export default function Homepage() {
  const [announcements, setAnnouncements] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:3001/announcements");
        if (!res.ok) throw new Error("Erro ao buscar anúncios");
        const data = await res.json();
        setAnnouncements(data.slice(0, 3)); // pega os 3 primeiros
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div>
      {/* Header */}
      <Header />

      <div className="min-h-screen bg-housing-appBg">
        {/* Hero Section */}
        <section className="bg-housing-pink px-5 md:px-10 py-18">
          <div className="max-w-7xl mx-auto">
            <div className="py-18">
              <div className="mb-7">
                <h1 className="text-4xl md:text-4xl font-bold text-housing-navy mb-4 leading-tight">
                  O imóvel perfeito te aguarda
                </h1>
                <p className="text-base font-bold text-housing-gray max-w-4xl">
                  Encontre o imóvel ideal perto do seu campus. Pesquisa simples,
                  preço transparente e anunciantes confiáveis.
                </p>
              </div>

              {/* Search Form */}
              <div>
                <SearchBar />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="px-5 md:px-10 py-14">
          <div className="max-w-7xl mx-auto">
            <div className="px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-housing-navy mb-1">
                    Destaques
                  </h2>
                  <p className="text-sm font-bold text-housing-gray">
                    Imóveis selecionados para você
                  </p>
                </div>

                {/* ✅ Botão redireciona para /search sem parâmetros */}
                <button
                  onClick={() => router.push("/search")}
                  className="mt-4 md:mt-0 px-4 py-2.5 bg-white border border-housing-lightGray rounded-xl text-sm font-bold text-housing-navy hover:bg-gray-50"
                >
                  Ver todos
                </button>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {announcements.length === 0 ? (
                  <p className="text-housing-gray font-bold">Carregando anúncios...</p>
                ) : (
                  announcements.map((a) => (
                    <div
                      key={a.id}
                      className="bg-white rounded-3xl border border-housing-lightGray overflow-hidden"
                    >
                      <img
                        src={
                          a.announcement_img?.[0]?.img_url ||
                          "/placeholder-property.jpg"
                        }
                        alt={a.title}
                        className="w-full h-42 object-cover"
                      />
                      <div className="p-3.5">
                        <div className="mb-2">
                          <div className="text-base font-bold text-housing-navy mb-1">
                            R${a.price}/mês
                          </div>
                          <div className="flex items-start gap-2.5 text-xs font-bold text-housing-gray mb-2">
                            <span>
                              {a.occupants}/{a.max_occupants} ocupantes
                            </span>
                            <span>{a.type_of}</span>
                          </div>
                          <p className="text-sm font-bold text-housing-navy">
                            {a.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold mb-2">
                            {/* Tipo de acomodação */}
                            <span className="px-2.5 py-1.5 bg-green-200 text-green-800 rounded-full">
                              {a.type_of.charAt(0).toUpperCase() + a.type_of.slice(1)}
                            </span>

                            {/* Vagas */}
                            <span className="px-2.5 py-1.5 bg-blue-200 text-blue-800 rounded-full">
                              Vagas: {a.max_occupants - a.occupants}
                            </span>

                            {/* Sexo permitido */}
                            <span className="px-2.5 py-1.5 bg-purple-200 text-purple-800 rounded-full">
                              {a.sex_restriction === "both"
                                ? "👥 Ambos"
                                : a.sex_restriction === "male"
                                ? "👨 Apenas Masculino"
                                : "👩 Apenas Feminino"}
                            </span>
                          </div>

                          <button
                            onClick={() => router.push(`/announcement/${a.id}`)}
                            className="px-4 py-2.5 bg-housing-red text-white text-sm font-bold rounded-xl hover:bg-red-700"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-housing-lightGray">
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              {/* Logo and Social */}
              <div className="flex flex-col items-start">
                <div className="flex-shrink-0">
                  <Image src="/logo.png" alt="Logo" width={120} height={120} />
                </div>
                <div className="flex items-center gap-2.5 mt-2">
                  <Twitter className="h-5 w-5 text-housing-navy" />
                  <Instagram className="h-5 w-5 text-housing-navy" />
                  <Facebook className="h-5 w-5 text-housing-navy" />
                </div>
              </div>

              {/* Footer Links */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-8 flex-1 max-w-md">
                <div className="space-y-2.5">
                  <a
                    href="#"
                    className="block text-sm font-bold text-housing-navy hover:text-housing-gray"
                  >
                    Política de Privacidade
                  </a>
                  <a
                    href="#"
                    className="block text-sm font-bold text-housing-navy hover:text-housing-gray"
                  >
                    Termos de Uso
                  </a>
                  <a
                    href="#"
                    className="block text-sm font-bold text-housing-navy hover:text-housing-gray"
                  >
                    Contato
                  </a>
                </div>
                <div className="space-y-2.5">
                  <a
                    href="#"
                    className="block text-sm font-bold text-housing-navy hover:text-housing-gray"
                  >
                    Ajuda
                  </a>
                  <a
                    href="#"
                    className="block text-sm font-bold text-housing-navy hover:text-housing-gray"
                  >
                    Carreiras
                  </a>
                  <a
                    href="#"
                    className="block text-sm font-bold text-housing-navy hover:text-housing-gray"
                  >
                    Para Anunciantes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
