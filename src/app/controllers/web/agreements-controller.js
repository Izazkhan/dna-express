import asyncHandler from "../../../utils/async-handler.js";
import AgreementService from "../../services/web/agreement-service.js";

class AgreementsController {
    constructor() {
        this.service = AgreementService;
    }

    index = asyncHandler(async (req, res) => {
        let result = await this.service.index(req, 'active');
        res.status(200).json({ message: 'Active Agreements list', result });
    })
    
    completed = asyncHandler(async (req, res) => {
        let result = await this.service.index(req, 'completed');
        res.status(200).json({ message: 'Completed Agreements list', result });
    })
}

export default new AgreementsController();