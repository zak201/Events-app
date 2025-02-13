import { NextResponse } from 'next/server';

// Fonction améliorée pour convertir les liens Dropbox
function convertDropboxUrl(url) {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('dropbox.com')) {
      // Gérer les différents formats de liens Dropbox
      let directUrl = url;
      
      // Remplacer 'www.dropbox.com/s/' par 'dl.dropboxusercontent.com/s/'
      if (directUrl.includes('www.dropbox.com/s/')) {
        directUrl = directUrl.replace('www.dropbox.com/s/', 'dl.dropboxusercontent.com/s/');
      }
      
      // Remplacer 'www.dropbox.com/scl/' par 'dl.dropboxusercontent.com/scl/'
      if (directUrl.includes('www.dropbox.com/scl/')) {
        directUrl = directUrl.replace('www.dropbox.com/scl/', 'dl.dropboxusercontent.com/scl/');
      }

      // Supprimer tous les paramètres existants
      directUrl = directUrl.split('?')[0];
      
      // Ajouter raw=1 pour forcer le téléchargement direct
      return `${directUrl}?raw=1`;
    }
    return url;
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'URL:', error);
    return url;
  }
}

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    console.log('URL originale:', imageUrl);

    if (!imageUrl) {
      return NextResponse.json(
        { message: 'URL de l\'image manquante' },
        { status: 400 }
      );
    }

    // Convertir l'URL
    const directUrl = convertDropboxUrl(imageUrl);
    console.log('URL convertie:', directUrl);

    // Vérifier l'accessibilité avec des en-têtes personnalisés
    const response = await fetch(directUrl, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0', // Simuler un navigateur
        'Referer': 'https://www.dropbox.com'
      }
    });

    if (!response.ok) {
      console.error('Erreur de réponse:', response.status, response.statusText);
      throw new Error(`Erreur d'accès à l'image (${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    console.log('Type de contenu:', contentType);

    if (!contentType || !contentType.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Le fichier n\'est pas une image valide' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image valide',
      details: {
        contentType,
        url: directUrl
      }
    });

  } catch (error) {
    console.error('Erreur complète:', error);
    return NextResponse.json(
      { 
        message: 'Erreur lors de la validation de l\'image',
        error: error.message,
        details: 'Assurez-vous que le lien Dropbox est public et partageable'
      },
      { status: 500 }
    );
  }
} 