import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProfileForm from '@/components/ProfileForm';

export const metadata = {
  title: 'Profil | Event Booking',
  description: 'Gérez votre profil',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <ProfileForm user={session.user} />
    </div>
  );
} 