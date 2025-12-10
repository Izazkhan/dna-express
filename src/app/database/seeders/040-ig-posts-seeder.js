'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        const randomMediaType = () => {
            const types = ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'];
            return types[Math.floor(Math.random() * types.length)];
        };

        // Instagram common aspect ratios with realistic resolutions
        const dimensions = [
            { w: 1080, h: 1080 }, // square 1:1
            { w: 1080, h: 1350 }, // portrait 4:5
            { w: 1350, h: 1080 }, // landscape ~1.25:1 (close to 1.91:1 but more common)
        ];

        const pickDimension = () => {
            return dimensions[Math.floor(Math.random() * dimensions.length)];
        };

        const posts = [];

        for (let i = 0; i < 50; i++) {
            const dim = pickDimension();

            posts.push({
                igb_account_id: 1,
                is_active: true,
                fb_post_id: `fake_fb_post_${i + 1}`,
                likes: Math.floor(Math.random() * 5000),
                comments: Math.floor(Math.random() * 500),
                permalink: `https://instagram.com/p/fake_${i + 1}`,
                media_type: randomMediaType(),
                media_url: `https://picsum.photos/${dim.w}/${dim.h}?random=${i + 1}`,
                thumbnail_url: `https://picsum.photos/${Math.floor(dim.w / 2)}/${Math.floor(dim.h / 2)}?thumb=${i + 1}`,
                caption: `Fake caption for post ${i + 1}`,
                video_title: null,
                media_product_type: 'FEED',
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        // Clear table first
        await queryInterface.sequelize.query(
            'TRUNCATE ig_posts RESTART IDENTITY CASCADE;'
        );

        await queryInterface.bulkInsert('ig_posts', posts, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_posts', null, {});
    }
};
