"use client";

import { useState } from "react";
import Image from "next/image";
import Header from '../components/Header';

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
    <Header></Header>
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
