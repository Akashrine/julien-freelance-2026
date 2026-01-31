#!/usr/bin/env node

/**
 * Script pour générer les images WebP Open Graph
 * 
 * Usage:
 *   node scripts/generate-og-images.js [input-file] [output-name]
 *   node scripts/generate-og-images.js --all (convertit tous les PNG dans public/)
 * 
 * Requiert: cwebp (installé via Homebrew sur macOS)
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');

/**
 * Vérifie si cwebp est disponible
 */
function checkCwebp() {
  try {
    execSync('which cwebp', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Convertit une image PNG en WebP
 * @param {string} inputPath - Chemin vers le fichier PNG
 * @param {string} outputPath - Chemin vers le fichier WebP de sortie
 * @param {number} quality - Qualité WebP (0-100, défaut: 90)
 */
function convertToWebP(inputPath, outputPath, quality = 90) {
  if (!existsSync(inputPath)) {
    console.error(`❌ Fichier introuvable: ${inputPath}`);
    process.exit(1);
  }

  try {
    execSync(`cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`, {
      stdio: 'inherit',
    });
    console.log(`✅ Converti: ${basename(inputPath)} → ${basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Erreur lors de la conversion: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Convertit tous les PNG dans public/ en WebP (sauf ceux déjà convertis)
 */
function convertAllPNGs() {
  const files = readdirSync(publicDir);
  const pngFiles = files.filter(
    (file) => extname(file).toLowerCase() === '.png' && file.startsWith('og-')
  );

  if (pngFiles.length === 0) {
    console.log('ℹ️  Aucun fichier PNG Open Graph trouvé dans public/');
    return;
  }

  console.log(`📦 Trouvé ${pngFiles.length} fichier(s) PNG Open Graph\n`);

  pngFiles.forEach((pngFile) => {
    const inputPath = join(publicDir, pngFile);
    const webpName = pngFile.replace(/\.png$/i, '.webp');
    const outputPath = join(publicDir, webpName);

    // Skip si le WebP existe déjà et est plus récent
    if (existsSync(outputPath)) {
      const pngStat = statSync(inputPath);
      const webpStat = statSync(outputPath);
      if (webpStat.mtime >= pngStat.mtime) {
        console.log(`⏭️  Ignoré (déjà à jour): ${webpName}`);
        return;
      }
    }

    convertToWebP(inputPath, outputPath);
  });
}

/**
 * Convertit un fichier spécifique
 */
function convertSingle(inputFile, outputName) {
  const inputPath = inputFile.startsWith('/')
    ? inputFile
    : join(publicDir, inputFile);

  if (!existsSync(inputPath)) {
    console.error(`❌ Fichier introuvable: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = outputName
    ? join(publicDir, outputName.endsWith('.webp') ? outputName : `${outputName}.webp`)
    : join(publicDir, basename(inputPath, extname(inputPath)) + '.webp');

  convertToWebP(inputPath, outputPath);
}

// Main
const args = process.argv.slice(2);

if (!checkCwebp()) {
  console.error('❌ cwebp n\'est pas installé.');
  console.error('   Installez-le avec: brew install webp');
  process.exit(1);
}

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
Usage:
  node scripts/generate-og-images.js [input-file] [output-name]
  node scripts/generate-og-images.js --all

Exemples:
  node scripts/generate-og-images.js --all
  node scripts/generate-og-images.js og-approche.png og-approche.webp
  node scripts/generate-og-images.js /path/to/image.png og-custom.webp
`);
  process.exit(0);
}

if (args[0] === '--all') {
  convertAllPNGs();
} else if (args.length >= 1) {
  convertSingle(args[0], args[1]);
} else {
  console.error('❌ Arguments invalides. Utilisez --help pour voir l\'aide.');
  process.exit(1);
}
