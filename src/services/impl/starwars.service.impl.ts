import { StarWarsService } from "../starwars.service";
import Logger from "../../logger/logger";
import { nanoid } from 'nanoid';
import TYPES from "../../types";
import { inject, injectable } from "inversify";
import ApiConnectorUtil from "../../utils/api-connector";
import CheckUtil from "../../utils/checkUtils";
import { HTTP, NUM } from "../../utils/enum";
import { StarWarsRepository } from "../../repository/starwars.repository";
import { PeopleResponse, PeopleWithPlanet } from "../../interfaces/People";
import { Planet } from "../../interfaces/Planet";
import { WeatherData } from "../../interfaces/WeatherCity";
import { ServiceResponse } from "../../interfaces/service-response";

@injectable()
export default class StarWarsServiceImpl implements StarWarsService {
	constructor(
		@inject(TYPES.StarWarsRepository)
		private starWarsRepository: StarWarsRepository,
		@inject(TYPES.Logger)
		private logger: Logger,
		@inject(TYPES.CheckUtil)
		private checkUtil: CheckUtil,
	) { }

	async crearFusion(): Promise<ServiceResponse> {
		this.logger.info(
			"StarWarsServiceImpl",
			"crearFusion",
			undefined,
			{},
			"crear Fusion"
		);

		const people: PeopleResponse = await this.starWarsRepository.getPeople();
		const homeworldUrl = people.homeworld;
		const planetId = homeworldUrl.split('/').filter(Boolean).pop();

		const getPlanet: Planet = await this.starWarsRepository.getPlanet(planetId);
		const city = this.checkUtil.getSimilarCity(getPlanet.name);

		const weatherCity: WeatherData = await this.starWarsRepository.getWeatherCity(city);

		const planet_id = await this.starWarsRepository.savePlanet(getPlanet, weatherCity);
		const result = await this.starWarsRepository.savePeople(planet_id, people);

		return {
			body: {
				message: 'Datos fusionados correctamente',
				result
			},
			statusCode: HTTP.STATUS_CODE_201 as unknown as string
		};
	};

	async getHistorial(page: string, limit: string): Promise<ServiceResponse> {

		const historial: PeopleWithPlanet[] = await this.starWarsRepository.getHistorial(page, limit);

		return {
			body: {
				message: 'Historial de datos cronologico',
				filters: {
					page: page,
					limit: limit
				},
				historial
			},
			statusCode: HTTP.STATUS_CODE_200 as unknown as string
		};
	};

	async postAlmacenar(peopleWithPlanet: PeopleWithPlanet): Promise<ServiceResponse> {
		const customPeople: PeopleWithPlanet = await this.starWarsRepository.saveCustomPeople(peopleWithPlanet);

		return {
			body: {
				message: 'Datos guardados correctamente',
				customPeople
			},
			statusCode: HTTP.STATUS_CODE_201 as unknown as string
		};
	};
}
