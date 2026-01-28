import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 1. Find Stripe Customer by email
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1
        });

        if (customers.data.length === 0) {
            return NextResponse.json({ success: false, message: 'No Stripe customer record found for this email.' });
        }

        const customerId = customers.data[0].id;

        // 2. Fetch latest successful checkout session for this customer
        const sessions = await stripe.checkout.sessions.list({
            limit: 1,
            customer: customerId,
            status: 'complete',
            expand: ['data.subscription']
        });

        if (sessions.data.length === 0) {
            return NextResponse.json({ success: false, message: 'No completed payment found.' });
        }

        const session = sessions.data[0];

        // 2. Double check payment status
        if (session.payment_status === 'paid') {
            const tier = session.metadata?.tier || 'standard';

            // 3. Update Database (Simulating what the webhook would do)
            const { error } = await supabaseAdmin
                .from('profiles')
                .update({ subscription_tier: tier.toLowerCase() })
                .eq('id', user.id);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                tier: tier,
                message: 'Payment verified and profile updated.'
            });
        }

        return NextResponse.json({ success: false, message: 'Latest session not paid.' });

    } catch (error: any) {
        console.error('Verification failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
