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

output "dns_validation_records" {
  description = "Registros CNAME requeridos en tu DNS (GoDaddy, Namecheap, etc.) para validar el certificado SSL de ACM"
  value = var.domain_name != "" ? [
    for dvo in aws_acm_certificate.cert[0].domain_validation_options : {
      name  = dvo.domain_name
      type  = dvo.resource_record_type
      cname = dvo.resource_record_name
      value = dvo.resource_record_value
    }
  ] : []
}
