output "cloudfront_domain_name" {
  description = "Dominio público de la CDN de CloudFront"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_distribution_id" {
  description = "ID de la distribución CloudFront para invalidación de caché"
  value       = aws_cloudfront_distribution.cdn.id
}

output "website_bucket_name" {
  description = "Nombre del bucket S3 de alojamiento del sitio"
  value       = aws_s3_bucket.website_bucket.bucket
}

output "media_bucket_name" {
  description = "Nombre del bucket S3 multimedia para subir fotos y audios"
  value       = aws_s3_bucket.media_bucket.bucket
}
