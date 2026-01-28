const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/STRIPE_SECRET_KEY=(sk_test_[a-zA-Z0-9]+)/);

if (!match) {
    console.error('Could not find STRIPE_SECRET_KEY');
    process.exit(1);
}

const stripe = new Stripe(match[1]);

async function listPrices() {
    console.log('Fetching Prices...');
    try {
        const prices = await stripe.prices.list({ limit: 10, expand: ['data.product'] });
        const simplified = prices.data.map(p => ({
            productName: typeof p.product === 'string' ? p.product : p.product.name,
            priceId: p.id,
            amount: p.unit_amount
        }));
        fs.writeFileSync(path.resolve(__dirname, '../prices.json'), JSON.stringify(simplified, null, 2));
        console.log('Prices written to prices.json');
    } catch (e) {
        console.error(e);
    }
}

listPrices();
