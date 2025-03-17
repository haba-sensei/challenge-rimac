import { createPool, Pool } from 'mysql2/promise';
import { ConfigDatabase } from './database.interface';
import { Database } from './database.interface';

export class MySQLClientBuilder {
	static getClient(config: ConfigDatabase): Database {
		const pool: Pool = createPool({
			...config,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
		});
		return { pool };
	}
}
