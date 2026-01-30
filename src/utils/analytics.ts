/**
 * Configuration Google Analytics 4
 * 
 * ID GA4 : G-6HJ43DJWRQ
 * Trouvé dans : Google Analytics > Admin > Data Streams > Web Stream
 */
export const GA4_MEASUREMENT_ID = import.meta.env.PUBLIC_GA4_ID || 'G-6HJ43DJWRQ';

/**
 * Active/désactive GA4 selon l'environnement
 * Désactivé en développement local par défaut
 * Activé automatiquement en production si l'ID est valide
 */
export const GA4_ENABLED = import.meta.env.PROD && GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID.startsWith('G-');
