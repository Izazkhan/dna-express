import asyncHandler from "../../../utils/async-handler.js";
import TransactionService from "../../services/web/transaction-service.js";

class TransactionsController {
    constructor() {
        this.service = TransactionService;
    }
    create = asyncHandler(async (req, res) => {
        try {
            const transaction = await this.service.create(req.body);
            res.status(201).json(transaction);
        } catch (error) {
            console.error("Transaction error:", error);
            res.status(500).json({ error: error.message });
        }
    })

    get = asyncHandler(async (req, res) => {
        try {
            const { transactionId } = req.params;
            const transaction = await this.service.getTransactionById(transactionId);
            if (transaction) {
                res.json(transaction);
            } else {
                res.status(404).json({ message: 'Transaction not found' });
            }
        } catch (error) {
            console.error("Transaction error:", error);
            res.status(500).json({ error: error.message });
        }
    })
}

export default new TransactionsController();