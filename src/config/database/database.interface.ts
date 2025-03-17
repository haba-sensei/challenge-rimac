import { Pool } from 'mysql2/promise';

export interface Database {
	pool: Pool;
}

export interface ConfigDatabase {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}
