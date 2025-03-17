import Joi from 'joi';

export const queryParamsSchema = Joi.object({
	page: Joi.number().integer().min(1).required(),
	limit: Joi.number().integer().min(1).max(100).required(), // Máximo de 100 registros por página para control de carga
});

export const validateQueryParamsRequest = (queryParams: any): void => {
	const { error } = queryParamsSchema.validate(queryParams, {
		abortEarly: true,
		allowUnknown: false,
	});

	if (error) {
		throw {
			object: 'error',
			type: 'param_error',
			user_message: error.message,
		};
	}
};
