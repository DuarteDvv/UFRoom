"use client";

import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Header from '../../components/Header';

const PAGE_SIZE = 10;

type AnnounceSnippet = {
  id: number;
  title: string;
  price: string;
  type: string;
  status?: string;
  image: string;
  lotation?: string; // <ocuppants / maxOccupants>
  nearbyUniversities?: string[];
};

export default function RoomListPage() {

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [announcements, setAnnouncements] = useState<AnnounceSnippet[]>([]);
  const [filters, setFilters] = useState({
    maxPrice: "",
    currentPeople: "",
    propertyType: "",
    announcementStatus: "",
    sexRestriction: "",
    nearbyUniversities: "",
    location: "",
  });

  //useEffect(() => { handleSearchOrFilter();}, []);

  const handleSearchOrFilter = async () => {
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: query, filters: filters, page: currentPage, pageSize: PAGE_SIZE }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    setAnnouncements(data);
  };
  

  const rooms: AnnounceSnippet[] = [
    {
      id: 1,
      title: "Studio • 10 min to Campus",
      price: "R$1,150 / mês",
      type: "Studio",
      image: "/studio.jpg",
      lotation: "1 / 2",
      nearbyUniversities: ["University A", "University B"],
    },
    {
      id: 1,
      title: "Studio • 10 min to Campus",
      price: "R$1,150 / mês",
      type: "Studio",
      image: "/studio.jpg",
      lotation: "1 / 2",
      nearbyUniversities: ["University A", "University B"],
    },
    {
      id: 2,
      title: "4BR Shared House",
      price: "R$3,000 / mês",
      type: "House",
      image: "/house.jpg",
      lotation: "3 / 4",
      nearbyUniversities: ["University C"],
    },
    {
      id: 3,
      title: "1BR Apartment",
      price: "R$2,200 / mês",
      type: "Apartment",
      image: "/house.jpg",
      lotation: "1 / 1",
      nearbyUniversities: ["University A", "University D"],
    },
    {
      id: 4,
      title: "2BR Condo with Pool",
      price: "R$2,800 / mês",
      type: "Condo",
      image: "/studio.jpg",
      lotation: "2 / 2",
      nearbyUniversities: ["University B"],
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Header />

      {/* Barra de busca arredondada centralizada */}
      <div className="bg-gray-100 py-8 px-4 flex justify-center">
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

      <div className="flex min-h-screen bg-gray-100 p-6">
        
        {/* Sidebar Filters*/}
        <div className="w-80 bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-6">
          <h2 className="font-extrabold text-2xl text-red-600 mb-2">Filtros</h2>
          <div className="flex flex-col gap-4">
            {/* Preço máximo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preço máximo</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="R$"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700 appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
            {/* Quantas pessoas já moram */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lotação</label>
              <input
                type="number"
                name="currentPeople"
                value={filters.currentPeople || ""}
                onChange={handleChange}
                placeholder="Quantas pessoas já moram"
                min={0}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700 appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
           
            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleChange}
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
                name="sexRestriction"
                value={filters.sexRestriction || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700"
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="both">Ambos</option>
              </select>
            </div>
            {/* Universidades próximas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Universidades próximas</label>
              <input
                type="text"
                name="nearbyUniversities"
                value={filters.nearbyUniversities || ""}
                onChange={handleChange}
                placeholder="Ex: UFU, UNITRI..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700"
              />
            </div>
            {/* Localização */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Localização</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Bairro, rua, ponto de referência..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 text-gray-700"
              />
            </div>
            <button
              onClick={handleSearchOrFilter}
              className="w-full bg-red-600 text-white p-2 rounded-lg font-bold mt-2 hover:bg-red-700 transition"
            >
              Aplicar filtros
            </button>
          </div>
        </div>

  {/* AnnounceSnippet Listings - 2 colunas */}
  <div className="flex-1 ml-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {rooms.map((room) => (
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
                  {room.status && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">{room.status}</span>
                  )}
                  {room.lotation && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">Lotação: {room.lotation}</span>
                  )}
                </div>
                <p className="font-bold text-lg text-gray-900 mb-2">{room.price}</p>
                {room.nearbyUniversities && room.nearbyUniversities.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 font-semibold">Universidades próximas:</span>
                    <ul className="flex flex-wrap gap-1 mt-1">
                      {room.nearbyUniversities.map((uni, idx) => (
                        <li key={idx} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">{uni}</li>
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
      </div>
    </div>
  );
}
