import { Container } from "inversify";
import { APIGatewayEvent } from "aws-lambda";
import { PATHS } from "./utils/enum";
import StarWarsController from "./controllers/starwars.controller";
import TYPES from "./types";

type RouteHandler = (event: APIGatewayEvent) => Promise<any>;

const initializeRoutes = (container: Container): Map<string, RouteHandler> => {

	const StarWarsHandler: StarWarsController = container.get<StarWarsController>(
		TYPES.StarWarsController
	);

	return new Map<string, RouteHandler>([
		[PATHS.GET_FUSIONADOS, (event) => StarWarsHandler.getFusionados(event)],
		[PATHS.GET_HISTORIAL, (event) => StarWarsHandler.getHistorial(event)],
		[PATHS.POST_ALMACENAR, (event) => StarWarsHandler.postAlmacenar(event)],
	]);
};

export default initializeRoutes;
