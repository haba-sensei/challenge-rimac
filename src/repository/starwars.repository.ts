import { People, PeopleResponse, PeopleWithPlanet } from "../interfaces/People";
import { Planet } from "../interfaces/Planet";
import { WeatherData } from "../interfaces/WeatherCity";

export interface StarWarsRepository {
	getPeople(): Promise<PeopleResponse>;
	getPlanet(planetId: string | undefined): Promise<Planet>;
	getWeatherCity(city: string | undefined): Promise<WeatherData>;
	savePlanet(planet: Planet, weatherCity: WeatherData): Promise<string>;
	savePeople(planetId: string, people: People): Promise<PeopleWithPlanet>;
	getHistorial(page: string, limit: string): Promise<PeopleWithPlanet[]>;
	saveCustomPeople(peopleWithPlanet: PeopleWithPlanet): Promise<PeopleWithPlanet>;
}
