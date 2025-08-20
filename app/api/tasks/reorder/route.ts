import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // If you plan to send a new order, parse it here:
  // const body = await req.json();  // e.g., { ids: string[] }
  return NextResponse.json({ ok: true });
}

// Optional GET so you can hit it in a browser too
export async function GET() {
  return NextResponse.json({ ok: true, route: 'tasks/reorder' });
}
