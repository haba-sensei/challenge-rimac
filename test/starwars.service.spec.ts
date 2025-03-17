import StarWarsServiceImpl from "../src/services/impl/starwars.service.impl";
import { StarWarsService } from "../src/services/starwars.service";
import Logger from "../src/logger/logger";
import CheckUtil from "../src/utils/checkUtils";
import { HTTP } from "../src/utils/enum";
import { StarWarsRepository } from "../src/repository/starwars.repository";
import { PeopleResponse, PeopleWithPlanet } from "../src/interfaces/People";
import { Planet } from "../src/interfaces/Planet";
import { WeatherData } from "../src/interfaces/WeatherCity";

describe("StarWarsServiceImpl", () => {
	let starWarsRepository: jest.Mocked<StarWarsRepository>;
	let logger: jest.Mocked<Logger>;
	let checkUtil: jest.Mocked<CheckUtil>;
	let service: StarWarsService;

	beforeEach(() => {
		starWarsRepository = {
			getPeople: jest.fn(),
			getPlanet: jest.fn(),
			getWeatherCity: jest.fn(),
			savePlanet: jest.fn(),
			savePeople: jest.fn(),
			getHistorial: jest.fn(),
			saveCustomPeople: jest.fn(),
		} as any;

		logger = { info: jest.fn() } as any;
		checkUtil = { getSimilarCity: jest.fn() } as any;

		service = new StarWarsServiceImpl(starWarsRepository, logger, checkUtil);
	});

	test("crearFusion should return a valid ServiceResponse", async () => {
		const peopleResponse: PeopleResponse = {
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
			homeworld: "https://swapi.dev/api/planets/1/"
		};

		const planet: Planet = {
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

		starWarsRepository.getPeople.mockResolvedValue(peopleResponse);
		starWarsRepository.getPlanet.mockResolvedValue(planet);
		checkUtil.getSimilarCity.mockReturnValue("Mos Eisley");
		starWarsRepository.getWeatherCity.mockResolvedValue(weatherData);
		starWarsRepository.savePlanet.mockResolvedValue("1");
		starWarsRepository.savePeople.mockResolvedValue({ id: "1" } as any);

		const response = await service.crearFusion();

		expect(response.statusCode).toBe(HTTP.STATUS_CODE_201);
		expect((response.body as any).message).toBe("Datos fusionados correctamente");
	});

	test("getHistorial should return a valid ServiceResponse", async () => {
		const historialData: PeopleWithPlanet[] = [{
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
			}
		}];
		starWarsRepository.getHistorial.mockResolvedValue(historialData);

		const response = await service.getHistorial("1", "10");

		expect(response.statusCode).toBe(HTTP.STATUS_CODE_200);
		expect((response.body as any).message).toBe("Historial de datos cronologico");
	});

	test("postAlmacenar should return a valid ServiceResponse", async () => {
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
			}
		};

		starWarsRepository.saveCustomPeople.mockResolvedValue(peopleWithPlanet);

		const response = await service.postAlmacenar(peopleWithPlanet);

		expect(response.statusCode).toBe(HTTP.STATUS_CODE_201);
		expect((response.body as any).message).toBe("Datos guardados correctamente");
	});
});
