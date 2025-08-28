#### Listar todos os containers 

docker ps -a

#### Subir banco de dados

```bash
docker compose up -d
```

#### Desligar banco de dados (sem apagar dados)

```bash
docker stop <container_id>
```
#### Apagar volume

```bash
docker volume rm <nome_do_volume>
```

#### Apagar banco de dados

```bash
docker rm -v <container_id> 
```

#### Pull do schema 

```bash
npx prisma db pull
```

#### Gerar cliente Prisma

```bash
npx prisma generate
```
#### Instalar dependências

```bash
npm install
```

#### Rodar o servidor

```bash
npm run start:dev
``` 
#### Testar a API
Acesse `http://localhost:3000` no seu navegador ou use uma ferramenta como Postman ou cURL para testar os endpoints da API.