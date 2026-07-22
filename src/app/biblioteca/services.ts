const API_BASE_URL = "https://7jddb01yw9.execute-api.us-east-1.amazonaws.com";

export interface ArticleType {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Obtener la lista de artículos publicados desde PostgreSQL vía Lambda API
export async function fetchArticles(): Promise<ArticleType[]> {
  const res = await fetch(`${API_BASE_URL}/articles`);
  if (!res.ok) {
    throw new Error("No se pudieron cargar los artículos de la biblioteca.");
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Respuesta inválida al cargar los artículos.");
  }
  // Filtrar solo los publicados por seguridad en el cliente
  return data.filter((art: ArticleType) => art.published);
}
