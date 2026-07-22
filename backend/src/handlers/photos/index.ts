import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Content-Type": "application/json",
  };

  // Preflight OPTIONS para CORS
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

  // Generar un nombre único de archivo para evitar colisiones en S3
  const fileExtension = filename.split(".").pop();
  const s3Key = `photos/${randomUUID()}.${fileExtension}`;

  // Crear comando de subida a S3
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    ContentType: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
  });

  // Generar URL pre-firmada válida por 5 minutos (300 segundos)
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  // Construir la URL pública definitiva del archivo usando CloudFront si está configurado, o S3 directo
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const filePublicUrl = cloudfrontDomain
    ? `https://${cloudfrontDomain}/media/${s3Key}`
    : `https://${bucketName}.s3.amazonaws.com/${s3Key}`;

  // Guardar los metadatos en la base de datos PostgreSQL
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
      uploadUrl, // La URL donde el cliente de Next.js enviará el archivo con un método PUT
      photo,     // El registro creado en base de datos
    }),
  };
}

// 3. Eliminar una foto por ID
async function handleDelete(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Falta el ID de la foto a eliminar." }),
    };
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
