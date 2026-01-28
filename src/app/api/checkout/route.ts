import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ message: 'Checkout is temporarily disabled for maintenance.' });
}
