import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin'; // Requires Service Role!
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature');

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) return new NextResponse('Missing signature or secret', { status: 400 });
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = supabaseAdmin;

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                // Session completed. Grant access.
                const userId = session.metadata?.userId;
                const tier = session.metadata?.tier; // 'standard' or 'premium'
                const subscriptionId = session.subscription as string;

                if (userId && tier) {
                    // Update Profile
                    await supabase
                        .from('profiles')
                        .update({ subscription_tier: tier })
                        .eq('id', userId);

                    // Insert Subscription Record
                    // Fetch sub details to get end date
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

                    await supabase
                        .from('subscriptions')
                        .upsert({
                            id: subscription.id,
                            user_id: userId,
                            status: subscription.status,
                            price_id: subscription.items.data[0].price.id,
                            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                            cancel_at_period_end: subscription.cancel_at_period_end
                        });
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.userId; // Ensure we passed this in checkout metadata->subscription_data

                // If userId missing on subscription object (sometimes happens if not propagated), try to find by customer email or ID from subscriptions table
                let targetUserId = userId;
                if (!targetUserId) {
                    const { data } = await supabase.from('subscriptions').select('user_id').eq('id', subscription.id).single();
                    targetUserId = data?.user_id;
                }

                if (targetUserId) {
                    await supabase
                        .from('subscriptions')
                        .upsert({
                            id: subscription.id,
                            user_id: targetUserId,
                            status: subscription.status,
                            price_id: subscription.items.data[0].price.id,
                            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                            cancel_at_period_end: subscription.cancel_at_period_end
                        });

                    // If canceled/past_due, maybe downgrade profile?
                    // Usually we check status. If active/trialing -> good. Else -> free.
                    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
                        await supabase.from('profiles').update({ subscription_tier: 'free' }).eq('id', targetUserId);
                    }
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const { data } = await supabase.from('subscriptions').select('user_id').eq('id', subscription.id).single();
                const targetUserId = data?.user_id;

                if (targetUserId) {
                    await supabase.from('subscriptions').update({ status: 'canceled' }).eq('id', subscription.id);
                    await supabase.from('profiles').update({ subscription_tier: 'free' }).eq('id', targetUserId);
                }
                break;
            }
        }
    } catch (error: any) {
        console.error('Webhook handler failed:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }

    return new NextResponse('Received', { status: 200 });
}
