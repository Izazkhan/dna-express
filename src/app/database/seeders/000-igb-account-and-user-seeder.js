'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        // -----------------------------------------------------
        // Constants
        // -----------------------------------------------------
        const FB_USER_ID = "fb_user_1234567890";

        // -----------------------------------------------------
        // User Seed Data
        // -----------------------------------------------------
        const users = [
            {
                fb_user_id: FB_USER_ID,
                access_token: "cb6a33faf0f842a4347da3eb74de4598:06b3e21299d05575712a3e63f69dc08ef3138de516c8c42d92f5e7d6221551b1", // encrypted version of: fb_user_token_1234567890
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        // -----------------------------------------------------
        // IGB Account Seed Data
        // -----------------------------------------------------
        const igbAccounts = [
            {
                user_id: 1,
                fb_page_id: "fb_page_1111111111",
                instagram_account_id: "ig_account_17841401234567890",
                name: "Johns Instagram Biz",
                username: "johns_biz_insta",
                profile_picture_url: "https://example.com/profile1.jpg",
                website: "https://johns-biz.com",
                is_profile: true,
                is_tag_generator: false,
                is_active: true,
                is_featured: true,
                featured_date: "2025-06-01T00:00:00Z",
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        // -----------------------------------------------------
        // TRUNCATE + INSERT
        // -----------------------------------------------------

        await queryInterface.sequelize.query(
            'TRUNCATE users RESTART IDENTITY CASCADE;'
        );

        await queryInterface.sequelize.query(
            'TRUNCATE igb_accounts RESTART IDENTITY CASCADE;'
        );

        await queryInterface.bulkInsert('users', users, {});
        await queryInterface.bulkInsert('igb_accounts', igbAccounts, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('igb_accounts', null, {});
        await queryInterface.bulkDelete('users', null, {});
    }
};
