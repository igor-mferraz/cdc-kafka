import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'oracle', // Tipo do banco de dados é Oracle
  host: 'localhost', // O host mapeado no Docker Compose
  port: 1522, // Porta mapeada no docker-compose.yml (1522:1521)
  username: 'system', // Usuário padrão do Oracle XE (pode variar dependendo da configuração)
  password: '12345678', // Senha definida no docker-compose.yml via ORACLE_PASSWORD
  sid: 'XE', // SID padrão do Oracle XE
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Caminho para suas entidades
  migrations: ['src/migrations/**/*{.ts,.js}'], // Caminho para suas migrations
});

export default AppDataSource;