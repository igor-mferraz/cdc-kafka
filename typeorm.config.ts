import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'my-sql',
  password: 'postgres',
  database: 'db-mysql',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
});

export default AppDataSource;
