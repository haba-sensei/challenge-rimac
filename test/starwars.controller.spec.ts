import { APIGatewayEvent } from "aws-lambda";
import StarWarsController from "../src/controllers/starwars.controller";
import { StarWarsService } from "../src/services/starwars.service";
import Logger from "../src/logger/logger";
import { HTTP } from "../src/utils/enum";
import { validateAlmacenarRequest } from "../src/controllers/request/almacenarRequest";
import { validateQueryParamsRequest } from "../src/controllers/request/queryParamsRequest";

jest.mock("../src/controllers/request/almacenarRequest");
jest.mock("../src/controllers/request/queryParamsRequest");

describe("StarWarsController", () => {
	let starWarsService: jest.Mocked<StarWarsService>;
	let logger: jest.Mocked<Logger>;
	let controller: StarWarsController;

	beforeEach(() => {
		starWarsService = {
			crearFusion: jest.fn(),
			getHistorial: jest.fn(),
			postAlmacenar: jest.fn(),
		} as any;

		logger = {
			info: jest.fn(),
		} as any;

		controller = new StarWarsController(starWarsService, logger);
	});

	test("getFusionados should return a valid ResponseVO", async () => {
		starWarsService.crearFusion.mockResolvedValue({ body: { success: true }, statusCode: "200" });

		const event = {} as APIGatewayEvent;
		const response = await controller.getFusionados(event);

		expect(response.statusCode).toBe("200");
		expect(response.body).toBe(JSON.stringify({ success: true }));
	});

	test("getHistorial should return a valid ResponseVO", async () => {
		const event = { queryStringParameters: { page: "1", limit: "10" } } as any;
		starWarsService.getHistorial.mockResolvedValue({ body: [{ id: 1 }], statusCode: "200" });

		const response = await controller.getHistorial(event);

		expect(validateQueryParamsRequest).toHaveBeenCalledWith(event.queryStringParameters);
		expect(response.statusCode).toBe("200");
		expect(response.body).toBe(JSON.stringify({ body: [{ id: 1 }] }));
	});

	test("postAlmacenar should return a valid ResponseVO", async () => {
		const event = { body: JSON.stringify({ name: "test" }) } as any;
		starWarsService.postAlmacenar.mockResolvedValue({ body: { success: true }, statusCode: "201" });

		const response = await controller.postAlmacenar(event);

		expect(validateAlmacenarRequest).toHaveBeenCalledWith({ name: "test" });
		expect(response.statusCode).toBe("201");
		expect(response.body).toBe(JSON.stringify({ body: { success: true } }));
	});

	test("getFusionados should handle errors", async () => {
		starWarsService.crearFusion.mockRejectedValue(new Error("Service error"));
		const event = {} as APIGatewayEvent;
		const response = await controller.getFusionados(event);

		expect(response.statusCode).toBe(HTTP.STATUS_CODE_400);
		expect(response.body).toBe(JSON.stringify(new Error("Service error")));
	});
});
