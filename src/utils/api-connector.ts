import axios, { AxiosInstance, AxiosResponse } from "axios";
import { HEADERS, VALUE } from "./enum";

export default class ApiConnectorUtil {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			headers: {
				[HEADERS.CONTENT_TYPE]: VALUE.APPLICATION_JSON,
			},
		});
	}

	async get(
		baseURL: string,
		path: string,
		headers?: object,
		params?: object
	): Promise<AxiosResponse> {
		this.axiosInstance.defaults.baseURL = baseURL;
		return this.axiosInstance.get(path, { headers, params });
	}
}
