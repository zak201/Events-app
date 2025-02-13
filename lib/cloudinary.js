export function getOptimizedImageUrl(url, options = {}) {
  if (!url || !url.includes('cloudinary')) return url;

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    effect = 'auto',
  } = options;

  const transformations = [
    'f_' + format,
    'q_' + quality,
  ];

  if (width) transformations.push('w_' + width);
  if (height) transformations.push('h_' + height);
  if (effect !== 'auto') transformations.push('e_' + effect);

  // Ajouter l'optimisation automatique
  transformations.push('c_limit');
  transformations.push('dpr_auto');

  return url.replace(
    '/upload/',
    '/upload/' + transformations.join(',') + '/'
  );
}

export function generateBlurDataUrl(url) {
  return getOptimizedImageUrl(url, {
    width: 10,
    quality: 20,
    effect: 'blur:1000'
  });
} 