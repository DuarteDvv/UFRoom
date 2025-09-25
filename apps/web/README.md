#### Passos para instanciação

- Na pasta apps/web
- execute npm install para baixar as dependencias 

```bash
npm install
```

- Puxe o esquema do banco para o prisma (se necessário)

```bash
npx prisma db pull
```

- Gere o cliente do prisma

```bash
npx prisma generate
```

- Coloque a chave da api do google maps no seu .env seguindo o example.env

- Inicie o servidor

```bash
npx run dev
```