import { FastifyInstance } from "fastify";
import { SearchType } from "../schemas/search";



export async function searchRooms(
  server: FastifyInstance,
  body: SearchType
) 
{

  const elastic_client = server.elasticsearch;

  const { query, filters } = body;

  const esQuery: any = {
    index: 'announcements',
    body: {
      query: {
        bool: {
          must: [],
          filter: [],
          should: []
        }
      }
    }
  };

  console.log('Search Input:', JSON.stringify(body, null, 2));


  // dar maior peso para anuncios com status 'available' e mais recentes
  esQuery.body.query.bool.should.push(
    {
      term: { 
        "status": { 
          value: "available",
          boost: 2  // Aumenta a relevância dos anúncios disponíveis
        } 
      },
    },
    {
      range: {
        updated_at: {
          gte: "now-30d/d", 
          boost: 1.5       // Aumenta a relevância dos anúncios mais recentes últimos 30 dias
        }
      }
    }
  );  

  // adicionar query de busca
  if (query) {
    esQuery.body.query.bool.must.push({
      multi_match: {
        query: query,
        fields: ['title^3', 'description^2', 'rules'],
        fuzziness: 'AUTO'
      }
    });
  } 
  else {
    esQuery.body.query.bool.must.push({ match_all: {} });
  }
  

  // adicionar filtros
  if (filters) {

    // 1. FILTRO DE PREÇO MÁXIMO (range filter)
    if (filters.max_price) {
      esQuery.body.query.bool.filter.push({
        range: { 
          price: { 
            lte: parseFloat(filters.max_price) 
          } 
        }
      });
    }

    // 2. FILTRO DE VAGAS DISPONÍVEIS (range filter)  
    if (filters.open_vac) {
      esQuery.body.query.bool.filter.push({
        range: { 
          open_vac: { 
            gte: parseInt(filters.open_vac) 
          } 
        }
      });
    }

    // 3. FILTRO DE TIPO DE QUARTO (term filter)
    if (filters.room_type && filters.room_type.length > 0) {
      
      esQuery.body.query.bool.filter.push({
        term: { 
          "type_of": filters.room_type 
        }
      });
    }

    // 4. FILTRO DE STATUS (term filter)
    if (filters.status && filters.status.length > 0) {
      esQuery.body.query.bool.filter.push({
        term: { 
          "status": filters.status 
        }
      });
    }

    // 5. FILTRO DE RESTRIÇÃO DE SEXO (term filter)
    if (filters.sex_restriction && filters.sex_restriction.length > 0) {
      esQuery.body.query.bool.filter.push({
        term: { 
          "sex_restriction": filters.sex_restriction 
        }
      });
    }

    // 6. FILTRO DE UNIVERSIDADE PRÓXIMA (nested filter)
    if (filters.near_university && filters.near_university.length > 0) {
      esQuery.body.query.bool.filter.push({
        nested: {
          path: "universities",
          query: {
            term: {
              "universities.abbreviation": filters.near_university
            }
          }
        }
      });
    }

    // 7. FILTRO DE LOCALIZAÇÃO (match/wildcard para busca textual)
    if (filters.location && filters.location.length > 0) {
      esQuery.body.query.bool.filter.push({
        multi_match: {
          query: filters.location,
          fields: ["address", "neighborhood", "city"],
          fuzziness: "AUTO"
        }
      });
    }
  }

  console.log('Elasticsearch Query:', JSON.stringify(esQuery, null, 2));

  const searchResults = await elastic_client.search(esQuery);

  const rooms_raw = searchResults.hits.hits.map((hit: any) => hit._source);

  const rooms = rooms_raw.map((room: any) => ({
    id: room.id,
    title: room.title,
    price: `R$${room.price} / mês`,
    type: room.type_of === 'individual_room' ? "Quarto Individual" : room.type_of === 'shared_room' ? "Quarto Compartilhado" :  "Kitnet",
    status: room.status === 'available' ? "Disponível" : "Ocupado",
    image: room.images && room.images.length > 0 ? room.images[0] : "/studio.jpg",
    vagas: room.open_vac?.toString(),
    sex_restriction: room.sex_restriction,
    near_university: room.universities?.map((u: any) => u.abbreviation) || [],
    distance_to_university: room.universities?.map((u: any) => `${u.distance} km`) || [],
    updated_at: room.updated_at
  }));

  console.log('Search Results:', JSON.stringify(rooms_raw, null, 2));

  return {
    results: rooms
  };
}




