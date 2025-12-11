import { Op } from "sequelize";
import models from "../../models/index.js";

const { IgPost } = models;

class IgPostService {
    async getTopPosts(req) {
        return await IgPost.findAll();
    }
}

export default new IgPostService;