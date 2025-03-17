const TYPES = {
	ApiConnectorUtil: Symbol.for("ApiConnectorUtil"),
	/* DATABASE MYSQL */
	ClientDatabase: Symbol.for('ClientDatabase'),
	/* REDIS */
	SessionClientRedis: Symbol.for("SessionClientRedis"),
	/* CONTROLLERS */
	StarWarsController: Symbol.for("StarWarsController"),
	/* SERVICE */
	StarWarsService: Symbol.for("StarWarsService"),
	/* REPOSITORY */
	StarWarsRepository: Symbol.for("StarWarsRepository"),
	/* EXTRA */
	Logger: Symbol.for("Logger"),
	CheckUtil: Symbol.for("CheckUtil"),
};

export default TYPES;
