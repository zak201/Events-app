const fs = require('fs');
const path = require('path');
const https = require('https');

const FONTS = [
  {
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    filename: 'Inter-Regular.ttf'
  },
  {
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7.woff2',
    filename: 'Inter-Medium.ttf'
  },
  {
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7.woff2',
    filename: 'Inter-Bold.ttf'
  }
];

const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts');

async function downloadFont(url, filename) {
  const filepath = path.join(FONTS_DIR, filename);
  
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function setup() {
  try {
    console.log('📦 Téléchargement des polices...');
    
    for (const font of FONTS) {
      console.log(`Téléchargement de ${font.filename}...`);
      await downloadFont(font.url, font.filename);
    }
    
    console.log('✅ Polices téléchargées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du téléchargement des polices:', error);
    process.exit(1);
  }
}

setup(); 