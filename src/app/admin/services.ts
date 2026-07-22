const API_BASE_URL = "https://7jddb01yw9.execute-api.us-east-1.amazonaws.com";

// 1. Iniciar sesión con AWS Cognito
export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Credenciales inválidas.");
  return data; // Retorna { success, idToken, accessToken, refreshToken }
}

// 2. Registrar metadatos de la foto y subir el archivo binario a S3 (vía Presigned URL)
export async function uploadPhoto(
  token: string,
  photoForm: {
    title: string;
    category: string;
    location: string;
    aspectRatio: string;
    year: string;
    date: string;
  },
  file: File
) {
  // A. Obtener la S3 Presigned URL de la Lambda
  const res = await fetch(`${API_BASE_URL}/photos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...photoForm,
      filename: file.name,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo obtener la URL de subida.");

  const { uploadUrl, photo } = data;

  // B. Subir el archivo binario de la imagen directamente a S3
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Falló la carga de la imagen física a S3.");

  return photo; // Retorna el registro creado en PostgreSQL
}

// 3. Crear y publicar un nuevo artículo
export async function createArticle(
  token: string,
  articleForm: {
    title: string;
    subtitle: string;
    slug: string;
    content: string;
    category: string;
    published: boolean;
  }
) {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(articleForm),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear el artículo.");
  return data.article;
}

// 4. Agregar una nueva playlist de Spotify
export async function createTrack(
  token: string,
  trackForm: {
    id: string;
    title: string;
    description: string;
    url: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(trackForm),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al añadir la playlist.");
  return data.track;
}
