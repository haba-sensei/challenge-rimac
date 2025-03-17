import { HTTP } from "../utils/enum";

export default class ConexionTimeOutDatabaseException extends Error {
	public statusCode: number = HTTP.STATUS_CODE_500;

	constructor() {
		super();
	}

	public readonly response = {
		statusCode: this.statusCode,
		body: JSON.stringify({
			message: "Error de conexión con la base de datos",
		}),
	};
}
