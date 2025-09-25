import { FastifyInstance } from "fastify";

export async function getAutocompleteSuggestions(
  server: FastifyInstance,
  query: string
) {
  const elastic_client = server.elasticsearch;
  
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // busca por sugestões usando match_phrase_prefix e fuzzy match
    const searchQuery = {
      index: 'announcements',
      body: {
        query: {
          bool: {
            should: [
              // busca por prefixo no título (maior prioridade)
              {
                match_phrase_prefix: {
                  title: {
                    query: query,
                    max_expansions: 10,
                    boost: 3
                  }
                }
              },
              // busca por prefixo na descrição
              {
                match_phrase_prefix: {
                  description: {
                    query: query,
                    max_expansions: 5,
                    boost: 1.5
                  }
                }
              },
              // busca fuzzy no título para correção de erros de digitação
              {
                match: {
                  title: {
                    query: query,
                    fuzziness: "AUTO",
                    boost: 2
                  }
                }
              },
              // busca fuzzy na descrição
              {
                match: {
                  description: {
                    query: query,
                    fuzziness: "AUTO",
                    boost: 1
                  }
                }
              }
            ],
            minimum_should_match: 1
          }
        },
        _source: ['title', 'description'],
        size: 8,
        // ordenar por relevância e dar preferência para anúncios disponíveis
        sort: [
          { _score: { order: 'desc' } }
        ]
      }
    };

    const response = await elastic_client.search(searchQuery);
    
    // sugestões únicas dos resultados
    const suggestions = new Set<string>();
    
    response.hits.hits.forEach((hit: any) => {
      if (hit._source?.title) {
        suggestions.add(hit._source.title);
      }
    });

    return Array.from(suggestions).slice(0, 6);

  } catch (error) {
    console.error('Autocomplete search error:', error);
    return [];
  }
}