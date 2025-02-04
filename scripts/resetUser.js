// Supprimer l'utilisateur existant et en créer un nouveau
const testUser = {
  name: "Test User",
  email: "z.anouar832@gmail.com",
  password: "test123", // Mot de passe simple pour le test
  role: "utilisateur"
};

fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testUser)
})
.then(r => r.json())
.then(console.log)
.catch(console.error); 