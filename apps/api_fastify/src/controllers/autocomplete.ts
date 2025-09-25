import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as AutocompleteService from '../services/autocomplete';

interface AutocompleteQuery {
  q: string;
}

export async function getAutocompleteSuggestions(
  request: FastifyRequest<{ Querystring: AutocompleteQuery }>,
  reply: FastifyReply
) {
  try {
    const { q } = request.query;
    
    if (!q || q.length < 2) {
      return reply.send({ suggestions: [] });
    }

    const suggestions = await AutocompleteService.getAutocompleteSuggestions(
      request.server as FastifyInstance,
      q
    );

    return reply.send({ suggestions });

  } catch (error) {
    console.error('Autocomplete controller error:', error);
    return reply.status(500).send({ 
      error: 'Erro interno do servidor',
      suggestions: [] 
    });
  }
}