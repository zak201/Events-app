export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
      <p className="text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
} 