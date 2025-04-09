# CDC com Debezium + Oracle XE + Kafka + Control Center

## 1. Estrutura de Containers

No `docker-compose.yml` usamos os seguintes serviços:

- `oracle-source`: roda o Oracle XE para fazer CDC.
- `oracle-destination`: outro Oracle XE.
- `cdc-using-debezium-kafka`: Kafka usando a imagem Bitnami.
- `cdc-using-debezium-connect`: Debezium Connect, responsável por capturar dados do Oracle e publicar no Kafka.
- `confluent-control-center`: UI de gerenciamento da Confluent que tenta se conectar ao nosso Kafka em KRaft.

---

## 2. Banco Oracle e LogMiner

### Versão do Oracle
- **Oracle XE**

### Habilitar Archive Log e Supplemental Logging
```sql
archive log list;
SHUTDOWN IMMEDIATE;
STARTUP MOUNT;
ALTER DATABASE ARCHIVELOG;
ALTER DATABASE OPEN;

ALTER DATABASE ADD SUPPLEMENTAL LOG DATA;
ALTER TABLE <USER>.<TABELA> ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;
```

### Criação de Usuário para o Debezium
**Usuário comum (CDB):**
```sql
CREATE USER C##DEBEZIUM_USER IDENTIFIED BY "Debezium123" CONTAINER=ALL;
```

**Usuário local (PDB):**
```sql
ALTER SESSION SET CONTAINER = XEPDB1;
CREATE USER DEBEZIUM_USER IDENTIFIED BY "Debezium123";
```

**Permissões:**
```sql
GRANT CREATE SESSION TO C##DEBEZIUM_USER CONTAINER=ALL;
GRANT LOGMINING TO C##DEBEZIUM_USER CONTAINER=ALL;
GRANT SELECT ANY DICTIONARY TO C##DEBEZIUM_USER CONTAINER=ALL;
GRANT SELECT ANY TRANSACTION TO C##DEBEZIUM_USER CONTAINER=ALL;
GRANT EXECUTE ON SYS.DBMS_LOGMNR TO C##DEBEZIUM_USER CONTAINER=ALL;
GRANT EXECUTE ON SYS.DBMS_LOGMNR_D TO C##DEBEZIUM_USER CONTAINER=ALL;
ALTER USER C##DEBEZIUM_USER QUOTA UNLIMITED ON USERS;
```

---

## 3. Copiando o Driver JDBC

```bash
docker cp /caminho/ojdbc8.jar cdc-using-debezium-connect:/kafka/libs/
docker restart cdc-using-debezium-connect
```

---

## 4. Configuração do Conector Debezium

```json
{
  "name": "oracle-connector",
  "config": {
    "connector.class": "io.debezium.connector.oracle.OracleConnector",
    "tasks.max": "1",
    "database.hostname": "oracle-source",
    "database.port": "1521",
    "database.user": "C##DEBEZIUM_USER",
    "database.password": "Debezium123",
    "database.dbname": "XE",
    "database.connection.adapter": "logminer",
    "schema.history.internal.kafka.bootstrap.servers": "cdc-using-debezium-kafka:29092",
    "schema.history.internal.kafka.topic": "schema-changes.oracle",
    "database.schema": "C##DEBEZIUM_USER",
    "table.include.list": "C##DEBEZIUM_USER.USERS",
    "topic.prefix": "cdc",
    "log.mining.strategy": "online_catalog"
  }
}
```

POST para:
```
http://localhost:8083/connectors
```

---

## 5. Testando o CDC

**INSERT na Tabela:**
```sql
INSERT INTO C##DEBEZIUM_USER.USERS (ID, NAME, EMAIL)
VALUES (1, 'João', 'joao@example.com');
COMMIT;
```

**Consumir mensagens Kafka:**
```bash
docker exec -it cdc-using-debezium-kafka bash
kafka-console-consumer.sh \
  --bootstrap-server cdc-using-debezium-kafka:29092 \
  --topic cdc.C__DEBEZIUM_USER.USERS \
  --from-beginning
```

---

## 6. Confluent Control Center

- Usamos `bitnami/kafka` com `confluentinc/cp-enterprise-control-center`.
- O Control Center para listar topicos e mensagens.
---

## 7. Conclusão

- Oracle XE → **com LogMiner**.
- Debezium precisa de:
  - Driver JDBC
  - Permissões corretas
  - Supplemental logging habilitado

**CDC funcionando!**
