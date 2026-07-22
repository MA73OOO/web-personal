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

// 1b. Verificar código de doble factor (MFA) enviado al correo
export async function verifyMfaCode(email: string, code: string, session: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify_mfa", email, code, session }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Código de doble factor inválido.");
  return data;
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

  const { uploadUrl, contentType, photo } = data;

  // B. Subir el archivo binario de la imagen directamente a S3
  // IMPORTANTE: el Content-Type del PUT debe coincidir EXACTAMENTE con el
  // Content-Type usado para firmar la presigned URL, o S3 ignora el tipo
  // y guarda el objeto como application/octet-stream (causando ERR_BLOCKED_BY_ORB)
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Falló la carga de la imagen física a S3.");

  return photo; // Retorna el registro creado en PostgreSQL
}

// 2b. Obtener todas las fotos
export async function fetchPhotos() {
  const res = await fetch(`${API_BASE_URL}/photos`);
  if (!res.ok) throw new Error("Error al obtener la lista de fotografías.");
  return await res.json();
}

// 2c. Actualizar metadatos de una foto
export async function updatePhoto(
  token: string,
  id: string,
  data: {
    title?: string;
    category?: string;
    location?: string;
    aspectRatio?: string;
    year?: string;
    date?: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || "Error al actualizar la foto.");
  return resData.photo;
}

// 2d. Eliminar una foto por ID
export async function deletePhoto(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar la foto.");
  return data;
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

// 3b. Obtener todos los artículos (incluyendo no publicados)
export async function fetchArticles() {
  const res = await fetch(`${API_BASE_URL}/articles?admin=true`);
  if (!res.ok) throw new Error("Error al cargar la lista de artículos.");
  return await res.json();
}

// 3c. Actualizar un artículo existente
export async function updateArticle(
  token: string,
  id: string,
  articleForm: {
    title?: string;
    subtitle?: string;
    slug?: string;
    content?: string;
    category?: string;
    published?: boolean;
  }
) {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(articleForm),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar el artículo.");
  return data.article;
}

// 3d. Eliminar un artículo por ID
export async function deleteArticle(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar el artículo.");
  return data;
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

// 4b. Obtener todas las playlists de la radio
export async function fetchTracks() {
  const res = await fetch(`${API_BASE_URL}/tracks`);
  if (!res.ok) throw new Error("Error al obtener las playlists.");
  return await res.json();
}

// 4c. Actualizar una playlist
export async function updateTrack(
  token: string,
  id: string,
  trackForm: {
    title?: string;
    description?: string;
    url?: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/tracks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(trackForm),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar la playlist.");
  return data.track;
}

// 4d. Eliminar una playlist por ID de Spotify
export async function deleteTrack(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/tracks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar la playlist.");
  return data;
}
