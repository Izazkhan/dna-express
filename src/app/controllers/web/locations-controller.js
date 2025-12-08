import { LocationService } from "../../services/web/location-service.js";

export class LocationController {
    async search(req, res) {
        try {
            const { q = '' } = req.query;

            // USA country id: 233
            const result = await LocationService.searchCities(q, { countryId: 233, limit: 10 });

            res.json(result);
        } catch (error) {
            console.error('Location search error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

// Instantiate and export default for easy import
export default new LocationController();