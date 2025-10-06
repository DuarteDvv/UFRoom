"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, DollarSign, Bed, Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();

  // Estados para os filtros
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSearch = () => {
    const query = new URLSearchParams({
      location,
      max_price: price,   
      open_vac: bedrooms, 
    }).toString();

    router.push(`/search?${query}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-300 shadow-lg p-3.5">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Location */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 p-3.5 border border-gray-300 rounded-xl bg-white">
            <MapPin className="h-4.5 w-4.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-500 mb-1">Location</div>
              <input 
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 p-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 p-3.5 border border-gray-300 rounded-xl bg-white">
            <DollarSign className="h-4.5 w-4.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-500 mb-1">Preço Máximo</div>
              <input 
                type="text"
                placeholder="$500 - $1,500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 p-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 p-3.5 border border-gray-300 rounded-xl bg-white">
            <Bed className="h-4.5 w-4.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-500 mb-1">Quartos</div>
              <input 
                type="text"
                placeholder="Studio, 1, 2+"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 p-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Botão de busca */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 rounded-xl text-white font-bold text-sm hover:bg-red-700 transition-colors min-w-[145px]"
        >
          <Search className="h-4.5 w-4.5" />
          Search Now
        </button>
      </div>
    </div>
  );
}
