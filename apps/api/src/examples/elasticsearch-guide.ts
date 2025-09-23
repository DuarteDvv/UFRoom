/**
 * 🔍 GUIA DE USO DO ELASTICSEARCH NO FASTIFY
 * 
 * Este guia mostra como usar o plugin do Elasticsearch corretamente
 */

import { FastifyInstance } from 'fastify';

// CONFIGURAÇÃO DO AMBIENTE
// Adicione no seu .env:
// ELASTICSEARCH_URL=http://localhost:9200

// ============================================================================
// 1. PLUGIN JÁ REGISTRADO NO SEU SERVER.TS
// ============================================================================

/**
 * O plugin já foi registrado no server.ts:
 * 
 * await server.register(elasticsearchPlugin, {
 *   node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
 * })
 * 
 * Isso adiciona `fastify.elasticsearch` em todas as rotas
 */

// ============================================================================
// 2. COMO USAR NAS SUAS ROTAS/CONTROLLERS
// ============================================================================

export const searchController = async (request: any, reply: any, fastify: FastifyInstance) => {
  const { query, filters, page = 1, pageSize = 10 } = request.body;

  try {
    // Construir query do Elasticsearch
    const searchBody: any = {
      query: {
        bool: {
          must: [],
          filter: []
        }
      },
      from: (page - 1) * pageSize,
      size: pageSize,
      sort: [
        { _score: { order: 'desc' } },
        { created_at: { order: 'desc' } }
      ]
    };

    // Adicionar busca por texto
    if (query) {
      searchBody.query.bool.must.push({
        multi_match: {
          query: query,
          fields: ['title^2', 'description', 'location'],
          fuzziness: 'AUTO'
        }
      });
    }

    // Adicionar filtros
    if (filters?.max_price) {
      searchBody.query.bool.filter.push({
        range: { price: { lte: parseInt(filters.max_price) } }
      });
    }

    if (filters?.room_type) {
      searchBody.query.bool.filter.push({
        term: { room_type: filters.room_type }
      });
    }

    // Executar busca
    const result = await fastify.elasticsearch.search({
      index: 'announcements',
      ...searchBody
    });

    // Processar resultados
    const hits = result.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
      score: hit._score
    }));

    // Lidar com diferentes tipos de total
    const totalHits = typeof result.hits.total === 'number' 
      ? result.hits.total 
      : result.hits.total?.value || 0;

    return {
      data: hits,
      total: totalHits,
      page,
      pageSize
    };

  } catch (error) {
    fastify.log.error('Erro na busca Elasticsearch:');
    fastify.log.error(error);
    throw error;
  }
};

// ============================================================================
// 3. INDEXAR DOCUMENTOS
// ============================================================================

export const indexAnnouncementController = async (announcementId: number, fastify: FastifyInstance) => {
  try {
    // Buscar dados no Prisma
    const announcement = await fastify.prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        // adicione os includes que precisar
      }
    });

    if (!announcement) {
      throw new Error('Anúncio não encontrado');
    }

    // Indexar no Elasticsearch
    const result = await fastify.elasticsearch.index({
      index: 'announcements',
      id: announcement.id.toString(),
      document: {
        title: announcement.title,
        description: announcement.description,
        price: announcement.price,
        // Adicione outros campos que existem no seu modelo
        created_at: announcement.created_at,
        updated_at: announcement.updated_at
      }
    });

    return result;

  } catch (error) {
    fastify.log.error('Erro ao indexar anúncio:');
    fastify.log.error(error);
    throw error;
  }
};

// ============================================================================
// 4. CRIAR ÍNDICE (EXECUTAR UMA VEZ)
// ============================================================================

export const createIndexController = async (fastify: FastifyInstance) => {
  try {
    // Verificar se índice existe
    const indexExists = await fastify.elasticsearch.indices.exists({
      index: 'announcements'
    });

    if (indexExists) {
      return { message: 'Índice já existe' };
    }

    // Criar índice com mapping
    const result = await fastify.elasticsearch.indices.create({
      index: 'announcements',
      mappings: {
        properties: {
          title: { 
            type: 'text', 
            analyzer: 'standard' 
          },
          description: { 
            type: 'text', 
            analyzer: 'standard' 
          },
          price: { 
            type: 'float' 
          },
          room_type: { 
            type: 'keyword' 
          },
          status: { 
            type: 'keyword' 
          },
          sex_restriction: { 
            type: 'keyword' 
          },
          near_university: { 
            type: 'keyword' 
          },
          open_vac: { 
            type: 'integer' 
          },
          location: { 
            type: 'text', 
            analyzer: 'standard' 
          },
          created_at: { 
            type: 'date' 
          },
          updated_at: { 
            type: 'date' 
          }
        }
      }
    });

    return { success: true, message: 'Índice criado com sucesso' };

  } catch (error) {
    fastify.log.error('Erro ao criar índice:');
    fastify.log.error(error);
    throw error;
  }
};

// ============================================================================
// 5. OUTROS MÉTODOS ÚTEIS
// ============================================================================

// Deletar documento
export const deleteDocumentController = async (id: string, fastify: FastifyInstance) => {
  try {
    const result = await fastify.elasticsearch.delete({
      index: 'announcements',
      id: id
    });
    return result;
  } catch (error) {
    fastify.log.error('Erro ao deletar documento:');
    fastify.log.error(error);
    throw error;
  }
};

// Atualizar documento
export const updateDocumentController = async (id: string, updates: any, fastify: FastifyInstance) => {
  try {
    const result = await fastify.elasticsearch.update({
      index: 'announcements',
      id: id,
      doc: updates
    });
    return result;
  } catch (error) {
    fastify.log.error('Erro ao atualizar documento:');
    fastify.log.error(error);
    throw error;
  }
};

// Buscar por ID
export const getDocumentController = async (id: string, fastify: FastifyInstance) => {
  try {
    const result = await fastify.elasticsearch.get({
      index: 'announcements',
      id: id
    });
    return {
      id: result._id,
      ...(result._source as any)
    };
  } catch (error) {
    fastify.log.error('Erro ao buscar documento:');
    fastify.log.error(error);
    throw error;
  }
};

// ============================================================================
// 6. EXEMPLO DE USO EM UMA ROTA
// ============================================================================

/*
// No seu arquivo de rota (ex: search.ts)
import { FastifyInstance } from 'fastify';

export default async function searchRoutes(fastify: FastifyInstance) {
  
  fastify.post('/api/search', async (request, reply) => {
    try {
      const result = await searchController(request, reply, fastify);
      return result;
    } catch (error) {
      return reply.internalServerError('Erro na busca');
    }
  });

  fastify.post('/api/create-index', async (request, reply) => {
    try {
      const result = await createIndexController(fastify);
      return result;
    } catch (error) {
      return reply.internalServerError('Erro ao criar índice');
    }
  });

}
*/