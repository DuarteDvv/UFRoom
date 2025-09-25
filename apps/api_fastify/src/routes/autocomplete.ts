import { FastifyInstance } from 'fastify';
import { getAutocompleteSuggestions } from '../controllers/autocomplete';

export default async function autocompleteRoutes(fastify: FastifyInstance) {
  fastify.get('/api/autocomplete', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          q: { 
            type: 'string', 
            minLength: 1,
            description: 'Query para buscar sugestões' 
          }
        },
        required: ['q']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista de sugestões baseadas na query'
            }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            suggestions: { 
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  }, getAutocompleteSuggestions);
}