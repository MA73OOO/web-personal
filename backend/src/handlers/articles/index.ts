import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prisma } from "../../utils/prisma";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return await handleGet(event, headers);
      case "POST":
        return await handlePost(event, headers);
      case "PUT":
        return await handlePut(event, headers);
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
    console.error("Error en handler de Articles:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

// 1. Obtener artículos (Todos o uno por id/slug)
async function handleGet(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;
  const slug = event.queryStringParameters?.slug;

  // Obtener un artículo por ID
  if (id) {
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Artículo no encontrado." }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(article) };
  }

  // Obtener un artículo por Slug
  if (slug) {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Artículo no encontrado." }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(article) };
  }

  // Obtener todos los artículos (si no es admin, podríamos filtrar solo los publicados)
  const isAdmin = event.queryStringParameters?.admin === "true";
  const articles = await prisma.article.findMany({
    where: isAdmin ? {} : { published: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(articles),
  };
}

// 2. Crear un nuevo artículo
async function handlePost(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el cuerpo." }) };
  }

  const { title, subtitle, content, slug, category, published } = JSON.parse(event.body);

  if (!title || !content || !slug || !category) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Título, contenido, slug y categoría son obligatorios." }),
    };
  }

  const article = await prisma.article.create({
    data: {
      title,
      subtitle: subtitle || "",
      content,
      slug,
      category,
      published: !!published,
      publishedAt: published ? new Date() : null,
    },
  });

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ success: true, article }),
  };
}

// 3. Modificar un artículo existente por ID
async function handlePut(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el ID del artículo." }) };
  }

  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el cuerpo." }) };
  }

  const { title, subtitle, content, slug, category, published } = JSON.parse(event.body);

  // Obtener estado anterior del artículo
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) {
    return { statusCode: 404, headers, body: JSON.stringify({ error: "Artículo no encontrado." }) };
  }

  // Determinar fecha de publicación
  let publishedAt = existing.publishedAt;
  if (published && !existing.published) {
    publishedAt = new Date(); // Si cambia a publicado ahora
  } else if (!published) {
    publishedAt = null; // Si se despublica
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      title,
      subtitle,
      content,
      slug,
      category,
      published,
      publishedAt,
    },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, article }),
  };
}

// 4. Eliminar un artículo por ID
async function handleDelete(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el ID del artículo." }) };
  }

  await prisma.article.delete({ where: { id } });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, message: "Artículo eliminado con éxito." }),
  };
}
