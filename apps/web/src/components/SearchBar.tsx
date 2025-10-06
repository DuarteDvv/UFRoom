"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MapPin, DollarSign, Bed, Search } from "lucide-react";

interface University {
  id: number;
  name: string;
  abbreviation: string;
}

export default function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados para filtros
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [university, setUniversity] = useState<University | null>(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [price, setPrice] = useState("");
  const [roomType, setRoomType] = useState(""); 

  // Buscar universidades da API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/universities");
        if (!res.ok) throw new Error("Erro ao buscar universidades");
        const data: University[] = await res.json();
        setUniversities(data);
        setFilteredUniversities(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredUniversities(universities);
    } else {
      setFilteredUniversities(
        universities.filter((u) =>
          u.abbreviation.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, universities]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUniversity = (u: University) => {
    setUniversity(u);
    setSearch(u.abbreviation);
    setDropdownOpen(false);
  };

    // Função para formatar o preço
  const formatPriceDisplay = (value: string) => {
    if (!value) return "";
    return `R$ ${value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Função para lidar com a mudança no preço
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove "R$ " e todos os pontos para obter apenas números
    const numbersOnly = value.replace("R$ ", "").replace(/\./g, "");
    
    // Permite apenas números e limita o comprimento
    if (/^\d*$/.test(numbersOnly) && numbersOnly.length <= 7) {
      setPrice(numbersOnly);
    }
  };

  // Valor formatado para exibição
  const displayPrice = price ? formatPriceDisplay(price) : "";

  const handleSearch = () => {
    const query = new URLSearchParams({
      near_university: university?.abbreviation || "",
      max_price: price,
      room_type: roomType,
    }).toString();

    router.push(`/search?${query}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-300 shadow-lg p-3.5" ref={containerRef}>
      <div className="flex flex-col md:flex-row gap-3">
        {/* University dropdown */}
        <div className="flex-1 min-w-0 relative">
          <div className="flex items-center gap-2.5 p-3.5 border border-gray-300 rounded-xl bg-white cursor-pointer">
            <MapPin className="h-4.5 w-4.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-500 mb-1">
                Selecione a sua universidade
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Digite para buscar..."
                className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 p-0 focus:outline-none"
              />
            </div>
          </div>

          {dropdownOpen && filteredUniversities.length > 0 && (
            <ul className="absolute z-10 w-full max-h-60 overflow-y-auto mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
              {filteredUniversities.map((u) => (
                <li
                  key={u.id}
                  onClick={() => handleSelectUniversity(u)}
                  className="px-4 py-2 cursor-pointer hover:bg-red-600 hover:text-white text-gray-900"
                >
                  {u.abbreviation}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 p-3.5 border border-gray-300 rounded-xl bg-white">
            <DollarSign className="h-4.5 w-4.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-500 mb-1">Preço Máximo</div>
              <input
                type="text"
                placeholder="R$ 500 - 1.500"
                value={displayPrice}
                onChange={handlePriceChange}
                className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 p-0 focus:outline-none"
              />
            </div>
          </div>
        </div>


        {/* Tipo de acomodação */}
        <div className="flex-1 min-w-0 relative">
          <div className="flex items-center gap-2.5 p-3.5 border border-gray-300 rounded-xl bg-white cursor-pointer">
            <Bed className="h-4.5 w-4.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-500 mb-1">Tipo de acomodação</div>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
              >
                <option value="">Selecione...</option>
                <option value="individual_room">Quarto individual</option>
                <option value="shared_room">Quarto compartilhado</option>
                <option value="kitnet">Kitnet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botão de busca */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 rounded-xl text-white font-bold text-sm hover:bg-red-700 transition-colors min-w-[145px]"
        >
          <Search className="h-4.5 w-4.5" />
          Buscar
        </button>
      </div>
    </div>
  );
}
