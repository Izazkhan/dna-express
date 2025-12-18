'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        // -----------------------------------------------------
        // User Seed Data
        // -----------------------------------------------------
        const users = [
            {
                fb_user_id: 'fb_user_1234567890',
                access_token: "e8096ecdacc2e8e53dc2f4ef0c0cbf71:88c6ee450cc3a6caa9e45cf6bbc511f3bfd03847b95baf16d90beca4a92e80a4", // encrypted version of: fb_user_token_1234567890
                created_at: new Date(),
                updated_at: new Date()
            }, {
                fb_user_id: 'fb_user_1234567891',
                access_token: "8dc730145b56d03918752e74c7a1cf84:008f28d3ce456939ad169fa7235e45f86c23878b6063e1400e3a33c467f77a9e", // encrypted version of: fb_user_token_1234567891
                created_at: new Date(),
                updated_at: new Date()
            }, {
                fb_user_id: 'fb_user_1234567892',
                access_token: "192107a9dab382adc3e9681685a9ecc7:72c633fa86997374fc69c469c550f1bf4850a843659803acc4a9d07df4b2fb2a", // encrypted version of: fb_user_token_1234567892
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
            }, {
                user_id: 2,
                fb_page_id: "fb_page_1111111112",
                instagram_account_id: "ig_account_17841401234567891",
                name: "Izaz Khan",
                username: "izaz_biz_insta",
                profile_picture_url: "https://example.com/profile1.jpg",
                website: "https://izaz-biz.com",
                is_profile: true,
                is_tag_generator: false,
                is_active: true,
                is_featured: true,
                featured_date: "2025-06-02T00:00:00Z",
                created_at: new Date(),
                updated_at: new Date()
            }, {
                user_id: 3,
                fb_page_id: "fb_page_1111111113",
                instagram_account_id: "ig_account_17841401234567892",
                name: "Izaz Khan",
                username: "azaz_biz_insta",
                profile_picture_url: "https://example.com/profile1.jpg",
                website: "https://azaz-biz.com",
                is_profile: true,
                is_tag_generator: false,
                is_active: true,
                is_featured: true,
                featured_date: "2025-06-02T00:00:00Z",
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
