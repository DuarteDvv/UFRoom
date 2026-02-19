FROM postgres:16

# variaveis de ambiente do container s
ENV POSTGRES_USER=ufroomUser
ENV POSTGRES_PASSWORD=ufroompassword
ENV POSTGRES_DB=ufroomdb

# Copia o script de inicialização
COPY init.sql /docker-entrypoint-initdb.d/

# Expõe a porta padrão do PostgreSQL
EXPOSE 5432

# Configura o volume para persistir dados
VOLUME ["/var/lib/postgresql/data"]
