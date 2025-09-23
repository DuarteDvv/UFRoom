import { FastifyInstance } from "fastify";
import { SearchType } from "../schemas/search";

const rooms: any[] = [
  {
    id: 1,
    title: "Studio • 10 min to Campus",
    price: "R$1,150 / mês",
    type: "Studio",
    status: "Disponível",
    image: "/studio.jpg",
    vagas: "2",
    near_university: ["University A", "University B"],
    distance_to_university: ["500m", "1km"]
  },
  {
    id: 2,
    title: "Studio • 10 min to Campus",
    price: "R$1,150 / mês",
    type: "Studio",
    status: "Ocupado",
    image: "/studio.jpg",
    vagas: "1",
    near_university: ["University A", "University B"],
    distance_to_university: ["500m", "1km"]
  },
  {
    id: 3,
    title: "4BR Shared House",
    price: "R$3,000 / mês",
    type: "House",
    status: "Disponível",
    image: "/house.jpg",
    vagas: "1",
    near_university: ["University C"],
    distance_to_university: ["2km"]
  },
  {
    id: 4,
    title: "1BR Apartment",
    price: "R$2,200 / mês",
    type: "Apartment",
    status: "Ocupado",
    image: "/house.jpg",
    vagas: "1",
    near_university: ["University A", "University D"],
    distance_to_university: ["1.5km", "2km"]
  },
  {
    id: 5,
    title: "2BR Condo with Pool",
    price: "R$2,800 / mês",
    type: "Condo",
    status: "Disponível",
    image: "/studio.jpg",
    vagas: "3",
    near_university: ["University B"],
    distance_to_university: ["800m"]
  },
  {
    id: 6,
    title: "3BR Penthouse",
    price: "R$4,500 / mês",
    type: "Penthouse",
    status: "Disponível",
    image: "/penthouse.jpg",
    vagas: "2",
    near_university: ["University E"],
    distance_to_university: ["3km"]
  },
  {
    id: 7,
    title: "1BR Loft Downtown",
    price: "R$1,900 / mês",
    type: "Loft",
    status: "Ocupado",
    image: "/loft.jpg",
    vagas: "1",
    near_university: ["University A"],
    distance_to_university: ["700m"]
  },
  {
    id: 8,
    title: "Shared Room in 2BR Apartment",
    price: "R$950 / mês",
    type: "Apartment",
    status: "Disponível",
    image: "/shared.jpg",
    vagas: "1",
    near_university: ["University B", "University C"],
    distance_to_university: ["1.2km", "2.5km"]
  },
  {
    id: 9,
    title: "Studio with Balcony",
    price: "R$1,300 / mês",
    type: "Studio",
    status: "Disponível",
    image: "/studio-balcony.jpg",
    vagas: "1",
    near_university: ["University D"],
    distance_to_university: ["900m"]
  },
  {
    id: 10,
    title: "2BR House with Garden",
    price: "R$2,400 / mês",
    type: "House",
    status: "Ocupado",
    image: "/garden-house.jpg",
    vagas: "2",
    near_university: ["University E"],
    distance_to_university: ["2.8km"]
  },
  {
    id: 11,
    title: "1BR Apartment with Garage",
    price: "R$2,100 / mês",
    type: "Apartment",
    status: "Disponível",
    image: "/garage-apartment.jpg",
    vagas: "1",
    near_university: ["University C"],
    distance_to_university: ["1.7km"]
  },
  {
    id: 12,
    title: "3BR Condo with Gym",
    price: "R$3,200 / mês",
    type: "Condo",
    status: "Disponível",
    image: "/gym-condo.jpg",
    vagas: "2",
    near_university: ["University B", "University D"],
    distance_to_university: ["1.1km", "2.3km"]
  },
  {
    id: 13,
    title: "Studio in Historic Center",
    price: "R$1,250 / mês",
    type: "Studio",
    status: "Ocupado",
    image: "/historic-studio.jpg",
    vagas: "1",
    near_university: ["University A"],
    distance_to_university: ["600m"]
  },
  {
    id: 14,
    title: "4BR House with Pool",
    price: "R$4,000 / mês",
    type: "House",
    status: "Disponível",
    image: "/pool-house.jpg",
    vagas: "3",
    near_university: ["University E"],
    distance_to_university: ["3.5km"]
  },
  {
    id: 15,
    title: "2BR Apartment with View",
    price: "R$2,600 / mês",
    type: "Apartment",
    status: "Disponível",
    image: "/view-apartment.jpg",
    vagas: "2",
    near_university: ["University D"],
    distance_to_university: ["1.8km"]
  }
  ];

export async function searchRooms(
  server: FastifyInstance,
  body: SearchType
) 
{

  console.log("Search query:", body.query);
  console.log("Filters:", body.filters);

  

    return {
        results: rooms,
        total: rooms.length
    };

}



