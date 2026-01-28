import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server'; // We need server client for Auth
import { stripe } from '@/lib/stripe';

// Define your implementation price IDs here (or fetching from DB is better)
// Since we are mocking or using test mode, we can use lookup_keys or hardcoded IDs if we know them.
// For simplicity in this implementation, we will create products on the fly or rely on Price ID passed from frontend.
// BEST PRACTICE: Pass priceId from frontend.

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        console.log("Supabase Client:", !!supabase); // Check if client exists
        // console.log("Supabase Auth:", !!supabase?.auth); // Check if auth exists

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error("Auth Error:", authError);
            return NextResponse.json({ error: 'Authentication Error' }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { priceId, priceName } = await req.json();

        // Optional: Create Stripe Customer if not exists. 
        // For now, checkout works without it, but for subscriptions we usually want to attach it to a customer.
        // We will let Stripe create the customer during checkout and then bind it in webhook.
        // Or if you want to reuse customers, you need to store stripe_customer_id in profiles.

        // Get or Create Customer (Simplified: we let Stripe handle new customer creation for now, 
        // OR we search by email. searching by email is safer to avoid dupes).
        let customerId;
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId, // Use existing if found
            customer_email: customerId ? undefined : user.email, // Use email if new
            line_items: [
                {
                    price: priceId, // The ID from Stripe Dashboard
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?payment=cancelled`,
            metadata: {
                userId: user.id,
                tier: priceName?.toLowerCase() || 'standard', // 'standard' or 'premium'
            },
            subscription_data: {
                metadata: {
                    userId: user.id, // Store ID on subscription too
                }
            }
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Checkout Error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
