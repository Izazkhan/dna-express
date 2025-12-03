'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ad_campaign_transactions (
                id              bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                ad_campaign_id  bigint REFERENCES ad_campaigns (id),
                igb_account_id  bigint REFERENCES igb_accounts (id),
                user_id         integer REFERENCES users (id),
                amount          integer not null,
                fee             integer null,
                transaction_fee integer null,
                platform_fee    integer null,
                extra_fee       integer null,
                currency        varchar(8) not null,
                status          varchar(32) not null,
                payment_id      varchar(255) not null,
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