import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
    try {
        // 1. Create Standard Price ($18) for product 'prod_Tru6HsYdwXAYEP'
        const standardPrice = await stripe.prices.create({
            unit_amount: 1800, // $18.00
            currency: 'usd',
            recurring: { interval: 'year' },
            product: 'prod_Tru6HsYdwXAYEP',
            metadata: { tier: 'Standard' }
        });

        // 2. Create Premium Price ($40) for product 'prod_Tru62sIJSOgZ5N'
        const premiumPrice = await stripe.prices.create({
            unit_amount: 4000, // $40.00
            currency: 'usd',
            recurring: { interval: 'year' },
            product: 'prod_Tru62sIJSOgZ5N',
            metadata: { tier: 'Premium' }
        });

        return NextResponse.json({
            standard: standardPrice,
            premium: premiumPrice
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
