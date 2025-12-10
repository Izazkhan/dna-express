import { Op } from "sequelize";
import { IgPost } from "../../models/index.js";

export default class IgPostService {
    async getTopPosts(req) {
        return await IgPost.findAll();
    }
}