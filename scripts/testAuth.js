// Test de l'utilisateur existant
console.log('Test de l\'utilisateur existant...');

// 1. Vérifier l'utilisateur dans la base
fetch('/api/auth/debug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'z.anouar832@gmail.com' })
})
.then(r => r.json())
.then(user => {
  console.log('Utilisateur en base:', user);
  
  // 2. Tester la connexion
  return fetch('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'z.anouar832@gmail.com',
      password: '123456789',
      redirect: false,
    })
  });
})
.then(r => r.json())
.then(result => {
  console.log('Résultat de la connexion:', result);
})
.catch(error => {
  console.error('Erreur:', error);
}); 