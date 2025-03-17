import { PeopleWithPlanet } from "../interfaces/People";
import { ServiceResponse } from "../interfaces/service-response";

export interface StarWarsService {
	crearFusion(): Promise<ServiceResponse>;

	getHistorial(
		page: string,
		limit: string,
	): Promise<ServiceResponse>;

	postAlmacenar(
		PeopleWithPlanet: PeopleWithPlanet,
	): Promise<ServiceResponse>;
}
