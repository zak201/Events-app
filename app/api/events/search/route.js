import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    await dbConnect();

    const searchRegex = new RegExp(query, 'i');
    const searchQuery = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ]
    };

    const [events, total] = await Promise.all([
      Event.find(searchQuery)
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(searchQuery)
    ]);

    return NextResponse.json({
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des événements' },
      { status: 500 }
    );
  }
} 