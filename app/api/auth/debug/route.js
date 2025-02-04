import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' });
    }

    // Ne jamais faire cela en production !
    return NextResponse.json({
      id: user._id,
      email: user.email,
      hashedPassword: user.password,
      role: user.role
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
} 