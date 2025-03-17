import { inject, injectable } from "inversify";
import { RedisClientType } from 'redis';
import TYPES from "../../types";
import Logger from "../../logger/logger";
import { StarWarsRepository } from "../starwars.repository";
import { Planet } from "../../interfaces/Planet";
import { People, PeopleResponse, PeopleWithPlanet } from "../../interfaces/People";
import ApiConnectorUtil from "../../utils/api-connector";
import { API_SWAPI_URL, ERROR_NO_CONEXION, WEATHER_API_URL } from "../../utils/constants";
import ConexionTimeOutDatabaseException from "../../exceptions/conexion-time-out-database.exception";
import { WeatherData } from "../../interfaces/WeatherCity";
import { Database } from "../../config/database/database.interface";
import { nanoid } from "nanoid";
import CheckUtil from "../../utils/checkUtils";
import PlanetQuery from "../../querys/planet.query";
import PeopleQuery from "../../querys/people.query";


@injectable()
export default class StarWarsRepositoryImpl implements StarWarsRepository {
	constructor(
		@inject(TYPES.ClientDatabase)
		private clientDatabase: Database,
		@inject(TYPES.ApiConnectorUtil)
		private apiConnectorUtil: ApiConnectorUtil,
		@inject(TYPES.SessionClientRedis)
		private sessionClientRedis: RedisClientType,
		@inject(TYPES.Logger)
		private logger: Logger,
		@inject(TYPES.CheckUtil)
		private checkUtil: CheckUtil,
	) { }

	public async getPeople(): Promise<PeopleResponse> {
		try {
			const randomId = this.checkUtil.getRandomNumber();

			this.logger.info(
				"StarWarsRepositoryImpl",
				"getPeople",
				undefined,
				{ randomId },
				"get People"
			);

			const cachedData = await this.sessionClientRedis.get(`people_${randomId}`);
			if (cachedData) {
				this.logger.info(
					"StarWarsRepositoryImpl",
					"getPeople",
					undefined,
					{ randomId },
					"Cache hit"
				);
				return JSON.parse(cachedData);
			}

			const swapiResponse = await this.apiConnectorUtil.get(
				API_SWAPI_URL,
				`people/${randomId}/`
			);

			if (!swapiResponse.data) {
				throw new Error("No se encontró la persona.");
			}

			await this.sessionClientRedis.set(`people_${randomId}`, JSON.stringify(swapiResponse.data), {
				EX: 1800, // 30 minutos
			});

			return swapiResponse.data;
		} catch (error) {
			if ((error as any).code === ERROR_NO_CONEXION) {
				const newError = new ConexionTimeOutDatabaseException();
				this.logger.error(
					"StarWarsRepositoryImpl",
					"getPeople",
					undefined,
					{ error },
					`condition:: "error.code === ERROR_NO_CONEXION"`,
					newError
				);
				throw newError;
			}

			this.logger.error(
				"StarWarsRepositoryImpl",
				"getPeople",
				undefined,
				{ error },
				"Error obteniendo la persona",
				""
			);

			throw error;
		}
	}

	public async getPlanet(planetId: string | undefined): Promise<Planet> {
		try {
			this.logger.info(
				"StarWarsRepositoryImpl",
				"getPlanet",
				undefined,
				{ planetId },
				"get Planet"
			);

			if (!planetId) {
				throw new Error("No se proporcionó el ID del planeta.");
			}

			const cachedData = await this.sessionClientRedis.get(`planet_${planetId}`);
			if (cachedData) {
				this.logger.info(
					"StarWarsRepositoryImpl",
					"getPlanet",
					undefined,
					{ planetId },
					"Cache hit"
				);
				return JSON.parse(cachedData);
			}

			const swapiResponse = await this.apiConnectorUtil.get(
				API_SWAPI_URL,
				`planets/${planetId}/`
			);

			if (!swapiResponse.data) {
				throw new Error("No se encontró el planeta.");
			}

			const planetName = swapiResponse.data.name;

			this.logger.info(
				"StarWarsRepositoryImpl",
				"getPlanet",
				undefined,
				{ planetName },
				"planetName"
			);

			const [rows]: any = await this.clientDatabase.pool.query(
				PlanetQuery().getByName,
				[planetName]
			);

			this.logger.info(
				"StarWarsRepositoryImpl",
				"getPlanet",
				undefined,
				{ rows },
				"rows"
			);

			let planetData = [];

			if (rows.length === 0) {
				planetData = swapiResponse.data;
			} else {
				planetData = rows[0];
			}

			await this.sessionClientRedis.set(`planet_${planetId}`, JSON.stringify(planetData), {
				EX: 1800, // 30 minutos
			});

			return planetData;
		} catch (error) {
			if ((error as any).code === ERROR_NO_CONEXION) {
				const newError = new ConexionTimeOutDatabaseException();
				this.logger.error(
					"StarWarsRepositoryImpl",
					"getPlanet",
					undefined,
					{ error },
					`condition:: "error.code === ERROR_NO_CONEXION"`,
					newError
				);
				throw newError;
			}

			this.logger.error(
				"StarWarsRepositoryImpl",
				"getPlanet",
				undefined,
				{ error },
				"Error obteniendo el planeta",
				""
			);

			throw error;
		}
	}

	public async getWeatherCity(city: string | undefined): Promise<WeatherData> {
		try {
			this.logger.info(
				"StarWarsRepositoryImpl",
				"getWeatherCity",
				undefined,
				{ city },
				"get Planet"
			);

			if (!city) {
				throw new Error("No se proporcionó el nombre de la ciudad.");
			}

			const cachedData = await this.sessionClientRedis.get(`weatherCity_${city}`);
			if (cachedData) {
				this.logger.info(
					"StarWarsRepositoryImpl",
					"getWeatherCity",
					undefined,
					{ city },
					"Cache hit"
				);
				return JSON.parse(cachedData);
			}

			const basePath = `?key=${process.env.WEATHER_API_KEY}`;

			const weatherResponse = await this.apiConnectorUtil.get(
				WEATHER_API_URL,
				`current.json${basePath}&q=${city}`
			);

			if (!weatherResponse.data) {
				throw new Error("No se encontró la información meteorológica.");
			}

			await this.sessionClientRedis.set(`weatherCity_${city}`, JSON.stringify(weatherResponse.data), {
				EX: 1800, // 30 minutos
			});

			return weatherResponse.data;
		} catch (error) {
			if ((error as any).code === ERROR_NO_CONEXION) {
				const newError = new ConexionTimeOutDatabaseException();
				this.logger.error(
					"StarWarsRepositoryImpl",
					"getWeatherCity",
					undefined,
					{ error },
					`condition:: "error.code === ERROR_NO_CONEXION"`,
					newError
				);
				throw newError;
			}

			this.logger.error(
				"StarWarsRepositoryImpl",
				"getWeatherCity",
				undefined,
				{ error },
				"Error obteniendo la información meteorológica",
				""
			);

			throw error;
		}
	}

	public async savePlanet(planet: Planet, weatherCity: WeatherData): Promise<string> {
		try {
			this.logger.info(
				"StarWarsRepositoryImpl",
				"savePlanet",
				undefined,
				{ planet: planet.name },
				"save Planet"
			);

			if (!planet) {
				throw new Error("No se proporcionó el planeta.");
			}

			const planetName = planet.name;
			const planetUUID = nanoid();

			this.logger.info(
				"StarWarsRepositoryImpl",
				"savePlanet",
				undefined,
				{ planetName },
				"planetName"
			);

			const [rows]: any = await this.clientDatabase.pool.query(
				PlanetQuery().getByName,
				[planetName]
			);

			this.logger.info(
				"StarWarsRepositoryImpl",
				"getPlanet",
				undefined,
				{ rows },
				"rows"
			);

			if (rows.length > 0) {
				return rows[0].id;
			} else {
				const planetData = {
					id: planetUUID,
					name: planet.name,
					rotation_period: planet.rotation_period,
					orbital_period: planet.orbital_period,
					diameter: planet.diameter,
					climate: planet.climate,
					gravity: planet.gravity,
					terrain: planet.terrain,
					surface_water: planet.surface_water,
					population: planet.population,
					city_name: weatherCity.location.name,
					city_region: weatherCity.location.region,
					city_country: weatherCity.location.country,
					city_lat: weatherCity.location.lat,
					city_lon: weatherCity.location.lon,
					city_tz_id: weatherCity.location.tz_id,
					city_temp_c: weatherCity.current.temp_c,
					city_temp_f: weatherCity.current.temp_f,
					city_humidity: weatherCity.current.humidity,
				};

				await this.clientDatabase.pool.query(
					PlanetQuery().insertPlanet,
					Object.values(planetData)
				);

				return planetUUID;
			}
		} catch (error) {
			if ((error as any).code === ERROR_NO_CONEXION) {
				const newError = new ConexionTimeOutDatabaseException();
				this.logger.error(
					"StarWarsRepositoryImpl",
					"getPlanet",
					undefined,
					{ error },
					`condition:: "error.code === ERROR_NO_CONEXION"`,
					newError
				);
				throw newError;
			}

			this.logger.error(
				"StarWarsRepositoryImpl",
				"getPlanet",
				undefined,
				{ error },
				"Error obteniendo el planeta",
				""
			);

			throw error;
		}
	}

	public async savePeople(planetId: string, people: People): Promise<PeopleWithPlanet> {
		try {
			this.logger.info(
				"StarWarsRepositoryImpl",
				"savePeople",
				undefined,
				{ planetId, people: people.name },
				"save People"
			);

			if (!planetId) {
				throw new Error("No se proporcionó el planeta.");
			}

			const peopleName = people.name;

			const [rows]: any = await this.clientDatabase.pool.query(
				PeopleQuery().getPeopleByName,
				[peopleName]
			);

			if (rows.length > 0) {
				return this.checkUtil.mapToPeopleWithPlanet(rows[0]);
			}

			const newPeopleId = nanoid();

			await this.clientDatabase.pool.query(PeopleQuery().insertPeople, [
				newPeopleId,
				people.name,
				people.height,
				people.mass,
				people.hair_color,
				people.skin_color,
				people.eye_color,
				people.birth_year,
				people.gender,
				planetId
			]);

			const [insertedRows]: any = await this.clientDatabase.pool.query(
				PeopleQuery().getPeopleById,
				[newPeopleId]
			);

			return this.checkUtil.mapToPeopleWithPlanet(insertedRows[0]);

		} catch (error) {
			this.logger.error(
				"StarWarsRepositoryImpl",
				"savePeople",
				undefined,
				{ error },
				"Error guardando la persona",
				""
			);
			throw error;
		}
	}

	public async getHistorial(page: string, limit: string): Promise<PeopleWithPlanet[]> {
		try {
			this.logger.info(
				"StarWarsRepositoryImpl",
				"getHistorial",
				undefined,
				{ page, limit },
				"save People"
			);

			if (!page || !limit) {
				throw new Error("No se proporcionó filtros.");
			}

			const offset = (parseInt(page) - 1) * parseInt(limit);

			const [rows]: any = await this.clientDatabase.pool.query(
				PeopleQuery().paginatePeople,
				[parseInt(limit), offset]
			);

			return rows.map(this.checkUtil.mapToPeopleWithPlanet);
		} catch (error) {
			this.logger.error(
				"StarWarsRepositoryImpl",
				"getHistorial",
				undefined,
				{ error },
				"Error listando historial de personas",
				""
			);
			throw error;
		}
	}

	public async saveCustomPeople(peopleWithPlanet: PeopleWithPlanet): Promise<PeopleWithPlanet> {
		try {
			this.logger.info(
				"StarWarsRepositoryImpl",
				"saveCustomPeople",
				undefined,
				{ peopleWithPlanet },
				"save custom People"
			);

			if (!peopleWithPlanet) {
				throw new Error("No se proporcionó la persona con planeta.");
			}

			const planetId = nanoid();
			const planet = peopleWithPlanet.planet;
			const peopleId = nanoid();

			const planetData = {
				id: planetId,
				name: planet.name,
				rotation_period: planet.rotation_period,
				orbital_period: planet.orbital_period,
				diameter: planet.diameter,
				climate: planet.climate,
				gravity: planet.gravity,
				terrain: planet.terrain,
				surface_water: planet.surface_water,
				population: planet.population,
				city_name: planet.city_name,
				city_region: planet.city_region,
				city_country: planet.city_country,
				city_lat: planet.city_lat,
				city_lon: planet.city_lon,
				city_tz_id: planet.city_tz_id,
				city_temp_c: planet.city_temp_c,
				city_temp_f: planet.city_temp_f,
				city_humidity: planet.city_humidity,
			};

			await this.clientDatabase.pool.query(
				PlanetQuery().insertPlanet,
				Object.values(planetData)
			);

			await this.clientDatabase.pool.query(PeopleQuery().insertPeople, [
				peopleId,
				peopleWithPlanet.name,
				peopleWithPlanet.height,
				peopleWithPlanet.mass,
				peopleWithPlanet.hair_color,
				peopleWithPlanet.skin_color,
				peopleWithPlanet.eye_color,
				peopleWithPlanet.birth_year,
				peopleWithPlanet.gender,
				planetId
			]);

			const [insertedRows]: any = await this.clientDatabase.pool.query(
				PeopleQuery().getPeopleById,
				[peopleId]
			);

			return this.checkUtil.mapToPeopleWithPlanet(insertedRows[0]);
		} catch (error) {
			this.logger.error(
				"StarWarsRepositoryImpl",
				"saveCustomPeople",
				undefined,
				{ error },
				"Error guardando la persona",
				""
			);
			throw error;
		}
	}
}
