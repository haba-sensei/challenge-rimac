declare module "@aws-lambda-powertools/logger/lib/types/Log" {
	export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

	export interface Log {
		level: string;
		message: string;
		timestamp?: string;
		[key: string]: any;
	}

	export class Logger {
		constructor(options?: LoggerOptions);
		info(message: string, meta?: Record<string, any>): void;
		warn(message: string, meta?: Record<string, any>): void;
		error(message: string, meta?: Record<string, any>): void;
		debug(message: string, meta?: Record<string, any>): void;
		log(message: string, meta?: Record<string, any>): void;
	}

	export interface LoggerOptions {
		level?: string;
		logFormat?: string;
		[key: string]: any;
	}
}
