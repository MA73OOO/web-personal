import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prisma } from "../../utils/prisma";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return await handleGet(headers);
      case "POST":
        return await handlePost(event, headers);
      case "DELETE":
        return await handleDelete(event, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Método no permitido." }),
        };
    }
  } catch (error: any) {
    console.error("Error en handler de Tracks:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

// 1. Obtener todas las canciones de la radio
async function handleGet(headers: Record<string, string>): Promise<APIGatewayProxyResult> {
  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(tracks),
  };
}

// 2. Agregar una nueva canción
async function handlePost(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el cuerpo." }) };
  }

  const { title, artist, album, url, cover } = JSON.parse(event.body);

  if (!title || !artist || !url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Título, artista y URL del archivo mp3 son obligatorios." }),
    };
  }

  const track = await prisma.track.create({
    data: {
      title,
      artist,
      album: album || "Single",
      url,
      cover: cover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
    },
  });

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ success: true, track }),
  };
}

// 3. Eliminar una canción por ID
async function handleDelete(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el ID de la canción." }) };
  }

  await prisma.track.delete({ where: { id } });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, message: "Canción eliminada de la radio." }),
  };
}
