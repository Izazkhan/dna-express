import asyncHandler from "../../../utils/async-handler.js";
import TransactionService from "../../services/web/transaction-service.js";

class TransactionsController {
    constructor() {
        this.service = TransactionService;
    }
    create = asyncHandler(async (req, res) => {
        const transaction = await this.service.create(req.body);
        return res.status(201).json(transaction);
    })

    get = asyncHandler(async (req, res) => {
        const { transactionId } = req.params;
        const transaction = await this.service.getTransactionById(transactionId);
        if (transaction) {
            res.json(transaction);
        } else {
            return res.status(404).json({ message: 'Transaction not found' });
        }
    })
}

export default new TransactionsController();