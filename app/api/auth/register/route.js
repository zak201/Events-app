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

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    console.log('Mot de passe haché créé');

    // Création de l'utilisateur
    const newUser = {
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      role: validatedData.role
    };

    console.log('Création de l\'utilisateur avec:', {
      ...newUser,
      password: '[HIDDEN]'
    });

    const user = await User.create(newUser);
    console.log('Utilisateur créé avec ID:', user._id);

    // Ne pas renvoyer le mot de passe
    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 