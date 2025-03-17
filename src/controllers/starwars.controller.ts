import { APIGatewayEvent } from "aws-lambda";
import ResponseVO from "../utils/response-vo";
import TYPES from "../types";
import { inject, injectable } from "inversify";
import Logger from "../logger/logger";
import { HTTP } from "../utils/enum";
import { StarWarsService } from "../services/starwars.service";
import { validateAlmacenarRequest } from "./request/almacenarRequest";
import { validateQueryParamsRequest } from "./request/queryParamsRequest";

@injectable()
export default class StarWarsController {
	constructor(
		@inject(TYPES.StarWarsService)
		private starWarsService: StarWarsService,
		@inject(TYPES.Logger)
		private logger: Logger
	) { }

	async getFusionados(event: APIGatewayEvent): Promise<ResponseVO> {
		try {
			this.logger.info(
				"StarWarsController",
				"getFusionados",
				undefined,
				{},
				"Obtener fusionados"
			);

			const { body, statusCode } = await this.starWarsService.crearFusion();

			return new ResponseVO(
				statusCode as unknown as HTTP,
				JSON.stringify(body),
				{}
			) as ResponseVO;

		} catch (error) {
			return new ResponseVO(HTTP.STATUS_CODE_400, JSON.stringify(error));
		}
	}

	async getHistorial(event: APIGatewayEvent): Promise<ResponseVO> {
		try {
			const { page, limit } = event.queryStringParameters as any;

			validateQueryParamsRequest(event.queryStringParameters);

			this.logger.info(
				"StarWarsController",
				"getHistorial",
				undefined,
				page, limit,
				"Obtener historial"
			);

			const { body, statusCode } = await this.starWarsService.getHistorial(page, limit);

			return new ResponseVO(
				statusCode as unknown as HTTP,
				JSON.stringify({ body }),
				{}
			) as ResponseVO;

		} catch (error) {
			return new ResponseVO(HTTP.STATUS_CODE_400, JSON.stringify(error));
		}
	}

	async postAlmacenar(event: APIGatewayEvent): Promise<ResponseVO> {
		try {
			const params = JSON.parse(event.body || "{}");
			validateAlmacenarRequest(params);

			this.logger.info(
				"StarWarsController",
				"postAlmacenar",
				undefined,
				params,
				"Guardar nuevos datos"
			);

			const { body, statusCode } = await this.starWarsService.postAlmacenar(params);

			return new ResponseVO(
				statusCode as unknown as HTTP,
				JSON.stringify({ body }),
				{}
			) as ResponseVO;


		} catch (error) {
			return new ResponseVO(HTTP.STATUS_CODE_400, JSON.stringify(error));
		}
	}
}
