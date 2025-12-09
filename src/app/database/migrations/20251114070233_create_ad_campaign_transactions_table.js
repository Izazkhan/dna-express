'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ad_campaign_transactions (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                ad_campaign_id  BIGINT REFERENCES ad_campaigns (id),
                igb_account_id  BIGINT REFERENCES igb_accounts (id),
                user_id         BIGINT REFERENCES users (id),
                amount          INTEGER not null,
                fee             INTEGER null,
                transaction_fee INTEGER null,
                platform_fee    INTEGER null,
                extra_fee       INTEGER null,
                currency        VARCHAR(8) not null,
                status          VARCHAR(32) not null,
                payment_id      VARCHAR(255) not null,
                created_at      timestamptz,
                updated_at      timestamptz
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ad_campaign_transactions
        `);
    }
};