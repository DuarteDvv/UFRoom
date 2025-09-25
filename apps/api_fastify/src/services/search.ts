import { FastifyInstance } from "fastify";
import { SearchType } from "../schemas/search";



export async function searchRooms(
  server: FastifyInstance,
  body: SearchType
) 
{

  const elastic_client = server.elasticsearch;

  const { query, filters, pagination } = body;
  
  // Default pagination values
  const limit = pagination?.limit || 20;
  const cursor = pagination?.cursor;

  const esQuery: any = {
    index: 'announcements',
    body: {
      query: {
        bool: {
          must: [],
          filter: [],
          should: []
        }
      },
      size: limit,
      sort: [
        { _score: { order: "desc" } }, 
        { updated_at: { order: "desc" } }, 
        { id: { order: "asc" } } 
      ]
    }
  };

  console.log('Search Input:', JSON.stringify(body, null, 2));

  // Process cursor for pagination
  if (cursor) {
    try {
      const decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString());
      esQuery.body.search_after = decodedCursor;
    } catch (error) {
      console.error('Invalid cursor format:', error);
      // Continue without cursor if invalid
    }
  }

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

    // 7. FILTRO DE LOCALIZAÇÃO (buscar os anúncios próximos a uma coordenada)
    if (filters.location_coords && filters.location_coords !== null) {
      
      esQuery.body.query.bool.filter.push({
        geo_distance: {
          distance: "20km", // distância máxima (raio)
          location: {
            lat: filters.location_coords.lat,
            lon: filters.location_coords.lng
          }
        }
      });
    }
  }

  console.log('Elasticsearch Query:', JSON.stringify(esQuery, null, 2));

  const searchResults = await elastic_client.search(esQuery);

  const hits = searchResults.hits.hits;
  const rooms_raw = hits.map((hit: any) => hit._source);

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
  }));

  console.log('Search Results:', JSON.stringify(rooms_raw, null, 2));

  // Generate next cursor if we have results and they equal the limit (indicating there might be more)
  let nextCursor: string | null = null;
  if (hits.length === limit && hits.length > 0) {
    const lastHit = hits[hits.length - 1];
    const sortValues = lastHit.sort;
    if (sortValues && sortValues.length > 0) {
      nextCursor = Buffer.from(JSON.stringify(sortValues)).toString('base64');
    }
  }

  return {
    results: rooms,
    pagination: {
      limit,
      hasNextPage: nextCursor !== null,
      nextCursor,
      currentPageSize: rooms.length
    }
  };
}




