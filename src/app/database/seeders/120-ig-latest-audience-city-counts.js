'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const COUNTRY_ID = 233;

        const LOCATION_PROFILES = [
            {
                stateId: 1434, // Arizona
                ratio: 0.6,
                cities: [
                    { cityId: 121748, ratio: 0.6 }, // Miami
                    { cityId: 127874, ratio: 0.4 }  // Tucson
                ]
            },
            {
                stateId: 1416, // California
                ratio: 0.4,
                cities: [
                    { cityId: 120784, ratio: 0.55 }, // Los Angeles
                    { cityId: 125809, ratio: 0.45 }  // San Francisco
                ]
            }
        ];

        // Fetch accounts
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

        // ✅ Pick ONE account to NOT be mixed
        
        const singleProfileAccountId = accounts[0].igb_account_id;
        for (const acc of accounts) {
            if (!acc.followers_count || acc.followers_count <= 0) continue;

            const totalFollowers = acc.followers_count;

            // 🔹 Decide profiles for this account
            const profilesToUse =
                acc.igb_account_id === singleProfileAccountId
                    ? [LOCATION_PROFILES[0]]        // single location only
                    : LOCATION_PROFILES;            // mixed locations

            let allocatedAcrossProfiles = 0;

            profilesToUse.forEach((profile, profileIndex) => {
                let profileFollowers;

                // Last profile gets remainder
                if (profileIndex === profilesToUse.length - 1) {
                    profileFollowers = totalFollowers - allocatedAcrossProfiles;
                } else {
                    profileFollowers = Math.floor(
                        totalFollowers * (profile.ratio || 1 / profilesToUse.length)
                    );
                    allocatedAcrossProfiles += profileFollowers;
                }

                let allocatedCityFollowers = 0;

                profile.cities.forEach((city, cityIndex) => {
                    let cityFollowers;

                    // Last city gets remainder
                    if (cityIndex === profile.cities.length - 1) {
                        cityFollowers = profileFollowers - allocatedCityFollowers;
                    } else {
                        cityFollowers = Math.floor(profileFollowers * city.ratio);
                        allocatedCityFollowers += cityFollowers;
                    }

                    rows.push({
                        igb_account_id: acc.igb_account_id,
                        data_country_id: COUNTRY_ID,
                        data_state_id: profile.stateId,
                        data_city_id: city.cityId,
                        value: cityFollowers,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                });
            });
        }

        // Reset table
        await queryInterface.sequelize.query(`
            TRUNCATE TABLE ig_latest_audience_city_counts
            RESTART IDENTITY CASCADE;
        `);

        if (rows.length) {
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
            { data_country_id: 233 },
            {}
        );
    }
};
