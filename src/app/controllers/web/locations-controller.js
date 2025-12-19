import asyncHandler from "../../../utils/async-handler.js";
import { LocationService } from "../../services/web/location-service.js";

export class LocationController {
    search = asyncHandler(async (req, res) => {
        const { q = '' } = req.query;
        // USA country id: 233
        const result = await LocationService.searchCities(q, { countryId: 233, limit: 10 });

        res.json(result);
    })
}

// Instantiate and export default for easy import
export default new LocationController();