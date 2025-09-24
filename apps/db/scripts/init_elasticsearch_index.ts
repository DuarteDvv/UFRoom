
import { Client } from '@elastic/elasticsearch';


const elasticsearch = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    apiKey: process.env.ES_LOCAL_API_KEY || 'NVpDamQ1a0J5cm1DclRoeEpKUEM6OHcwYTNSanBjNndJYnFNZG0tbEZpQQ=='
  }
});


// Inicializa o índice do Elasticsearch

async function initElasticsearchIndex() {

  const indexName = 'announcements';

  try {
    console.log(`Verificando se o índice "${indexName}" existe...`);

    const indexExists = await elasticsearch.indices.exists({ index: indexName });
    if (indexExists) {
      console.log(`Índice "${indexName}" já existe.`);
      console.log("Deletando índice existente para recriação...");
      await elasticsearch.indices.delete({ index: indexName });
      console.log(`Índice "${indexName}" deletado.`);
      
    }

    console.log(`Índice "${indexName}" não encontrado. Criando...`);

    // Criar o índice com mapeamento
    const createIndexResponse = await elasticsearch.indices.create({
        index: indexName,
        mappings: {
          properties: {
            id: { type: 'integer' },
            title: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            open_vac: { type: 'integer' }, // Vagas disponíveis (calculado: max_occupants - occupants)
            rules: { type: 'text' },    
            type_of: { type: 'keyword' },
            status: { type: 'keyword' },
            sex_restriction: { type: 'keyword' },
            location: { type: 'geo_point' }, // Coordenadas geográficas
            image: { type: 'text' },
            updated_at: { type: 'date' },
            universities: {
                type: 'nested',
                properties: {
                    name: { type: 'text' },
                    abbreviation: { type: 'keyword' }, // Para filtros exatos
                    distance: { type: 'float' }
                }
            },
          }
        }
      }
    );

    // Verificar se o índice foi criado com sucesso
    const indexInfo = await elasticsearch.indices.get({ index: indexName });

    console.log(`Índice "${indexName}" criado com sucesso. Informações do índice:`, indexInfo);
    console.log("Propriedades do mapeamento:", JSON.stringify(indexInfo[indexName].mappings, null, 2));

    console.log("Indexação inicial concluída.");
  } catch (error) {
    console.error(`Erro ao inicializar o índice "${indexName}":`, error);
  }
}

initElasticsearchIndex();