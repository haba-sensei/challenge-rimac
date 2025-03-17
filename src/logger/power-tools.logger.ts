import { injectable } from "inversify";
import { $log } from "ts-log-debug";
import { Logger as PowerTools } from "@aws-lambda-powertools/logger";
import { LogLevel } from "@aws-lambda-powertools/logger/lib/esm/types/Logger";
import Logger from "./logger";
import NumbersInWords from "./utils/numbers-to-words";
import StringsUtils from "./utils/strings-utils";
import { CustomErrorResponse } from "../interfaces/custom-error";

interface Argument {
	[key: string]: any;
}

@injectable()
export default class PowerToolsLogger implements Logger {
	private _logger: PowerTools;

	constructor(requestId: string) {
		this._logger = new PowerTools({
			serviceName: "fn-challenge-rimac",
			logLevel: <LogLevel>"INFO",
			persistentLogAttributes: {
				awsRequestId: requestId,
			},
		});
	}

	private extractExtraInfo(args: any, _extraInfo: Argument = {}): Argument {
		const extraInfo = _extraInfo;
		for (const [argName, argData] of Object.entries(args)) {
			if (typeof argData === "object") {
				this.extractExtraInfo(argData, extraInfo);
			} else {
				const key: string = Number.isNaN(Number(argName))
					? argName
					: StringsUtils.convertToCamelCase(
						`extra info ${NumbersInWords.numberToWords(
							Object.keys(extraInfo).length + 1
						)}`
					);
				extraInfo[key] = argData;
			}
		}
		return extraInfo;
	}

	private replaceParams(
		originalString: string,
		...params: (string | undefined)[]
	): string {
		let currentIndex = 0;

		const replacedString = originalString.replace(/%[sd]/g, (match) => {
			if (match === "%s" || match === "%d") {
				const param = params[currentIndex++];
				return param !== null && param !== undefined ? param.toString() : "";
			}
			return match;
		});

		return replacedString;
	}

	public info(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		...args: unknown[]
	): void {
		const extraInfo = this.extractExtraInfo(args);
		const typeLogger = process.env.ACTIVE_LOCAL_LOGGER;

		const logMessage = this.replaceParams(msg, ...Object.values(extraInfo));
		const logData = {
			data: object,
			executionTime,
			operation,
			className,
			...extraInfo,
		};

		if (typeLogger && typeLogger === "active") {
			$log.info(
				`${this._logger.getPersistentLogAttributes().awsRequestId} |`,
				`${logMessage}`,
				JSON.stringify(logData, null, 2)
			);
		} else {
			this._logger.info(logMessage, logData);
		}
	}

	public error(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		error: Error | undefined | CustomErrorResponse | any,
		...args: unknown[]
	): void {
		const extraInfo = this.extractExtraInfo(args);
		const typeLogger = process.env.ACTIVE_LOCAL_LOGGER;

		const logMessage = this.replaceParams(msg, ...Object.values(extraInfo));
		const logData = {
			data: object,
			error:
				error.response && error.response.body
					? JSON.parse(error.response.body)
					: error,
			executionTime,
			className,
			operation,
			...extraInfo,
		};

		if (typeLogger && typeLogger === "active") {
			$log.error(
				`${this._logger.getPersistentLogAttributes().awsRequestId} |`,
				`${logMessage} :`,
				JSON.stringify(logData, null, 2)
			);
		} else {
			this._logger.error(logMessage, logData);
		}
	}

	public warning(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		_error: Error | undefined,
		...args: unknown[]
	): void {
		const extraInfo = this.extractExtraInfo(args);
		const typeLogger = process.env.ACTIVE_LOCAL_LOGGER;

		const logMessage = this.replaceParams(msg, ...Object.values(extraInfo));
		const logData = {
			data: object,
			executionTime,
			className,
			operation,
			...extraInfo,
		};

		if (typeLogger && typeLogger === "active") {
			$log.warn(
				`${this._logger.getPersistentLogAttributes().awsRequestId} |`,
				`${logMessage} :`,
				JSON.stringify(logData, null, 2)
			);
		} else {
			this._logger.warn(logMessage, logData);
		}
	}

	public debug(
		operation: string,
		className: string,
		executionTime: number | undefined,
		object: object,
		msg: string,
		...args: unknown[]
	): void {
		const extraInfo = this.extractExtraInfo(args);
		const typeLogger = process.env.ACTIVE_LOCAL_LOGGER;

		const logMessage = this.replaceParams(msg, ...Object.values(extraInfo));
		const logData = {
			data: object,
			executionTime,
			className,
			operation,
			...extraInfo,
		};

		if (typeLogger && typeLogger === "active") {
			$log.debug(
				`${this._logger.getPersistentLogAttributes().awsRequestId} |`,
				`${logMessage} :`,
				JSON.stringify(logData, null, 2)
			);
		} else {
			this._logger.debug(logMessage, logData);
		}
	}
}
