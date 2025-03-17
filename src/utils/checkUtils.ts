import { PeopleWithPlanet } from "../interfaces/People";
import { planetCityMap } from "./constants";
import { NUM } from "./enum";

export default class CheckUtil {
	public getRandomNumber(): number {
		return Math.floor(Math.random() * NUM.EIGHTY_TWO) + NUM.ONE;
	}

	public getSimilarCity(planet: string): string {
		return planetCityMap.get(planet) || "Antártida";
	}

	public mapToPeopleWithPlanet(data: any): PeopleWithPlanet {
		return {
			id: data.id,
			name: data.name,
			height: data.height,
			mass: data.mass,
			hair_color: data.hair_color,
			skin_color: data.skin_color,
			eye_color: data.eye_color,
			birth_year: data.birth_year,
			gender: data.gender,
			planet: {
				id: data.planet_id,
				name: data.planet_name,
				rotation_period: data.rotation_period,
				orbital_period: data.orbital_period,
				diameter: data.diameter,
				climate: data.climate,
				gravity: data.gravity,
				terrain: data.terrain,
				surface_water: data.surface_water,
				population: data.population,
				city_name: data.city_name,
				city_region: data.city_region,
				city_country: data.city_country,
				city_lat: data.city_lat,
				city_lon: data.city_lon,
				city_tz_id: data.city_tz_id,
				city_temp_c: data.city_temp_c,
				city_temp_f: data.city_temp_f,
				city_humidity: data.city_humidity,
			},
		};
	}
}
