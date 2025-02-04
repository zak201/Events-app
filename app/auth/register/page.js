import RegisterForm from '@/components/RegisterForm';

export const metadata = {
  title: 'Inscription | Event Booking',
  description: 'Créez votre compte Event Booking',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Rejoignez Event Booking dès maintenant
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
} 