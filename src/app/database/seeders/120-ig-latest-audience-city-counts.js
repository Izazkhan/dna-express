'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const COUNTRY_ID = 233;

        const LOCATION_PROFILES = [
            {
                stateId: 1434, // Arizona
                cities: [
                    { cityId: 121748, ratio: 0.6 }, // Miami
                    { cityId: 127874, ratio: 0.4 }  // Tucson
                ]
            },
            {
                stateId: 1416, // California
                cities: [
                    { cityId: 120784, ratio: 0.55 }, // Los Angeles
                    { cityId: 125809, ratio: 0.45 }  // San Francisco
                ]
            }
        ];

        // Fetch accounts with followers
        const accounts = await queryInterface.sequelize.query(`
        SELECT 
            a.id AS igb_account_id,
            pi.followers_count
        FROM igb_accounts a
        JOIN ig_profile_average_insights pi
            ON pi.igb_account_id = a.id
        ORDER BY a.id ASC
        `,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const rows = [];
console.log('accounts', accounts.length);
        accounts.forEach((acc, index) => {
            let profile = LOCATION_PROFILES[0]; // for all other profiles, seed Arizona
            if (index == 1) {
                profile = LOCATION_PROFILES[1]; // Seed California
            }

            // Safety check
            if (!profile) return;
            if (!acc.followers_count || acc.followers_count <= 0) return;

            const total = acc.followers_count;
            let allocated = 0;

            profile.cities.forEach((city, cityIndex) => {
                let value;

                // Last city gets remainder to preserve total
                if (cityIndex === profile.cities.length - 1) {
                    value = total - allocated;
                } else {
                    value = Math.floor(total * city.ratio);
                    allocated += value;
                }
                console.log('Here...', profile);
                rows.push({
                    igb_account_id: acc.igb_account_id,
                    data_country_id: COUNTRY_ID,
                    data_state_id: profile.stateId,
                    data_city_id: city.cityId,
                    value,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            });
        });

        // Reset table
        await queryInterface.sequelize.query(`
      TRUNCATE TABLE ig_latest_audience_city_counts
      RESTART IDENTITY CASCADE;
    `);

        if (rows.length > 0) {
            await queryInterface.bulkInsert(
                'ig_latest_audience_city_counts',
                rows,
                {}
            );
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'ig_latest_audience_city_counts',
            {
                data_country_id: 233
            },
            {}
        );
    }
};
