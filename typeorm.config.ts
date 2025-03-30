import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'mysql',
  port: parseInt(process.env.DATABASE_PORT) || 3306,
  username: process.env.MYSQL_USER || 'my-sql',
  password: process.env.MYSQL_PASSWORD || '12345678',
  database: process.env.MYSQL_DATABASE || 'db-mysql',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
}; 

console.log('MYSQL_USER:', process.env.MYSQL_USER || 'my-sql');
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST:', process.env.DATABASE_HOST || 'db-mysql');
console.log('MYSQL_PORT:', process.env.DATABASE_PORT || 3306);
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE || 'db-mysql');