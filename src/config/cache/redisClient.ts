import { createClient } from 'redis';
import { redisConfig } from './redisConfig';

const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
	try {
		await redisClient.connect();
		console.log('Connected to Redis successfully');
	} catch (err) {
		console.error('Failed to connect to Redis', err);
	}
})();

export default redisClient;
