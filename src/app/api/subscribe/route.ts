import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to Supabase database using ADMIN client (Bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
          status: 'active',
          source: 'Newsletter'
        }
      ])
      .select();

    if (error) {
      // Check for duplicate email (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed!' },
          { status: 409 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Error: ${error.message} (${error.code})` },
        { status: 500 }
      );
    }

    console.log('New subscriber:', email);

    return NextResponse.json(
      {
        message: 'Successfully subscribed!',
        email: email,
        subscribedAt: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Newsletter subscription endpoint' },
    { status: 200 }
  );
}