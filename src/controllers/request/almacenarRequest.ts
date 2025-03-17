import Joi from 'joi';

export const createAlmacenarSchema = Joi.object({
	name: Joi.string().max(255).required(),
	height: Joi.string().max(50).required(),
	mass: Joi.string().max(50).required(),
	hair_color: Joi.string().max(255).required(),
	skin_color: Joi.string().max(255).required(),
	eye_color: Joi.string().max(255).required(),
	birth_year: Joi.string().max(50).required(),
	gender: Joi.string().max(50).valid("male", "female", "other", "unknown", "hermaphrodite", "n/a").required(),
	planet: Joi.object({
		name: Joi.string().max(255).required(),
		rotation_period: Joi.string().max(50).required(),
		orbital_period: Joi.string().max(50).required(),
		diameter: Joi.string().max(50).required(),
		climate: Joi.string().max(255).required(),
		gravity: Joi.string().max(255).required(),
		terrain: Joi.string().max(255).required(),
		surface_water: Joi.string().max(50).required(),
		population: Joi.string().max(50).required(),
		city_name: Joi.string().max(255).required(),
		city_region: Joi.string().max(255).required(),
		city_country: Joi.string().max(255).required(),
		city_lat: Joi.number().precision(6).required(),
		city_lon: Joi.number().precision(6).required(),
		city_tz_id: Joi.string().max(255).required(),
		city_temp_c: Joi.number().precision(2).required(),
		city_temp_f: Joi.number().precision(2).required(),
		city_humidity: Joi.number().integer().min(0).max(100).required(),
	}).required()
});

export const validateAlmacenarRequest = (body: any): void => {
	const { error } = createAlmacenarSchema.validate(body, {
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
