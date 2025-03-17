export enum HEADERS {
	CONTENT_TYPE = "Content-Type",
}

export enum PATHS {
	GET_FUSIONADOS = "GET:/fusionados",
	GET_HISTORIAL = "GET:/historial",
	POST_ALMACENAR = "POST:/almacenar",
}

export enum MethodHTTP {
	POST = "POST",
	GET = "GET",
}

export enum ENV {
	LOCAL = "local",
	DEV = "dev",
	PROD = "prod",
	AWS_REGION_DEV = "AWS_REGION_DEV",
	AWS_ENDPOINT = "AWS_ENDPOINT",
}

export const enum VALUE {
	ALLOW = "*",
	APPLICATION_JSON = "application/json",
}

export enum NUM {
	ZERO = 0,
	ONE = 1,
	TWO = 2,
	THREE = 3,
	FOUR = 4,
	FIVE = 5,
	SIX = 6,
	SEVEN = 7,
	EIGHT = 8,
	NINE = 9,
	TEN = 10,
	SIXTEEN = 16,
	EIGHTY_TWO = 82,
}

export enum BOOLEAN {
	TRUE = 1,
	FALSE = 0,
}

export enum HTTP {
	STATUS_CODE_201 = 201,
	STATUS_CODE_200 = 200,
	STATUS_CODE_400 = 400,
	STATUS_CODE_401 = 401,
	STATUS_CODE_403 = 403,
	STATUS_CODE_404 = 404,
	STATUS_CODE_409 = 409,
	STATUS_CODE_500 = 500,
}
