import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/route';
import { updateProfileSchema } from '@/lib/validations/user';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await request.json();
    const validatedData = updateProfileSchema.parse(data);

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
} 