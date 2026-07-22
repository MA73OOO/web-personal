import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "../../utils/prisma";
import { randomUUID } from "crypto";

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
  };

  const method = (event as any).requestContext?.http?.method || event.httpMethod;

  if (method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    switch (method) {
      case "GET":
        return await handleGet(headers);
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
    console.error("Error en handler de Photos:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

// 1. Obtener todas las fotos
async function handleGet(headers: Record<string, string>): Promise<APIGatewayProxyResult> {
  const photos = await prisma.photo.findMany({
    orderBy: { date: "desc" },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(photos),
  };
}

// 2. Generar S3 Presigned URL + Guardar registro preliminar en DB
async function handlePost(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Falta el cuerpo de la petición." }),
    };
  }

  const { title, filename, category, location, aspectRatio, year, date } = JSON.parse(event.body);

  if (!title || !filename || !category || !location || !aspectRatio || !year || !date) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Faltan campos obligatorios." }),
    };
  }

  const bucketName = process.env.MEDIA_BUCKET_NAME;
  if (!bucketName) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: "Falta configurar MEDIA_BUCKET_NAME." }),
    };
  }

  const fileExtension = filename.split(".").pop();
  const s3Key = `media/photos/${randomUUID()}.${fileExtension}`;
  const contentType = fileExtension === "jpg" ? "image/jpeg" : `image/${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const filePublicUrl = cloudfrontDomain
    ? `https://${cloudfrontDomain}/${s3Key}`
    : `https://${bucketName}.s3.amazonaws.com/${s3Key}`;

  const photo = await prisma.photo.create({
    data: {
      title,
      url: filePublicUrl,
      year,
      date,
      category,
      location,
      aspectRatio,
    },
  });

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      success: true,
      uploadUrl,
      contentType,
      photo,
    }),
  };
}

// 3. Actualizar metadatos de una foto por ID (PUT /photos/{id})
async function handlePut(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id || event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Falta el ID de la foto a actualizar." }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Falta el cuerpo de la petición." }),
    };
  }

  const { title, category, location, aspectRatio, year, date } = JSON.parse(event.body);

  const updatedPhoto = await prisma.photo.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(category && { category }),
      ...(location && { location }),
      ...(aspectRatio && { aspectRatio }),
      ...(year && { year }),
      ...(date && { date }),
    },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, photo: updatedPhoto }),
  };
}

// 4. Eliminar una foto por ID (DB + borrado opcional en S3)
async function handleDelete(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id || event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Falta el ID de la foto a eliminar." }),
    };
  }

  // Intentar obtener la foto para borrar el objeto en S3 si existe
  try {
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (photo && photo.url && process.env.MEDIA_BUCKET_NAME) {
      // Extraer la clave S3 de la URL publica (ej: https://domain/media/photos/xyz.jpg -> media/photos/xyz.jpg)
      const urlParts = new URL(photo.url);
      const s3Key = urlParts.pathname.startsWith("/") ? urlParts.pathname.slice(1) : urlParts.pathname;

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.MEDIA_BUCKET_NAME,
          Key: s3Key,
        })
      );
    }
  } catch (err) {
    console.warn("No se pudo eliminar el archivo físico en S3:", err);
  }

  await prisma.photo.delete({
    where: { id },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, message: "Foto eliminada correctamente." }),
  };
}

