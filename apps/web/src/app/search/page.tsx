"use client";

import { useState } from "react";
import Image from "next/image";
import Header from '../../components/Header';
import { useAuth } from "../../global-contexts/authcontext";

type Room = {
  id: number;
  title: string;
  description: string;
  price: string;
  type: string;
  beds: number;
  baths: number;
  size: string;
  image?: string;
  tag?: string;
};

export default function RoomListPage() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implemente a lógica de busca aqui
    console.log("Search query:", search);
  };
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    propertyType: "",
    location: "",
    amenities: "",
  });

  const rooms: Room[] = [
    {
      id: 1,
      title: "Studio • 10 min to Campus",
      description: "Furnished studio with balcony and gym access. Close to bus line.",
      price: "$1,150 / month",
      type: "Studio",
      beds: 1,
      baths: 1,
      size: "320 sq ft",
      tag: "Furnished",
    },
    {
      id: 2,
      title: "4BR Shared House",
      description: "Large common areas, backyard, and on-site parking.",
      price: "$3,000 / month",
      type: "House",
      beds: 4,
      baths: 2,
      size: "1,600 sq ft",
      image: "/house.jpg",
      tag: "Parking",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    console.log("Filters applied:", filters);
    // Here you can implement filter logic on the rooms array
  };

  return (
    <div>
      <Header />
      {/* Barra de busca arredondada centralizada */}
      <div className="bg-gray-100 py-8 px-4 flex justify-center">
  <form onSubmit={handleSearch} className="w-full max-w-3xl flex items-center bg-white rounded-full shadow px-6 py-1">
          <span className="pr-2 text-gray-400">
            {/* Ícone de lupa SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar propriedades"
            className="flex-1 p-2 border-none focus:outline-none bg-transparent text-gray-700 rounded-full"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-1 rounded-full ml-2 hover:bg-red-700 transition"
          >
            Buscar
          </button>
        </form>
      </div>
      <div className="flex min-h-screen bg-gray-100 p-6">
        {/* Sidebar Filters */}
        <div className="w-64 bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-bold text-lg mb-4">Filters</h2>
          <div className="space-y-3">
            <input
              type="text"
              name="minPrice"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="maxPrice"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="bedrooms"
              placeholder="Bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="propertyType"
              placeholder="Property type"
              value={filters.propertyType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="amenities"
              placeholder="Amenities"
              value={filters.amenities}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleApplyFilters}
              className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
        {/* Room Listings */}
        <div className="flex-1 ml-6 grid grid-cols-1 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden flex">
              {room.image && (
                <div className="w-40 relative">
                  <Image src={room.image} alt={room.title} width={160} height={120} className="object-cover" />
                </div>
              )}
              <div className="p-4 flex-1">
                <h3 className="font-bold text-lg">{room.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-gray-700 text-sm">
                    {room.beds} beds • {room.baths} baths • {room.size}
                  </div>
                  {room.tag && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{room.tag}</span>}
                </div>
                <p className="font-bold mt-2">{room.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
