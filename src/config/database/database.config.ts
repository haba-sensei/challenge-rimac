import dotenv from 'dotenv';
import { ConfigDatabase } from './database.interface';

dotenv.config();

export const mysqlConfig: ConfigDatabase = {
	host: process.env.MYSQL_HOST || 'localhost',
	port: Number(process.env.MYSQL_PORT) || 3306,
	user: process.env.MYSQL_USER || 'default_user',
	password: process.env.MYSQL_PASSWORD || 'default_password',
	database: process.env.MYSQL_DATABASE || 'default_database',
};
