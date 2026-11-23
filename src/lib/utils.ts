import { Linking, Platform } from 'react-native';

/**
 * Abre una URL en una pestaña nueva o en el navegador del sistema
 */
export async function openExternalLink(url: string): Promise<void> {
  if (!url) return;
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    }
  } catch (error) {
    console.warn(`No se pudo abrir el enlace: ${url}`, error);
  }
}

/**
 * Trunca un texto a una longitud máxima agregando elipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Formatea una fecha ISO o estándar en formato legible en español
 */
export function formatDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calcula el tiempo estimado de lectura en base al contenido
 */
export function calculateReadingTime(text: string | string[]): string {
  const content = Array.isArray(text) ? text.join(' ') : text;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min de lectura`;
}
