function generateFileName(originalName) {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${timestamp}-image.${extension}`;
} 