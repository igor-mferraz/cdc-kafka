Documentação: Configuração de CDC com Debezium e Oracle

1. Objetivo
Configurar o Debezium para capturar mudanças (Change Data Capture - CDC) na tabela SYSTEM.CLIENTES de um banco de dados Oracle 21c, usando Kafka e Kafka Connect, em um ambiente Docker.

2. Ambiente
- Sistema Operacional: WSL (Windows Subsystem for Linux) no Windows.
- Docker Compose: Usado para orquestrar os containers.
- Componentes:
  - Oracle: gvenzl/oracle-xe:21-slim (Oracle 21c Express Edition).
  - Kafka: bitnami/kafka:3.4.
  - Debezium Kafka Connect: debezium/connect:2.3.
  - Tabela alvo: SYSTEM.CLIENTES.

3. Passos Realizados

3.1. Configuração do Ambiente com Docker Compose
Um arquivo docker-compose.yml foi usado para subir os serviços necessários:

version: '3.7'

networks:
  cdc-using-debezium-network:
    name: cdc-using-debezium-network
    driver: bridge

services:
  oracle-source:
    image: gvenzl/oracle-xe:21-slim
    container_name: oracle-source
    hostname: oracle-source
    restart: always
    ports:
      - "1521:1521"
    environment:
      ORACLE_PASSWORD: 12345678
    volumes:
      - "oracle-source-data:/opt/oracle/oradata"
    networks:
      - cdc-using-debezium-network

  oracle-destination:
    image: gvenzl/oracle-xe:21-slim
    container_name: oracle-destination
    hostname: oracle-destination
    restart: always
    ports:
      - "1522:1521"
    environment:
      ORACLE_PASSWORD: 12345678
    volumes:
      - "oracle-destination-data:/opt/oracle/oradata"
    networks:
      - cdc-using-debezium-network

  cdc-using-debezium-kafka:
    image: bitnami/kafka:3.4
    container_name: cdc-using-debezium-kafka
    hostname: cdc-using-debezium-kafka
    restart: always
    ports:
      - "9092:9092"
    environment:
      KAFKA_CFG_NODE_ID: 1
      KAFKA_KRAFT_CLUSTER_ID: q0k00yjQRaqWmAAAZv955w
      KAFKA_CFG_PROCESS_ROLES: controller,broker
      KAFKA_CFG_LISTENERS: INTERNAL://cdc-using-debezium-kafka:29092,CONTROLLER://cdc-using-debezium-kafka:29093,EXTERNAL://0.0.0.0:9092
      KAFKA_CFG_ADVERTISED_LISTENERS: INTERNAL://cdc-using-debezium-kafka:29092,EXTERNAL://localhost:9092
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: 1@cdc-using-debezium-kafka:29093
      KAFKA_CFG_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER
    networks:
      - cdc-using-debezium-network

  cdc-using-debezium-connect:
    image: debezium/connect:2.3
    container_name: cdc-using-debezium-connect
    hostname: cdc-using-debezium-connect
    restart: always
    ports:
      - "8083:8083"
    environment:
      BOOTSTRAP_SERVERS: cdc-using-debezium-kafka:29092
      GROUP_ID: 1
      CONFIG_STORAGE_TOPIC: my_connect_configs
      OFFSET_STORAGE_TOPIC: my_connect_offsets
      STATUS_STORAGE_TOPIC: my_connect_statuses
      ENABLE_DEBEZIUM_SCRIPTING: "true"
    depends_on:
      - cdc-using-debezium-kafka
      - oracle-source
    networks:
      - cdc-using-debezium-network

volumes:
  oracle-source-data:
  oracle-destination-data:

Comando para subir os serviços
docker-compose up -d 

3.2. Configuração do Banco Oracle
- Criar o usuário DEBEZIUM_USER:
  docker exec -it oracle-source sqlplus / as sysdba
  SQL> CREATE USER DEBEZIUM_USER IDENTIFIED BY "Debezium123";
  SQL> GRANT CONNECT, RESOURCE TO DEBEZIUM_USER;
  SQL> GRANT SELECT ANY TABLE TO DEBEZIUM_USER;
  SQL> GRANT SELECT ON V_$DATABASE TO DEBEZIUM_USER;
  SQL> GRANT SELECT ON V_$LOG TO DEBEZIUM_USER;
  SQL> GRANT SELECT ON V_$LOGFILE TO DEBEZIUM_USER;
  SQL> GRANT SELECT ON V_$ARCHIVED_LOG TO DEBEZIUM_USER;
  SQL> GRANT SELECT ON V_$LOGMNR_CONTENTS TO DEBEZIUM_USER;
  SQL> GRANT EXECUTE ON DBMS_LOGMNR TO DEBEZIUM_USER;
  SQL> GRANT LOGMINING TO DEBEZIUM_USER;
  SQL> ALTER USER DEBEZIUM_USER QUOTA UNLIMITED ON USERS;

- Habilitar ARCHIVELOG e suplemento de log:
  SQL> SHUTDOWN IMMEDIATE;
  SQL> STARTUP MOUNT;
  SQL> ALTER DATABASE ARCHIVELOG;
  SQL> ALTER DATABASE OPEN;
  SQL> ALTER DATABASE ADD SUPPLEMENTAL LOG DATA;
  SQL> ALTER TABLE SYSTEM.CLIENTES ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;

3.3. Adicionar o Driver JDBC ao Debezium
A imagem debezium/connect:2.3 não inclui o driver JDBC da Oracle. Foi necessário adicionar manualmente:
- Baixar o ojdbc8.jar (para Oracle 21c, compatível com JDK 8) do site da Oracle.
- Copiar o arquivo para o container:
  cp /mnt/c/Users/igorm/Downloads/ojdbc8.jar /home/igor/
  docker cp /home/igor/ojdbc8.jar cdc-using-debezium-connect:/kafka/libs/
- Reiniciar o container:
  docker restart cdc-using-debezium-connect

3.4. Registrar o Conector no Debezium
Um conector foi configurado para capturar mudanças da tabela SYSTEM.CLIENTES:
- JSON usado (enviado via Postman):
{
    "name": "oracle-connector",
    "config": {
        "connector.class": "io.debezium.connector.oracle.OracleConnector",
        "tasks.max": "1",
        "database.hostname": "oracle-source",
        "database.port": "1521",
        "database.user": "DEBEZIUM_USER",
        "database.password": "Debezium123",
        "database.dbname": "XE",
        "database.pdb.name": "XEPDB1",
        "database.out.server.name": "dbz_oracle_source",
        "database.connection.adapter": "logminer",
        "database.history.kafka.bootstrap.servers": "cdc-using-debezium-kafka:29092",
        "database.history.kafka.topic": "schema-changes.oracle",
        "table.include.list": "SYSTEM.CLIENTES",
        "database.tablename.case.insensitive": "false",
        "topic.prefix": "oracle-source-cdc"
    }
}

- Requisição no Postman:
  Método: POST
  URL: http://localhost:8083/connectors
  Header: Content-Type: application/json
  Body: (JSON acima)

- Resposta recebida:
{
    "name": "oracle-connector",
    "config": {...},
    "tasks": [],
    "type": "source"
}

4. Resultado
O conector foi registrado com sucesso. O Debezium está pronto para capturar mudanças na tabela SYSTEM.CLIENTES e publicá-las no tópico Kafka oracle-source-cdc.SYSTEM.CLIENTES.

5. Próximos Passos
- Verificar o status do conector:
  GET http://localhost:8083/connectors/oracle-connector/status
- Testar a captura de mudanças:
  - Inserir dados na tabela:
    docker exec -it oracle-source sqlplus / as sysdba
    SQL> ALTER SESSION SET CONTAINER=XEPDB1;
    SQL> INSERT INTO SYSTEM.CLIENTES (ID, NOME) VALUES (1, 'Teste CDC');
    SQL> COMMIT;
  - Consumir o tópico Kafka:
    docker exec -it cdc-using-debezium-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic oracle-source-cdc.SYSTEM.CLIENTES --from-beginning