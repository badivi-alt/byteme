import { NextResponse } from 'next/server';

export async function GET() {
  // return a minimal payload; replace with real data later
  return NextResponse.json({ ok: true });
}

// Add other handlers when needed:
// export async function POST(req: Request) { /* ... */ }
