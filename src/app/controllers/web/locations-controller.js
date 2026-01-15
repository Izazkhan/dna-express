import asyncHandler from "../../../utils/async-handler.js";
import { LocationService } from "../../services/web/location-service.js";

/**
 * Controller handling location-based search and retrieval.
 */
export class LocationController {
    /**
     * @method search
     * @description Searches for cities within the USA (Country ID 233) based on a query string.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    search = asyncHandler(async (req, res) => {
        const { q = '' } = req.query;
        // USA country id: 233
        const result = await LocationService.searchCities(q, { countryId: 233, limit: 10 });

        res.json(result);
    })
}

// Instantiate and export default for easy import
export default new LocationController();