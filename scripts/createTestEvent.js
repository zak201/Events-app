const event = {
  title: "Événement test",
  date: new Date().toISOString(),
  location: "Paris",
  description: "Description de l'événement test",
  imageUrl: "https://res.cloudinary.com/dljkmnliw/image/upload/v1/events/default",
  capacity: 100
};

fetch('/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(event),
})
.then(response => response.json())
.then(data => console.log('Événement créé:', data))
.catch(error => console.error('Erreur:', error)); 