import "reflect-metadata";
import middy from "@middy/core";
import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { Container } from "inversify";
import {
	createContainer,
	setAwsRequestId,
} from "./container";
import initializeRoutes from "./routes";
import ResponseVO from "./utils/response-vo";
import { HTTP } from "./utils/enum";

const baseHandler: Handler = async (
	event: APIGatewayEvent | any,
	context: Context
): Promise<any> => {
	context.callbackWaitsForEmptyEventLoop = false;
	const container: Container = createContainer();
	setAwsRequestId(container, context.awsRequestId);

	const routes = initializeRoutes(container);
	const uniqueUrl: string = `${event.httpMethod || event?.requestContext?.http?.method
		}:${event.path || event?.requestContext?.http?.path}`;
	const handleRoute = routes.get(uniqueUrl);

	if (handleRoute) {
		return handleRoute(event);
	}
	return new ResponseVO(HTTP.STATUS_CODE_401, "Route not found");
};

export const handler = middy(baseHandler);
