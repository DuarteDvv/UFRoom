import { FastifyInstance } from "fastify";
import { SearchType } from "../schemas/search";

const rooms: any[] = [
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

export async function searchRooms(
  server: FastifyInstance,
  query: string,
  filters: string[] = [],
  page: number = 1,
  pageSize: number = 10
) 
{

  console.log("Search query:", query);
  console.log("Filters:", filters);
  console.log("Page:", page);
  console.log("Page Size:", pageSize);

    return {
        results: rooms,
        total: rooms.length
    };

}



