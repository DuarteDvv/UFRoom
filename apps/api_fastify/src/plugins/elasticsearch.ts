import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Client } from '@elastic/elasticsearch';

export default fp(async (server: FastifyInstance) => {

    const elastic_client = new Client({ 
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        auth: {
            username: 'elastic',
            password: process.env.ELASTICSEARCH_PASSWORD || 'hqBC2u2N'
        }
    });

    server.register(require('@fastify/elasticsearch'), {
        client: elastic_client
    });

    server.decorate('elasticsearch', elastic_client);
});

declare module 'fastify' {
  interface FastifyInstance {
    elasticsearch: Client;
  }
}
