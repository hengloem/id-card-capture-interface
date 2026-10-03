import { supabase } from '../lib/supabase';

export async function uploadImage(file: Blob, filename: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('id-cards')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('id-cards')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function saveIDCardCapture(
  frontUrl: string,
  backUrl: string,
  ownerUrl: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('id_card_captures')
      .insert({
        front_image_url: frontUrl,
        back_image_url: backUrl,
        owner_image_url: ownerUrl,
        metadata: {
          captured_at: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      })
      .select()
      .maybeSingle();

    if (error) throw error;

    return data?.id || null;
  } catch (error) {
    console.error('Error saving ID card capture:', error);
    return null;
  }
}

export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
