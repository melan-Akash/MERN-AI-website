import Stripe from 'stripe';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { planId, isYearly } = req.body;
        const userId = req.user._id;

        // Pricing logic
        let amount = 0;
        let planName = '';

        if (planId === 'pro') {
            amount = isYearly ? 15 * 12 : 19;
            planName = 'Pro Plan';
        } else if (planId === 'enterprise') {
            amount = isYearly ? 39 * 12 : 49;
            planName = 'Enterprise Plan';
        } else {
            return res.status(400).json({ success: false, message: 'Invalid plan' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${planName} (${isYearly ? 'Yearly' : 'Monthly'})`,
                            description: `Upgrade to ${planName} on Do with Ai`,
                        },
                        unit_amount: amount * 100, // Stripe expects amounts in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
            cancel_url: `http://localhost:5173/`,
            client_reference_id: userId.toString(),
            metadata: {
                userId: userId.toString(),
                planId: planId
            }
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyStripePayment = async (req, res) => {
    try {
        const { session_id, plan } = req.body;
        const userId = req.user._id;

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid' && session.client_reference_id === userId.toString()) {
            await User.findByIdAndUpdate(userId, { plan: plan });
            res.json({ success: true, message: "Payment verified, plan updated" });
        } else {
            res.status(400).json({ success: false, message: "Payment not verified" });
        }
    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
