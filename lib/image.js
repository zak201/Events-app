export const imageLoader = ({ src, width, quality = 75 }) => {
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;

  const transformations = [
    `w_${width}`,
    `q_${quality}`,
    'f_auto',
    'c_limit',
    'dpr_auto'
  ];

  return `https://res.cloudinary.com/${
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }/image/upload/${transformations.join(',')}/${src}`;
};

export const imagePlaceholder = (width = 10) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${width}'%3E%3C/svg%3E`;
}; 