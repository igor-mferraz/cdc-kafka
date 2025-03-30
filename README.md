# Projeto de Captura de Dados de Mudanças (CDC) com Debezium, Kafka e PostgreSQL

Este projeto utiliza o Debezium para capturar mudanças em um banco de dados PostgreSQL e publica essas mudanças em tópicos do Kafka. O Confluent Control Center é utilizado para monitorar o fluxo de dados.

## Fluxo do Projeto

1. **PostgreSQL**: O banco de dados onde os dados são capturados.
2. **Debezium**: O conector que monitora as alterações no banco de dados PostgreSQL.
3. **Kafka**: O sistema de mensagens que publica as alterações capturadas pelo Debezium.
4. **Confluent Control Center**: A interface gráfica para monitorar os tópicos e consumidores do Kafka.

## Estrutura do Docker Compose

O projeto é configurado usando Docker Compose.

## Configuração do Conector Debezium

Para criar um conector Debezium que monitore a tabela `clientes`, você pode usar o seguinte comando `curl`:

```bash
curl --location 'http://localhost:8083/connectors' \
   --header 'Accept: application/json' \
   --header 'Content-Type: application/json' \
   --data '{
   "name": "cdc-using-debezium-connector",
   "config": {
       "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
       "database.hostname": "###.###.#.###",  # Substitua pelo seu IP
       "database.port": "5443",
       "database.user": "postgres",
       "database.password": "123",
       "database.dbname": "cdc-using-debezium",
       "database.server.id": "184054",
       "table.include.list": "public.clientes",  # Tabela a ser monitorada
       "topic.prefix": "cdc-using-debezium-topic"
   }
}'
```

## Inserindo Dados e Verificando Mensagens no Kafka

1. **Inserir um Registro**:
   Para inserir um registro na tabela `clientes`, use o seguinte comando SQL no `psql`:

   ```sql
   INSERT INTO clientes (nome, email) VALUES ('Usuario', 'usuario@example.com');
   ```

## Acessando o Confluent Control Center

Após iniciar todos os contêineres, você pode acessar o Confluent Control Center em:
http://localhost:9021









##DEV Atalhos

docker exec -it cdc-using-debezium-postgres bash
psql -U postgres -d cdc-using-debezium
INSERT INTO clientes (nome, email) VALUES ('valor1', 'valor2');