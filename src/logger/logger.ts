import { CustomErrorResponse } from "../interfaces/custom-error";

export default interface Logger {
	info(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		...args: unknown[]
	): void;
	error(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		error: Error | undefined | string | CustomErrorResponse,
		...args: unknown[]
	): void;
	warning(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		error: Error | undefined | string,
		...args: unknown[]
	): void;
	debug(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		...args: unknown[]
	): void;
}
