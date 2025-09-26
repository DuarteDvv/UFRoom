#### Passos para instanciação

- Instale o emulador NODE mais recente
```bash
sudo apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash (feche e abra o depois de executar)
nvm node install
```
- execute npm install para baixar as dependencias 

```bash
npm install
```

- Instale o docker usando tutorial do site
- Na pasta apps/db execute o comando que sobe um container do banco do elasticsearch local
- Ao final ele irá te retornar a chave da api local (não é uma chave importante pois é gerada aleatóriamente em cada criação de container)

```bash
sudo curl -fsSL https://elastic.co/start-local | sudo sh
```
- Seguindo o .env exemplo
- Coloque a chave da elasticsearch no .env
- Crie e coloque a chave do google maps API no .env
- Coloque a string de conexão com o banco de dados 

- Na raiz do projeto  suba o container do banco POSTGRES

```bash
docker compose up postgres -d
```

- Na pasta db/scripts instale o tsx e execute na ordem. O primeiro cria o indice no elastic e o segundo mocka alguns dados (O segundo só é necessário enquanto alguém não criar dados mockados melhores) (Coloque sua ES_API_KEY nos scripts)

```bash

npx tsx scripts/init_elasticsearch_index.ts

npx tsx scripts/mock_elasticsearch_index.ts

```

- Inicie o servidor

```bash
npm start
``` 
