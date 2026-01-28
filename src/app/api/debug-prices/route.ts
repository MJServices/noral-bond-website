import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
    try {
        const standardPrices = await stripe.prices.list({
            product: 'prod_Tru6HsYdwXAYEP',
            active: true,
            limit: 10
        });

        const premiumPrices = await stripe.prices.list({
            product: 'prod_Tru62sIJSOgZ5N',
            active: true,
            limit: 10
        });

        return NextResponse.json({
            standard_product_prices: standardPrices.data,
            premium_product_prices: premiumPrices.data
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
