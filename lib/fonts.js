import { Font } from '@react-pdf/renderer';

export function registerPDFFonts() {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: '/fonts/Inter-Regular.ttf' },
      { src: '/fonts/Inter-Medium.ttf', fontWeight: 500 },
      { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
    ]
  });
} 