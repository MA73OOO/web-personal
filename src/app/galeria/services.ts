const API_BASE_URL = "https://7jddb01yw9.execute-api.us-east-1.amazonaws.com";

export interface PhotoType {
  id: string;
  title: string;
  url: string;
  year: string;
  date: string;
  category: string;
  location: string;
  aspectRatio: string;
  createdAt?: string;
  updatedAt?: string;
}

// Obtener todas las fotos dinámicamente desde AWS RDS a través del API Gateway
export async function fetchPhotos(): Promise<PhotoType[]> {
  const res = await fetch(`${API_BASE_URL}/photos`);
  if (!res.ok) {
    throw new Error("No se pudo obtener el listado de fotos de la API.");
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Respuesta inválida de la API.");
  }
  return data;
}
