import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userSchema } from '@/lib/validations/user';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const validatedData = userSchema.parse(data);
    console.log('Données reçues pour inscription:', validatedData);

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      console.log('Email déjà utilisé:', validatedData.email);
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Création de l'utilisateur avec mot de passe en clair
    const newUser = await User.create({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: validatedData.password, // Pas de hashage
      role: validatedData.role || 'utilisateur'
    });

    console.log('Utilisateur créé avec:', {
      email: newUser.email,
      password: newUser.password // Pour le debug uniquement
    });

    const { password, ...userWithoutPassword } = newUser.toObject();
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 