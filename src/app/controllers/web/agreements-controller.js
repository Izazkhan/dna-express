import asyncHandler from "../../../utils/async-handler.js";
import AgreementService from "../../services/web/agreement-service.js";

class AgreementsController {
    constructor() {
        this.service = AgreementService;
    }

    index = asyncHandler(async (req, res) => {
        let result = await this.service.index(req);
        res.status(200).json({ message: 'Agreements list', result });
    })
}

export default new AgreementsController();