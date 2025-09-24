import { Client } from '@elastic/elasticsearch';

const elasticsearch = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    apiKey: process.env.ES_LOCAL_API_KEY || 'NVpDamQ1a0J5cm1DclRoeEpKUEM6OHcwYTNSanBjNndJYnFNZG0tbEZpQQ=='
  }
});

// Mock de dados para teste
const mockAnnouncements = [
  {
    id: 1,
    title: "Quarto individual próximo à UFMG",
    description: "Quarto amplo e bem iluminado, ideal para estudantes. Ambiente tranquilo e seguro.",
    price: 800.0,
    open_vac: 1,
    rules: "Não fumar, não fazer barulho após 22h",
    type_of: "individual_room",
    status: "available",
    sex_restriction: "both",
    location: { lat: -19.8687, lon: -43.9609 },
    image: "/house.jpg",
    updated_at: new Date('2025-01-15T12:00:00'),
    universities: [
      {
        name: "Universidade Federal de Minas Gerais",
        abbreviation: "UFMG",
        distance: 1.2
      }
    ]
  },
  {
    id: 2,
    title: "Kitnet mobiliada no Savassi",
    description: "Kitnet completa com cozinha equipada, banheiro privativo e área de estudos.",
    price: 1200.0,
    open_vac: 1,
    rules: "Proibido animais, visitas até 21h",
    type_of: "kitnet",
    status: "available",
    sex_restriction: "female",
    location: { lat: -19.9394, lon: -43.9356 },
    image: "/house.jpg",
    updated_at: new Date('2025-09-24T12:00:00'),
    universities: [
      {
        name: "PUC Minas",
        abbreviation: "PUC",
        distance: 2.5
      }
    ]
  },
  {
    id: 3,
    title: "Quarto compartilhado econômico",
    description: "Quarto para duas pessoas, ambiente colaborativo e econômico para estudantes.",
    price: 450.0,
    open_vac: 2,
    rules: "Limpeza compartilhada, respeito mútuo",
    type_of: "shared_room",
    status: "available",
    sex_restriction: "male",
    location: { lat: -19.8512, lon: -43.9225 },
    image: "/house.jpg",
    updated_at: new Date('2024-01-18T12:00:00'),
    universities: [
      {
        name: "Universidade Federal de Minas Gerais",
        abbreviation: "UFMG",
        distance: 0.8
      },
      {
        name: "Centro Universitário UNA",
        abbreviation: "UNA",
        distance: 1.5
      }
    ]
  },
  {
    id: 4,
    title: "Kitnet de luxo na Pampulha",
    description: "Kitnet moderna com ar condicionado, internet fibra ótica e área de lazer completa.",
    price: 1800.0,
    open_vac: 1,
    rules: "Não fumar, manter limpeza",
    type_of: "kitnet",
    status: "available",
    sex_restriction: "both",
    location: { lat: -19.8512, lon: -43.9668 },
    image: "/house.jpg",
    updated_at: new Date('2024-01-22T12:00:00'),
    universities: [
      {
        name: "Universidade Federal de Minas Gerais",
        abbreviation: "UFMG",
        distance: 0.5
      }
    ]
  },
  {
    id: 5,
    title: "Quarto individual feminino",
    description: "Ambiente exclusivo feminino, seguro e bem localizado próximo ao centro.",
    price: 700.0,
    open_vac: 1,
    rules: "Apenas mulheres, silêncio após 22h",
    type_of: "individual_room",
    status: "available",
    sex_restriction: "female",
    location: { lat: -19.9245, lon: -43.9352 },
    image: "/house.jpg",
    updated_at: new Date('2024-01-10T12:00:00'),
    universities: [
      {
        name: "PUC Minas",
        abbreviation: "PUC",
        distance: 1.8
      }
    ]
  },
  {
    id: 6,
    title: "Quarto compartilhado próximo ao metrô",
    description: "Ótima localização com fácil acesso ao transporte público e universidades.",
    price: 500.0,
    open_vac: 1,
    rules: "Divisão de contas, limpeza semanal",
    type_of: "shared_room",
    status: "available",
    sex_restriction: "both",
    location: { lat: -19.9167, lon: -43.9345 },
    image: "/house.jpg",
    updated_at: new Date('2024-01-25T12:00:00'),
    universities: [
      {
        name: "Centro Universitário UNA",
        abbreviation: "UNA",
        distance: 2.0
      }
    ]
  },
  {
    id: 7,
    title: "Kitnet compacta e funcional",
    description: "Espaço otimizado com tudo que você precisa para estudar e descansar.",
    price: 950.0,
    open_vac: 1,
    rules: "Manter organização, não receber visitas após 21h",
    type_of: "kitnet",
    status: "rented",
    sex_restriction: "both",
    location: { lat: -19.8789, lon: -43.9567 },
    image: "/house.jpg",
    updated_at: new Date('2024-01-12T12:00:00'),
    universities: [
      {
        name: "Universidade Federal de Minas Gerais",
        abbreviation: "UFMG",
        distance: 1.0
      }
    ]
  },
  {
    id: 8,
    title: "Quarto individual com varanda",
    description: "Quarto espaçoso com varanda, mesa de estudos e armário embutido.",
    price: 850.0,
    open_vac: 1,
    rules: "Não fumar, manter limpeza da varanda",
    type_of: "individual_room",
    status: "available",
    sex_restriction: "male",
    location: { lat: -19.8934, lon: -43.9456 },
    image: "/house.jpg",
    updated_at: new Date('2024-01-28T12:00:00'),
    universities: [
      {
        name: "PUC Minas",
        abbreviation: "PUC",
        distance: 1.7
      }
    ]
  },
  {
    id: 9,
    title: "Quarto compartilhado para estudantes",
    description: "Ambiente de estudos compartilhado, ideal para quem gosta de fazer amizades.",
    price: 400.0,
    open_vac: 3,
    rules: "Respeito aos colegas, estudos em grupo permitidos",
    type_of: "shared_room",
    status: "available",
    sex_restriction: "both",
    location: { lat: -19.8623, lon: -43.9234 },
    image: "/house.jpg",
    updated_at: new Date('2024-01-30T12:00:00'),
    universities: [
      {
        name: "Universidade Federal de Minas Gerais",
        abbreviation: "UFMG",
        distance: 0.9
      }
    ]
  },
  {
    id: 10,
    title: "Kitnet premium com academia",
    description: "Kitnet em condomínio com academia, piscina e área gourmet.",
    price: 2200.0,
    open_vac: 1,
    rules: "Uso consciente das áreas comuns, não fumar",
    type_of: "kitnet",
    status: "available",
    sex_restriction: "both",
    location: { lat: -19.9123, lon: -43.9445 },
    image: "/house.jpg",
    updated_at: new Date('2024-02-01T12:00:00'),
    universities: [
      {
        name: "PUC Minas",
        abbreviation: "PUC",
        distance: 2.2
      },
      {
        name: "Centro Universitário UNA",
        abbreviation: "UNA",
        distance: 1.8
      }
    ]
  }
];

async function mockElasticsearchIndex() {
  const indexName = 'announcements';

  try {
  console.log('🚀 Iniciando processo de mock dos dados...');

    // Verificar se o índice existe
    const indexExists = await elasticsearch.indices.exists({ index: indexName });
    if (!indexExists) {
      console.log('❌ Índice não existe. Execute primeiro o script de inicialização.');
      return;
    }

    console.log('📊 Indexando documentos mockados...');

    // Preparar operações bulk
    const operations: any[] = [];
    
    for (const announcement of mockAnnouncements) {
      // Adicionar operação de indexação
      operations.push({
        index: {
          _index: indexName,
          _id: announcement.id.toString()
        }
      });
      operations.push(announcement);
    }

    // Executar operação bulk
    const bulkResponse = await elasticsearch.bulk({
      operations
    });

    // Verificar resultados
    let successCount = 0;
    let errorCount = 0;

    if (bulkResponse.errors) {
      for (const item of bulkResponse.items) {
        if (item.index?.error) {
          console.error(`❌ Erro ao indexar documento ${item.index._id}:`, item.index.error);
          errorCount++;
        } else {
          successCount++;
        }
      }
    } else {
      successCount = mockAnnouncements.length;
    }

    // Refresh do índice
    await elasticsearch.indices.refresh({ index: indexName });

    console.log('🎉 Mock concluído!');
    console.log(`✅ Documentos indexados com sucesso: ${successCount}`);
    console.log(`❌ Erros durante a indexação: ${errorCount}`);

    // Verificar contagem final
    const count = await elasticsearch.count({ index: indexName });
    console.log(`📊 Total de documentos no índice: ${count.count}`);

    // Mostrar alguns exemplos
    console.log('\n📝 Exemplos de documentos indexados:');
    const searchResponse = await elasticsearch.search({
      index: indexName,
      size: 3,
      sort: [{ updated_at: { order: 'desc' } }]
    });

    searchResponse.hits.hits.forEach((hit: any, index: number) => {
      const doc = hit._source;
      console.log(`${index + 1}. ${doc.title} - R$ ${doc.price} (${doc.type_of})`);
    });

  } catch (error) {
    console.error('❌ Erro durante o mock:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  mockElasticsearchIndex()
    .then(() => {
      console.log('\n🏁 Script finalizado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Erro fatal:', error);
      process.exit(1);
    });
}

export { mockElasticsearchIndex, mockAnnouncements };
