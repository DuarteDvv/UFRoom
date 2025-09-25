#### Passos para instanciação

- Entre no diretório do fastapi 

cd apps/api_fastapi

- Instale o melhor gerenciador de pacotes e ambiente do python

curl -LsSf https://astral.sh/uv/install.sh | sh

- Crie uma maquina virtual utilizando python 3.12

uv init --python 3.12

- Instale as dependencias 

uv add -r requirements.txt

- Crie um .env na pasta onde esta localizado example.env e coloque sua chave de API que pode ser obtida no google studio

- Suba o servidor

uv run uvicorn main:app --reload

