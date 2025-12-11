'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        // Get IG Accounts
        const accounts = await queryInterface.sequelize.query(
            `SELECT id FROM igb_accounts ORDER BY id ASC;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const stories = [];

        const portraitImages = [
            "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=720&q=80",
            "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=720&q=80",
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=720&q=80"
        ];

        const portraitVideos = [
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        ];

        for (const acc of accounts) {

            for (let i = 0; i < 3; i++) {

                const isVideo = Math.random() < 0.4; // 40% chance story is a video

                const media_url = isVideo
                    ? portraitVideos[i % portraitVideos.length]
                    : portraitImages[i % portraitImages.length];

                stories.push({
                    igb_account_id: acc.id,
                    fb_story_id: "story_" + acc.id + "_" + (i + 1),
                    likes: Math.floor(Math.random() * 150),
                    comments: Math.floor(Math.random() * 50),
                    permalink: "https://instagram.com/stories/demo/" + (i + 1),
                    shortcode: "storyShort" + (i + 1),
                    media_type: isVideo ? "VIDEO" : "IMAGE",
                    media_url,
                    thumbnail_url: media_url, // ok for mock
                    caption: isVideo ? "Behind the scenes 🎬" : "A day in business!",
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }

        await queryInterface.bulkInsert('ig_stories', stories, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_stories', null, {});
    }
};
