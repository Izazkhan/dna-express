import asyncHandler from "../../../utils/async-handler.js";
import TransactionService from "../../services/web/transaction-service.js";

/**
 * Controller handling the creation and retrieval of payment transactions.
 */
class TransactionsController {
    constructor() {
        this.service = TransactionService;
    }

    /**
     * @method create
     * @description Records a new transaction entry in the system.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    create = asyncHandler(async (req, res) => {
        const transaction = await this.service.create(req.body);
        return res.status(201).json(transaction);
    })

    /**
     * @method get
     * @description Retrieves specific transaction details by its ID.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
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