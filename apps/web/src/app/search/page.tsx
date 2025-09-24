"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from '../../components/Header';

const PAGE_SIZE = 10;

type AnnounceSnippet = {
  id: number;
  title: string;
  price: string;
  type: string;
  status: string;
  image: string;
  vagas?: string; // vagas disponíveis
  sex_restriction?: string; // restrição de sexo
  near_university?: string[];
  distance_to_university?: string[];
  updated_at?: string; // dias desde a última atualização
};

export default function RoomListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [announcements, setAnnouncements] = useState<AnnounceSnippet[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    max_price: "",
    open_vac: "",
    room_type: "",
    status: "",
    sex_restriction: "",
    near_university: "",
    location: "",
  });

  // Carregar parâmetros da URL quando o componente monta ou URL muda
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlMaxPrice = searchParams.get('max_price') || '';
    const urlOpenVac = searchParams.get('open_vac') || '';
    const urlRoomType = searchParams.get('room_type') || '';
    const urlStatus = searchParams.get('status') || '';
    const urlSexRestriction = searchParams.get('sex_restriction') || '';
    const urlNearUniversity = searchParams.get('near_university') || '';
    const urlLocation = searchParams.get('location') || '';

    const newFilters = {
      max_price: urlMaxPrice,
      open_vac: urlOpenVac,
      room_type: urlRoomType,
      status: urlStatus,
      sex_restriction: urlSexRestriction,
      near_university: urlNearUniversity,
      location: urlLocation,
    };

    setQuery(urlQuery);
    setFilters(newFilters);

    // Fazer a busca diretamente aqui sem chamar handleSearchOrFilter
    performSearch(urlQuery, newFilters);
  }, [searchParams]);

  const updateURL = (newQuery: string, newFilters: typeof filters) => {
    const params = new URLSearchParams();
    
    if (newQuery) params.set('q', newQuery);
    if (newFilters.max_price) params.set('max_price', newFilters.max_price);
    if (newFilters.open_vac) params.set('open_vac', newFilters.open_vac);
    if (newFilters.room_type) params.set('room_type', newFilters.room_type);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.sex_restriction) params.set('sex_restriction', newFilters.sex_restriction);
    if (newFilters.near_university) params.set('near_university', newFilters.near_university);
    if (newFilters.location) params.set('location', newFilters.location);

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.push(newURL);
  };

  // Função para fazer a busca sem atualizar a URL
  const performSearch = async (searchQuery: string, searchFilters: typeof filters) => {
    try {
      const res = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        body: JSON.stringify({ query: searchQuery, filters: searchFilters}),
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers.get('content-type'));
      
      // Verificar se a resposta é JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Response is not JSON:', text);
        return;
      }

      if (!res.ok) {
        console.error('HTTP error:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log('Search response:', data);
      setAnnouncements(data.results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearchOrFilter = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Atualizar URL com os parâmetros atuais (isso vai disparar o useEffect)
    updateURL(query, filters);
  };
  

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
   
    if (name === 'max_price' || name === 'open_vac') {
      
      if (value === '' || (/^\d+$/.test(value))) {
        setFilters({ ...filters, [name]: value });
      }
      
      return;
    }
    
    setFilters({ ...filters, [name]: value });
  };


  return (
    <div>
      <Header />

      {/* Barra de busca e botão de filtros */}
      <div className="bg-gray-100 py-8 px-4">
        <div className="relative max-w-6xl mx-auto">
          {/* Botão para mostrar/esconder filtros - próximo à barra */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white border-2 border-red-600 text-red-600 p-3 rounded-lg shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center gap-2 z-10"
            title={showFilters ? "Esconder filtros" : "Mostrar filtros"}
          >
          {showFilters ? (
            <>
              {/* Ícone de filtro com X */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              <span className="text-sm font-semibold hidden sm:block">Esconder</span>
            </>
          ) : (
            <>
              {/* Ícone de filtro */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              <span className="text-sm font-semibold hidden sm:block">Filtros</span>
            </>
          )}
          </button>

          {/* Barra de busca - centralizada */}
          <div className="flex justify-center">
            <form onSubmit={handleSearchOrFilter} className="w-full max-w-3xl flex gap-0 items-center">
            <div className="flex-1 flex items-center bg-white rounded-l-full shadow px-6 py-1">
              <span className="pr-2 text-gray-400">
                {/* Ícone de lupa SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar propriedades"
                className="flex-1 p-2 border-none focus:outline-none bg-transparent text-gray-700 rounded-l-full"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white px-8 py-1 rounded-r-full h-[48px] font-bold text-base hover:bg-red-700 transition border-l-2 border-white"
              style={{ minHeight: '48px' }}
            >
              Buscar
            </button>
          </form>
          </div>
        </div>
      </div>      <div className="flex min-h-screen bg-gray-100 p-6">

        {/* Sidebar Filters*/}
        <div className={`w-80 bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-6 transition-all duration-300 ${
          showFilters ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute -left-80'
        }`}>
          <h2 className="font-extrabold text-2xl text-red-600 mb-2">Filtros</h2>
          <div className="flex flex-col gap-4">
            {/* Preço máximo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preço máximo</label>
              <input
                type="text"
                inputMode="numeric"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                onKeyDown={(e) => {
                  
                  const allowedKeys = [
                    'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
                    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                    'Home', 'End'
                  ];
                  
                  const isNumber = /^[0-9]$/.test(e.key);
                  const isAllowedKey = allowedKeys.includes(e.key);
                
                  if (!isNumber && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
               
                  e.preventDefault();
                  const paste = e.clipboardData.getData('text');
                  if (/^\d+$/.test(paste)) {
                    setFilters({ ...filters, max_price: paste });
                  }
                }}
                placeholder="R$"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700 appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
            {/* Vagas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vagas Disponiveis</label>
              <input
                type="text"
                inputMode="numeric"
                name="open_vac"
                value={filters.open_vac || ""}
                onChange={handleFilterChange}
                onKeyDown={(e) => {
                  
                  const allowedKeys = [
                    'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
                    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                    'Home', 'End'
                  ];
                  
                  const isNumber = /^[0-9]$/.test(e.key);
                  const isAllowedKey = allowedKeys.includes(e.key);
                  
                  if (!isNumber && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                 
                  e.preventDefault();
                  const paste = e.clipboardData.getData('text');
                  if (/^\d+$/.test(paste)) {
                    setFilters({ ...filters, open_vac: paste });
                  }
                }}

                placeholder="Quantas vagas precisa ?"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700 appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
           
            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de quarto</label>
              <select
                name="room_type"
                value={filters.room_type}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700"
              >
                <option value="">Selecione</option>
                <option value="kitnet">Kitnet</option>  
                <option value="individual_room">Quarto individual</option>
                <option value="shared_room">Quarto compartilhado</option>
              </select>
            </div>
            {/* Restrição de sexo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Restrição de sexo</label>
              <select
                name="sex_restriction"
                value={filters.sex_restriction || ""}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700"
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="both">Ambos</option>
              </select>
            </div>
            {/* Universidade próxima */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Universidades próximas</label>
              <select
                name="near_university"
                value={filters.near_university || ""}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700"
              >
                <option value="">Selecione</option>
                <option value="UFMG CAMPUS 1">UFMG CAMPUS 1</option>
                <option value="UFMG CAMPUS 2">UFMG CAMPUS 2</option>
                <option value="UFMG">UFMG</option>
                <option value="PUC">PUC</option>
                <option value="PUC MINAS">PUC MINAS</option>
              </select>
            </div>
            {/* Localização */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Localização</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Bairro, rua, ponto de referência..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700"
              />
            </div>
            <button
              onClick={() => updateURL(query, filters)}
              className="w-full bg-red-600 text-white p-2 rounded-lg font-bold mt-2 hover:bg-red-700 transition"
            >
              Aplicar filtros
            </button>
          </div>
        </div>

  {/* AnnounceSnippet Listings - 2 ou 3 colunas */}
  <div className={`flex-1 transition-all duration-300 ${
    showFilters ? 'ml-6' : 'ml-0'
  }`}>
    {announcements.length === 0 ? (
      /* Mensagem de nenhum resultado */
      <div className="flex flex-col items-center justify-center min-h-[500px] pt-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          {/* Ícone de busca vazia */}
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Nenhum resultado encontrado
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Não encontramos anúncios que correspondam aos seus critérios de busca. 
            Tente ajustar os filtros ou usar termos diferentes.
          </p>
          
          <div className="space-y-3 text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Tente expandir a área de busca
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Remova alguns filtros
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Use palavras-chave diferentes
            </p>
          </div>
          
          <button
            onClick={() => {
              const newFilters = {
                max_price: "",
                open_vac: "",
                room_type: "",
                status: "",
                sex_restriction: "",
                near_university: "",
                location: "",
              };
              setQuery("");
              setFilters(newFilters);
              updateURL("", newFilters);
            }}
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Limpar filtros e buscar novamente
          </button>
        </div>
      </div>
    ) : (
      /* Grid com resultados */
      <div className={`grid gap-8 transition-all duration-300 ${
        showFilters 
          ? 'grid-cols-1 sm:grid-cols-2' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {announcements.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.02] transition-transform border border-gray-100">
              {room.image && (
                <div className="w-full h-40 relative">
                  <Image src={room.image} alt={room.title} fill style={{objectFit: 'cover'}} className="" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="font-extrabold text-xl text-red-600 mb-1">{room.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">{room.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    room.status === "Disponível" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {room.status}
                  </span>
                  {room.vagas && room.status === "Disponível" && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">Vagas: {room.vagas}</span>
                  )}
                  {room.sex_restriction && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      room.sex_restriction === "male" 
                        ? "bg-blue-100 text-blue-800" 
                        : room.sex_restriction === "female"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {room.sex_restriction === "male" ? "👨 Apenas Masculino" : 
                       room.sex_restriction === "female" ? "👩 Apenas Feminino" : 
                       "👥 Ambos"}
                    </span>
                  )}
                </div>
                <p className="font-bold text-lg text-gray-900 mb-2">{room.price}</p>
                {room.near_university && room.near_university.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 font-semibold">Universidades próximas:</span>
                    <ul className="flex flex-wrap gap-1 mt-1">
                      {room.near_university.map((uni, idx) => (
                        <li key={idx} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          {uni}
                          {room.distance_to_university && room.distance_to_university[idx] && (
                            <span className="ml-1 font-semibold">({room.distance_to_university[idx]})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-end mt-auto">
                  <button className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-red-700 transition">Ver detalhes</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
  );
}
