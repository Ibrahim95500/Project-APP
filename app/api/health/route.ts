import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Check DB connection
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: 'ok', database: 'connected' }, { status: 200 });
    } catch (error) {
        console.error('Health Check Error:', error);
        return NextResponse.json({ status: 'error', database: 'disconnected' }, { status: 500 });
    }
}
