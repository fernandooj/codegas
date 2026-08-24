import { NativeModules, Platform, Share } from 'react-native';

/**
 * Comparte un PDF como archivo. En Android, Share.share() solo envía texto
 * (ignora `url`); usamos un módulo nativo ACTION_SEND + FileProvider.
 */
export async function sharePdfFile({ path, title, mime = 'application/pdf' }) {
  const clean = String(path || '').replace(/^file:\/\//, '');
  if (!clean) {
    throw new Error('No hay archivo PDF para compartir');
  }

  if (Platform.OS === 'android' && NativeModules.ShareFile?.share) {
    await NativeModules.ShareFile.share(clean, mime, title || 'PDF');
    return;
  }

  const url = Platform.OS === 'android' ? `file://${clean}` : clean;
  await Share.share({
    title: title || 'PDF',
    url
  });
}
