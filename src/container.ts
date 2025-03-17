import { Container } from "inversify";
import PowerToolsLogger from "./logger/power-tools.logger";
import Logger from "./logger/logger";
import TYPES from "./types";

import ApiConnectorUtil from "./utils/api-connector";
import CheckUtil from "./utils/checkUtils";
import { SOURCE_COMPONENT_NAME } from "./utils/constants";
import StarWarsController from "./controllers/starwars.controller";
import { StarWarsService } from "./services/starwars.service";
import StarWarsServiceImpl from "./services/impl/starwars.service.impl";
import { StarWarsRepository } from "./repository/starwars.repository";
import StarWarsRepositoryImpl from "./repository/impl/starwars.repository.impl";
import { MySQLClientBuilder } from "./config/database/mysql.client.builder";
import { Database } from "./config/database/database.interface";
import { mysqlConfig } from "./config/database/database.config";
import redisClient from "./config/cache/redisClient";

export const createContainer = (): Container => {
	const container: Container = new Container();
	process.env.npm_package_name = SOURCE_COMPONENT_NAME;
	/* API CONNECTOR */
	const apiConnectorUtil: ApiConnectorUtil = new ApiConnectorUtil();
	container
		.bind<ApiConnectorUtil>(TYPES.ApiConnectorUtil)
		.toConstantValue(apiConnectorUtil);
	/* DATABASE */
	const mysqlClient: Database = MySQLClientBuilder.getClient(mysqlConfig);
	container.bind<Database>(TYPES.ClientDatabase).toConstantValue(mysqlClient);

	/* CACHE */
	container.bind(TYPES.SessionClientRedis).toConstantValue(redisClient);

	/* CONTROLLERS */
	container
		.bind<StarWarsController>(TYPES.StarWarsController)
		.to(StarWarsController);

	/* SERVICE */
	container
		.bind<StarWarsService>(TYPES.StarWarsService)
		.to(StarWarsServiceImpl);

	/* REPOSITORY */
	container
		.bind<StarWarsRepository>(TYPES.StarWarsRepository)
		.to(StarWarsRepositoryImpl);

	/* EXTRA */
	container.bind<CheckUtil>(TYPES.CheckUtil).to(CheckUtil);


	return container;
};


export const setAwsRequestId = (container: Container, awsRequestId: string) => {
	const logger: PowerToolsLogger = new PowerToolsLogger(awsRequestId);
	container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
};

