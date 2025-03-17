const PeopleQuery = () => ({
	insertPeople: `
		INSERT INTO people (
			id,
			name,
			height,
			mass,
			hair_color,
			skin_color,
			eye_color,
			birth_year,
			gender,
			planet_id
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
	`,
	getPeopleByName: `
		SELECT
			p.id,
			p.name,
			p.height,
			p.mass,
			p.hair_color,
			p.skin_color,
			p.eye_color,
			p.birth_year,
			p.gender,
			pl.id AS planet_id,
			pl.name AS planet_name,
			pl.rotation_period,
			pl.orbital_period,
			pl.diameter,
			pl.climate,
			pl.gravity,
			pl.terrain,
			pl.surface_water,
			pl.population,
			pl.city_name,
			pl.city_region,
			pl.city_country,
			pl.city_lat,
			pl.city_lon,
			pl.city_tz_id,
			pl.city_temp_c,
			pl.city_temp_f,
			pl.city_humidity
		FROM people p
			JOIN planets pl ON p.planet_id = pl.id
		WHERE p.name = ?
  `,
	getPeopleById: `
	SELECT
			p.id,
			p.name,
			p.height,
			p.mass,
			p.hair_color,
			p.skin_color,
			p.eye_color,
			p.birth_year,
			p.gender,
			pl.id AS planet_id,
			pl.name AS planet_name,
			pl.rotation_period,
			pl.orbital_period,
			pl.diameter,
			pl.climate,
			pl.gravity,
			pl.terrain,
			pl.surface_water,
			pl.population,
			pl.city_name,
			pl.city_region,
			pl.city_country,
			pl.city_lat,
			pl.city_lon,
			pl.city_tz_id,
			pl.city_temp_c,
			pl.city_temp_f,
			pl.city_humidity
		FROM people p
			JOIN planets pl ON p.planet_id = pl.id
		WHERE p.id = ?
	`,
	paginatePeople: `
		SELECT
			p.id,
			p.name,
			p.height,
			p.mass,
			p.hair_color,
			p.skin_color,
			p.eye_color,
			p.birth_year,
			p.gender,
			p.created_at,
			pl.id AS planet_id,
			pl.name AS planet_name,
			pl.rotation_period,
			pl.orbital_period,
			pl.diameter,
			pl.climate,
			pl.gravity,
			pl.terrain,
			pl.surface_water,
			pl.population,
			pl.city_name,
			pl.city_region,
			pl.city_country,
			pl.city_lat,
			pl.city_lon,
			pl.city_tz_id,
			pl.city_temp_c,
			pl.city_temp_f,
			pl.city_humidity
		FROM people p
			LEFT JOIN planets pl ON p.planet_id = pl.id
			ORDER BY p.created_at DESC
		LIMIT ? OFFSET ?;
	`
});

export default PeopleQuery;
