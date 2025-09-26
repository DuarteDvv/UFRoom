# Scripts de Banco de Dados

## Popular tabela de universidades

Popule a tabela `university` com dados simulados e selecionados para desenvolvimento local:

```bash
psql "$DATABASE_URL" -f apps/db/scripts/feed_universities.sql
```

Este script trunca a tabela (reiniciando a sequência de identidade) antes de inserir as universidades de exemplo. Certifique-se de que a variável de ambiente `DATABASE_URL` aponte para sua instância do Postgres.
