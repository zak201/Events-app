export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'upload');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Erreur upload:', error);
    throw new Error('Erreur lors de l\'upload de l\'image');
  }
} 