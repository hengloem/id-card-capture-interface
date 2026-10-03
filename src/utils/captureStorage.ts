const STORAGE_KEY = 'id_card_captures';

export interface StoredCapture {
  id: string;
  front_image: string;
  back_image: string;
  owner_image: string;
  captured_at: string;
}

export function saveCapture(
  frontImage: string,
  backImage: string,
  ownerImage: string
): string {
  const id = generateId();
  const capture: StoredCapture = {
    id,
    front_image: frontImage,
    back_image: backImage,
    owner_image: ownerImage,
    captured_at: new Date().toISOString(),
  };

  const existing = getCaptures();
  const updated = [capture, ...existing];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return id;
  } catch (error) {
    console.error('Failed to save capture to localStorage:', error);
    throw error;
  }
}

export function getCaptures(): StoredCapture[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCapture[]) : [];
  } catch {
    return [];
  }
}

export function deleteCapture(id: string): void {
  const existing = getCaptures().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function clearAllCaptures(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
