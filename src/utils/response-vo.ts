import { HTTP } from "./enum";

export default class ResponseVO {
	constructor(
		public statusCode: HTTP,
		public body: string,
		public headers?: object
	) {
		this.headers = {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		};
	}
}
