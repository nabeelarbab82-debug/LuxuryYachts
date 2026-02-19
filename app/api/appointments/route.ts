import { NextResponse } from 'next/server';

// In-memory store for demonstration (replace with DB in production)
let appointments: Array<{
  id: string;
  name: string;
  email: string;
  date: string;
  message: string;
}> = [];

export async function GET() {
  // Return all appointments
  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newAppointment = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    date: data.date,
    message: data.message || '',
  };
  appointments.push(newAppointment);
  return NextResponse.json(newAppointment, { status: 201 });
}
