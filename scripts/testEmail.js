fetch('/api/test-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Réponse:', data);
})
.catch(error => {
  console.error('Erreur:', error);
}); 