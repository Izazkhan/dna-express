import { sequelize } from "../../../config/database.js";

export class LocationService {
    static async searchCities(query, options = {}) {
        const { countryId, limit = 10 } = options;

        const results = await sequelize.query(
            `
            SELECT *
            FROM (

                -- 1. Matching state
                SELECT 
                    0 AS sortOrder,
                    'state' AS type,
                    s.id AS "stateId",
                    s.name AS "stateName",
                    NULL AS "cityId",
                    NULL AS "cityName"
                FROM data_states s
                WHERE LOWER(s.name) LIKE LOWER(:searchLike)
                ${countryId ? "AND s.data_country_id = :countryId" : ""}
                
                UNION ALL

                -- 2. Matching cities
                SELECT
                    1 AS sortOrder,
                    'city' AS type,
                    s.id AS "stateId",
                    s.name AS "stateName",
                    c.id AS "cityId",
                    c.name AS "cityName"
                FROM data_cities c
                JOIN data_states s ON s.id = c.data_state_id
                WHERE 
                    LOWER(c.name) LIKE LOWER(:searchLike)
                    ${countryId ? "AND c.data_country_id = :countryId" : ""}

            ) AS q
            LIMIT :limit;
            `,
            {
                replacements: {
                    searchLike: `${query}%`,
                    countryId: countryId || null,
                    limit,
                },
                type: sequelize.QueryTypes.SELECT,
            });

        // Normalize output for front-end
        return results.map(r => ({
            type: r.type,         // 'state' or 'city'
            display_name: r.type == 'state' ? r.stateName : `${r.cityName}, ${r.stateName}`,
            state: r.stateId ? {
                id: parseInt(r.stateId),
                name: r.stateName,
                country_id: countryId,
            } : null,
            city: r.cityId ? {
                id: parseInt(r.cityId),
                name: r.cityName,
            } : null
        }));
    }
}
