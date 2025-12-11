import Stripe from "stripe";
import AdCampaignService from "../../services/web/ad-campaign-service.js";
import TransactionService from "../../services/web/transaction-service.js";
import asyncHandler from "../../../utils/async-handler.js";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {
    constructor() {
        this.adCampaignService = AdCampaignService;
        this.transactionService = TransactionService;
    }
    createPaymentIntent = asyncHandler(async (req, res) => {
        try {
            const { amount, currency, metadata } = req.body;

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                automatic_payment_methods: {
                    enabled: false,
                },
                payment_method_types: ["card"],
                metadata: metadata
            });

            res.json({
                clientSecret: paymentIntent.client_secret,
            });

        } catch (error) {
            console.error("Stripe error:", error);
            return res.status(500).json({ error: error.message });
        }
    })

    verifyPayment = asyncHandler(async (req, res) => {
        const paymentIntentId = req.params.id;

        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                let metadata = paymentIntent.metadata;
                let campaign = await this.adCampaignService.get(req, metadata.campaign_id)
                res.json({
                    success: true,
                    message: 'Payment verified successfully.',
                    status: paymentIntent.status,
                    amount: paymentIntent.amount,
                    fee: metadata.transaction_fee,
                    currency: paymentIntent.currency,
                    campaign: campaign
                });
            } else {
                res.json({ success: false, message: 'Payment not completed.' });
            }
        } catch (error) {
            console.error("Stripe error:", error);
            return res.status(500).json({ error: error.message });
        }
    })

    handleStripeWebhook = asyncHandler(async (req, res) => {
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                req.headers['stripe-signature'],
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'payment_intent.succeeded') {
            const intent = event.data.object;
            const pid = intent.id;

            const campaignId = intent.metadata.campaign_id;
            const transaction_fee = intent.metadata.transaction_fee;
            const amount = intent.amount_received;
            this.transactionService.create({
                "ad_campaign_id": campaignId,
                "amount": amount,
                "status": "paid",
                "transaction_fee": transaction_fee,
                "payment_id": pid
            });
            if (this.adCampaignService.publishCampaign(campaignId)) {
                return res.status(200).json({ event_received: true, publsihed: true });
            }
        }
        return res.status(200).json({ event_received: true, publsihed: false });
    })
}

export default new PaymentController();