## Install and update NODE.JS

sudo apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
- Close and open terminal
nvm node install

#### Instalar e subir ElasticSearch em um container Local 

sudo curl -fsSL https://elastic.co/start-local | sudo sh

#### Listar todos os containers (ligados ou não)

docker ps -a

#### Subir banco de dados

```bash
docker compose up postgres -d
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