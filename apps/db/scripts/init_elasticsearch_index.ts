import { Client } from '@elastic/elasticsearch';

const elasticsearch = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    apiKey: 'MWU3cnVaa0J6ZUlFdEFRWnhyeU06YllUTndkaUIzT3hhcDBSc0xDQ0NCZw=='
  }
});

const API_URL = process.env.API_URL || 'http://localhost:3001/announcements';
const INDEX_NAME = 'announcements';

async function fetchAnnouncementsFromAPI() {
  console.log(`📡 Buscando anúncios da API em ${API_URL} ...`);
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Erro ao buscar anúncios da API: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(`✅ ${data.length} anúncios recebidos da API.`);
  return data;
}

async function initElasticsearchIndex() {
  try {
    console.log(`🔍 Verificando índice "${INDEX_NAME}"...`);
    const indexExists = await elasticsearch.indices.exists({ index: INDEX_NAME });

    if (indexExists) {
      console.log(`🗑️ Deletando índice existente "${INDEX_NAME}"...`);
      await elasticsearch.indices.delete({ index: INDEX_NAME });
    }

    console.log(`🆕 Criando índice "${INDEX_NAME}"...`);
    await elasticsearch.indices.create({
      index: INDEX_NAME,
      mappings: {
        properties: {
          id: { type: 'integer' },
          title: { type: 'text' },
          description: { type: 'text' },
          price: { type: 'float' },
          open_vac: { type: 'integer' },
          rules: { type: 'text' },
          type_of: { type: 'keyword' },
          status: { type: 'keyword' },
          sex_restriction: { type: 'keyword' },
          location: { type: 'geo_point' },
          image: { type: 'text' },
          updated_at: { type: 'date' },
          owner_name: { type: 'text' },
          universities: {
            type: 'nested',
            properties: {
              id: { type: 'integer' },
              name: { type: 'text' },
              abbreviation: { type: 'keyword' },
              latitude: { type: 'float' },
              longitude: { type: 'float' }
            }
          }
        }
      }
    });

    console.log(`✅ Índice "${INDEX_NAME}" criado com sucesso.`);

    const announcements = await fetchAnnouncementsFromAPI();

    const formattedAnnouncements = announcements.map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      price: parseFloat(a.price),
      open_vac: a.max_occupants - a.occupants,
      rules: a.rules,
      type_of: a.type_of,
      status: a.status,
      sex_restriction: a.sex_restriction,
      location: a.address?.location || { lat: 0, lon: 0 },
      image: a.announcement_img?.find((img: any) => img.is_cover)?.img_url || null,
      updated_at: a.updated_at,
      owner_name: a.owner?.name || null,
      universities: a.announcement_university?.map((au: any) => ({
        id: au.university.id,
        name: au.university.name,
        abbreviation: au.university.abbreviation,
        latitude: parseFloat(au.university.latitude),
        longitude: parseFloat(au.university.longitude)
      })) || []
    }));

    console.log(`📦 Preparando indexação de ${formattedAnnouncements.length} anúncios...`);
    const operations: any[] = [];

    for (const a of formattedAnnouncements) {
      operations.push({ index: { _index: INDEX_NAME, _id: a.id.toString() } });
      operations.push(a);
    }

    const bulkResponse = await elasticsearch.bulk({ operations });

    if (bulkResponse.errors) {
      console.error("⚠️ Ocorreram erros durante a indexação:");
      bulkResponse.items.forEach((item: any) => {
        if (item.index?.error) {
          console.error(` - Documento ${item.index._id}:`, item.index.error);
        }
      });
    }

    await elasticsearch.indices.refresh({ index: INDEX_NAME });
    const count = await elasticsearch.count({ index: INDEX_NAME });
    console.log(`🎉 Indexação concluída! ${count.count} documentos disponíveis.`);

  } catch (error) {
    console.error('💥 Erro ao inicializar o Elasticsearch:', error);
  }
}

if (require.main === module) {
  initElasticsearchIndex()
    .then(() => {
      console.log('\n🏁 Script finalizado com sucesso!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Erro fatal:', err);
      process.exit(1);
    });
}

export { initElasticsearchIndex };
