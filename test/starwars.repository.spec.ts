import StarWarsRepositoryImpl from "../src/repository/impl/starwars.repository.impl";
import { Database } from "../src/config/database/database.interface";
import ApiConnectorUtil from "../src/utils/api-connector";
import { RedisClientType } from "redis";
import Logger from "../src/logger/logger";
import CheckUtil from "../src/utils/checkUtils";
import { Planet } from "../src/interfaces/Planet";
import { People, PeopleResponse, PeopleWithPlanet } from "../src/interfaces/People";
import { WeatherData } from "../src/interfaces/WeatherCity";
import { ERROR_NO_CONEXION } from "../src/utils/constants";
import ConexionTimeOutDatabaseException from "../src/exceptions/conexion-time-out-database.exception";

jest.mock("nanoid", () => ({
	nanoid: jest.fn(() => "fixed-uuid")
}));

describe("StarWarsRepositoryImpl", () => {
	let mockDatabase: Partial<Database>;
	let mockPool: { query: jest.Mock };
	let mockApiConnectorUtil: Partial<ApiConnectorUtil>;
	let mockRedisClient: Partial<RedisClientType>;
	let mockLogger: Partial<Logger>;
	let mockCheckUtil: Partial<CheckUtil>;
	let repository: StarWarsRepositoryImpl;

	beforeEach(() => {
		mockPool = { query: jest.fn() };
		mockDatabase = { pool: mockPool } as unknown as Database;
		mockApiConnectorUtil = { get: jest.fn() };
		mockRedisClient = {
			get: jest.fn(),
			set: jest.fn()
		};
		mockLogger = {
			info: jest.fn(),
			error: jest.fn()
		};
		mockCheckUtil = {
			getRandomNumber: jest.fn(),
			mapToPeopleWithPlanet: jest.fn()
		};

		repository = new StarWarsRepositoryImpl(
			mockDatabase as any,
			mockApiConnectorUtil as ApiConnectorUtil,
			mockRedisClient as RedisClientType,
			mockLogger as Logger,
			mockCheckUtil as CheckUtil
		);
	});

	describe("getPeople", () => {
		test("should return people data from cache", async () => {
			const randomId = 5;
			const cachedPeople: PeopleResponse = {
				id: "1",
				name: "Luke Skywalker",
				height: "172",
				mass: "77",
				hair_color: "blond",
				skin_color: "fair",
				eye_color: "blue",
				birth_year: "19BBY",
				gender: "male",
				planet_id: "1",
				homeworld: "https://swapi.dev/api/people/1/"
			};
			(mockCheckUtil.getRandomNumber as jest.Mock).mockReturnValue(randomId);
			(mockRedisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedPeople));

			const result = await repository.getPeople();
			expect(result).toEqual(cachedPeople);
			expect(mockLogger.info).toHaveBeenCalledWith(
				"StarWarsRepositoryImpl",
				"getPeople",
				undefined,
				{ randomId },
				"Cache hit"
			);
		});

		test("should fetch people data from API and cache it", async () => {
			const randomId = 10;
			const apiData: PeopleResponse = {
				id: "2",
				name: "Darth Vader",
				height: "202",
				mass: "136",
				hair_color: "none",
				skin_color: "white",
				eye_color: "yellow",
				birth_year: "41.9BBY",
				gender: "male",
				planet_id: "2",
				homeworld: "https://swapi.dev/api/people/2/"
			};
			(mockCheckUtil.getRandomNumber as jest.Mock).mockReturnValue(randomId);
			(mockRedisClient.get as jest.Mock).mockResolvedValue(null);
			(mockApiConnectorUtil.get as jest.Mock).mockResolvedValue({ data: apiData });

			const result = await repository.getPeople();
			expect(result).toEqual(apiData);
			expect(mockRedisClient.set).toHaveBeenCalledWith(
				`people_${randomId}`,
				JSON.stringify(apiData),
				{ EX: 1800 }
			);
		});

		test("should throw ConexionTimeOutDatabaseException if error code equals ERROR_NO_CONEXION", async () => {
			const randomId = 7;
			const errorObj = { code: ERROR_NO_CONEXION };
			(mockCheckUtil.getRandomNumber as jest.Mock).mockReturnValue(randomId);
			(mockRedisClient.get as jest.Mock).mockRejectedValue(errorObj);

			await expect(repository.getPeople()).rejects.toThrow(ConexionTimeOutDatabaseException);
		});
	});

	describe("getPlanet", () => {
		const planetId = "1";
		const apiPlanetData: Planet = {
			id: "1",
			name: "Tatooine",
			rotation_period: "23",
			orbital_period: "304",
			diameter: "10465",
			climate: "arid",
			gravity: "1 standard",
			terrain: "desert",
			surface_water: "1",
			population: "200000",
			city_name: "Mos Eisley",
			city_region: "Tatooine Region",
			city_country: "Tatooine",
			city_lat: 0,
			city_lon: 0,
			city_tz_id: "UTC",
			city_temp_c: 30,
			city_temp_f: 86,
			city_humidity: 10
		};

		test("should return planet data from cache", async () => {
			(mockRedisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(apiPlanetData));

			const result = await repository.getPlanet(planetId);
			expect(result).toEqual(apiPlanetData);
			expect(mockLogger.info).toHaveBeenCalledWith(
				"StarWarsRepositoryImpl",
				"getPlanet",
				undefined,
				{ planetId },
				"Cache hit"
			);
		});

		test("should fetch planet data from API and use DB data if exists", async () => {
			(mockRedisClient.get as jest.Mock).mockResolvedValue(null);
			(mockApiConnectorUtil.get as jest.Mock).mockResolvedValue({ data: apiPlanetData });
			// Simular que la consulta en DB devuelve datos
			const dbPlanetData = { ...apiPlanetData, name: "Tatooine DB" };
			(mockPool.query as jest.Mock).mockResolvedValueOnce([[dbPlanetData]]);

			const result = await repository.getPlanet(planetId);
			expect(result).toEqual(dbPlanetData);
			expect(mockRedisClient.set).toHaveBeenCalledWith(
				`planet_${planetId}`,
				JSON.stringify(dbPlanetData),
				{ EX: 1800 }
			);
		});

		test("should fetch planet data from API and use API data if DB returns empty", async () => {
			(mockRedisClient.get as jest.Mock).mockResolvedValue(null);
			(mockApiConnectorUtil.get as jest.Mock).mockResolvedValue({ data: apiPlanetData });
			// Simular que la consulta en DB retorna arreglo vacío
			(mockPool.query as jest.Mock).mockResolvedValueOnce([[]]);

			const result = await repository.getPlanet(planetId);
			expect(result).toEqual(apiPlanetData);
			expect(mockRedisClient.set).toHaveBeenCalledWith(
				`planet_${planetId}`,
				JSON.stringify(apiPlanetData),
				{ EX: 1800 }
			);
		});
	});

	describe("getWeatherCity", () => {
		const city = "Mos Eisley";
		const weatherData: WeatherData = {
			location: {
				name: "Mos Eisley",
				region: "Tatooine Region",
				country: "Tatooine",
				lat: 0,
				lon: 0,
				tz_id: "UTC",
				localtime_epoch: 0,
				localtime: "00:00"
			},
			current: {
				last_updated_epoch: 0,
				last_updated: "",
				temp_c: 30,
				temp_f: 86,
				is_day: 1,
				condition: {
					text: "Sunny",
					icon: "",
					code: 1000
				},
				wind_mph: 0,
				wind_kph: 0,
				wind_degree: 0,
				wind_dir: "",
				pressure_mb: 0,
				pressure_in: 0,
				precip_mm: 0,
				precip_in: 0,
				humidity: 0,
				cloud: 0,
				feelslike_c: 30,
				feelslike_f: 86,
				windchill_c: 30,
				windchill_f: 86,
				heatindex_c: 30,
				heatindex_f: 86,
				dewpoint_c: 30,
				dewpoint_f: 86,
				vis_km: 10,
				vis_miles: 6,
				uv: 1,
				gust_mph: 0,
				gust_kph: 0
			}
		};

		test("should return weather data from cache", async () => {
			(mockRedisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(weatherData));

			const result = await repository.getWeatherCity(city);
			expect(result).toEqual(weatherData);
			expect(mockLogger.info).toHaveBeenCalledWith(
				"StarWarsRepositoryImpl",
				"getWeatherCity",
				undefined,
				{ city },
				"Cache hit"
			);
		});

		test("should fetch weather data from API and cache it", async () => {
			(mockRedisClient.get as jest.Mock).mockResolvedValue(null);
			process.env.WEATHER_API_KEY = "testkey";
			(mockApiConnectorUtil.get as jest.Mock).mockResolvedValue({ data: weatherData });

			const result = await repository.getWeatherCity(city);
			expect(result).toEqual(weatherData);
			expect(mockRedisClient.set).toHaveBeenCalledWith(
				`weatherCity_${city}`,
				JSON.stringify(weatherData),
				{ EX: 1800 }
			);
		});
	});

	describe("savePlanet", () => {
		const planet: Planet = {
			id: "1",
			name: "Naboo",
			rotation_period: "26",
			orbital_period: "312",
			diameter: "12120",
			climate: "temperate",
			gravity: "1 standard",
			terrain: "grassy hills, swamps, forests, mountains",
			surface_water: "12",
			population: "4500000000",
			city_name: "Theed",
			city_region: "Theed Region",
			city_country: "Naboo",
			city_lat: 0,
			city_lon: 0,
			city_tz_id: "UTC",
			city_temp_c: 25,
			city_temp_f: 77,
			city_humidity: 50
		};

		const weatherData: WeatherData = {
			location: {
				name: "Theed",
				region: "Theed Region",
				country: "Naboo",
				lat: 0,
				lon: 0,
				tz_id: "UTC",
				localtime_epoch: 0,
				localtime: "00:00"
			},
			current: {
				last_updated_epoch: 0,
				last_updated: "",
				temp_c: 25,
				temp_f: 77,
				is_day: 1,
				condition: {
					text: "Clear",
					icon: "",
					code: 1000
				},
				wind_mph: 0,
				wind_kph: 0,
				wind_degree: 0,
				wind_dir: "",
				pressure_mb: 0,
				pressure_in: 0,
				precip_mm: 0,
				precip_in: 0,
				humidity: 50,
				cloud: 0,
				feelslike_c: 25,
				feelslike_f: 77,
				windchill_c: 25,
				windchill_f: 77,
				heatindex_c: 25,
				heatindex_f: 77,
				dewpoint_c: 25,
				dewpoint_f: 77,
				vis_km: 10,
				vis_miles: 6,
				uv: 1,
				gust_mph: 0,
				gust_kph: 0
			}
		};

		test("should return existing planet id if planet already exists in DB", async () => {
			// Simula que la consulta en DB retorna un registro existente
			(mockPool.query as jest.Mock).mockResolvedValueOnce([[{ id: "existing-id" }]]);
			const result = await repository.savePlanet(planet, weatherData);
			expect(result).toBe("existing-id");
		});

		test("should insert new planet and return new planet id if not exists", async () => {
			// Simula que la consulta en DB retorna arreglo vacío para que se inserte el planeta
			(mockPool.query as jest.Mock).mockResolvedValueOnce([[]]);
			// Se simula la inserción sin retorno (se ignora)
			(mockPool.query as jest.Mock).mockResolvedValueOnce([[]]);
			const result = await repository.savePlanet(planet, weatherData);
			expect(result).toBe("fixed-uuid");
		});
	});

	describe("savePeople", () => {
		const people: People = {
			id: "1",
			name: "Luke Skywalker",
			height: "172",
			mass: "77",
			hair_color: "blond",
			skin_color: "fair",
			eye_color: "blue",
			birth_year: "19BBY",
			gender: "male",
			planet_id: "1"
		};

		const mappedPeople: PeopleWithPlanet = {
			id: "mapped-id",
			name: people.name,
			height: people.height,
			mass: people.mass,
			hair_color: people.hair_color,
			skin_color: people.skin_color,
			eye_color: people.eye_color,
			birth_year: people.birth_year,
			gender: people.gender,
			planet: {
				id: "planet-id",
				name: "Tatooine",
				rotation_period: "23",
				orbital_period: "304",
				diameter: "10465",
				climate: "arid",
				gravity: "1 standard",
				terrain: "desert",
				surface_water: "1",
				population: "200000",
				city_name: "Mos Eisley",
				city_region: "Tatooine Region",
				city_country: "Tatooine",
				city_lat: 0,
				city_lon: 0,
				city_tz_id: "UTC",
				city_temp_c: 30,
				city_temp_f: 86,
				city_humidity: 10
			}
		};

		test("should return existing people if found in DB", async () => {
			// Simula que la consulta para obtener la persona retorna un registro
			(mockPool.query as jest.Mock).mockResolvedValueOnce([[{ id: "existing", name: people.name }]]);
			(mockCheckUtil.mapToPeopleWithPlanet as jest.Mock).mockReturnValue(mappedPeople);

			const result = await repository.savePeople("planet-id", people);
			expect(result).toEqual(mappedPeople);
		});

		test("should insert new people and return mapped result if not found", async () => {
			// Simula que la consulta para obtener la persona retorna arreglo vacío
			(mockPool.query as jest.Mock)
				.mockResolvedValueOnce([[]]) // getPeopleByName devuelve vacío
				.mockResolvedValueOnce([[]]) // inserción, sin retorno
				.mockResolvedValueOnce([[{ id: "new-id", name: people.name }]]); // getPeopleById
			(mockCheckUtil.mapToPeopleWithPlanet as jest.Mock).mockReturnValue(mappedPeople);

			const result = await repository.savePeople("planet-id", people);
			expect(result).toEqual(mappedPeople);
		});
	});

	describe("getHistorial", () => {
		test("should return historial list mapped", async () => {
			const page = "1";
			const limit = "10";
			const dbRows = [
				{ id: "1", name: "Luke Skywalker" },
				{ id: "2", name: "Darth Vader" }
			];
			(mockPool.query as jest.Mock).mockResolvedValueOnce([dbRows]);
			(mockCheckUtil.mapToPeopleWithPlanet as jest.Mock).mockImplementation((row) => ({
				...row,
				planet: {}
			}));

			const result = await repository.getHistorial(page, limit);
			expect(result).toEqual([
				{ id: "1", name: "Luke Skywalker", planet: {} },
				{ id: "2", name: "Darth Vader", planet: {} }
			]);
		});
	});

	describe("saveCustomPeople", () => {
		const peopleWithPlanet: PeopleWithPlanet = {
			id: "1",
			name: "Luke Skywalker",
			height: "172",
			mass: "77",
			hair_color: "blond",
			skin_color: "fair",
			eye_color: "blue",
			birth_year: "19BBY",
			gender: "male",
			planet: {
				id: "planet-1",
				name: "Tatooine",
				rotation_period: "23",
				orbital_period: "304",
				diameter: "10465",
				climate: "arid",
				gravity: "1 standard",
				terrain: "desert",
				surface_water: "1",
				population: "200000",
				city_name: "Mos Eisley",
				city_region: "Tatooine Region",
				city_country: "Tatooine",
				city_lat: 0,
				city_lon: 0,
				city_tz_id: "UTC",
				city_temp_c: 30,
				city_temp_f: 86,
				city_humidity: 10
			}
		};

		test("should save custom people and return mapped result", async () => {
			// Simula las consultas para insertar planeta y persona
			(mockPool.query as jest.Mock)
				.mockResolvedValueOnce([[]]) // Inserción de planeta
				.mockResolvedValueOnce([[]]) // Inserción de persona
				.mockResolvedValueOnce([[{ id: "new-id", name: peopleWithPlanet.name }]]); // getPeopleById
			(mockCheckUtil.mapToPeopleWithPlanet as jest.Mock).mockReturnValue(peopleWithPlanet);

			const result = await repository.saveCustomPeople(peopleWithPlanet);
			expect(result).toEqual(peopleWithPlanet);
		});
	});
});
