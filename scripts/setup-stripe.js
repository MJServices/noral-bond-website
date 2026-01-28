const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Read .env.local to get key
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/STRIPE_SECRET_KEY=(sk_test_[a-zA-Z0-9]+)/);

if (!match) {
    console.error('Could not find STRIPE_SECRET_KEY in .env.local');
    process.exit(1);
}

const stripe = new Stripe(match[1]);

async function setup() {
    console.log('Creating Products...');

    try {
        // Standard Plan
        const standard = await stripe.products.create({
            name: 'Standard Plan',
            description: 'For dedicated learners',
            default_price_data: {
                currency: 'usd',
                unit_amount: 999, // $9.99
                recurring: { interval: 'month' }
            }
        });
        console.log(`STANDARD_PRICE_ID=${standard.default_price}`);

        // Premium Plan
        const premium = await stripe.products.create({
            name: 'Premium Plan',
            description: 'For power users',
            default_price_data: {
                currency: 'usd',
                unit_amount: 1999, // $19.99
                recurring: { interval: 'month' }
            }
        });
        console.log(`PREMIUM_PRICE_ID=${premium.default_price}`);

    } catch (e) {
        console.error('Error creating products:', e);
    }
}

setup();
