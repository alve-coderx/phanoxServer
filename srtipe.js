require('dotenv').config()
const  Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const handler = async (req, res) => {
    console.log(req.body)
    try {
        // create a Coupone
        const coupon = await stripe.coupons.create({percent_off: 20, duration: 'once'});

        const promotionCode = await stripe.promotionCodes.create({
            coupon: coupon.id,
            code: coupon.id,
        });
        
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                { shipping_rate: 'shr_1LiuuAGAKTvokZDbpGZladXr' },
            ],
            line_items: req.body.map((item) => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.title,
                            images: [item.images[0]],
                        },
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity: item.quantity,
                }
            }),
            allow_promotion_codes: true,
            success_url: `${req.headers.origin}?success=true`,
            cancel_url: `${req.headers.origin}?canceled=true`,
        };
        
        const session = await stripe.checkout.sessions.create(params);
        
        res.status(200).json({id: session.id})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 500, message: error.message})
    }
}

module.exports = { handler }