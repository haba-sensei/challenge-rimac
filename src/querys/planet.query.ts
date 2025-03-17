const PlanetQuery = () => ({
	getByName: `
		SELECT * FROM planets WHERE name = ?
  `,
	insertPlanet: `
	INSERT INTO planets (
		id,
		name,
		rotation_period,
		orbital_period,
		diameter,
		climate,
		gravity,
		terrain,
		surface_water,
		population,
		city_name,
		city_region,
		city_country,
		city_lat,
		city_lon,
		city_tz_id,
		city_temp_c,
		city_temp_f,
		city_humidity
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
});

export default PlanetQuery;
