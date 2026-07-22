# ==============================================================================
# ENTORNO S3 & CLOUDFRONT (Alojamiento Estático y CDN)
# ==============================================================================

# Generador de sufijo único para nombres globales de S3
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# 1. Bucket S3 para Sitio Web Estático (Next.js out/)
resource "aws_s3_bucket" "website_bucket" {
  bucket        = "${var.project_name}-site-${random_id.bucket_suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "website_public_block" {
  bucket                  = aws_s3_bucket.website_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 2. Bucket S3 para Multimedia (Fotografías y Audio MP3)
resource "aws_s3_bucket" "media_bucket" {
  bucket        = "${var.project_name}-media-${random_id.bucket_suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_cors_configuration" "media_cors" {
  bucket = aws_s3_bucket.media_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_public_access_block" "media_public_block" {
  bucket                  = aws_s3_bucket.media_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. Origin Access Control (OAC) para CloudFront
resource "aws_cloudfront_origin_access_control" "site_oac" {
  name                              = "${var.project_name}-site-oac"
  description                       = "Acceso seguro de CloudFront a S3 Sitio Web"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "media_oac" {
  name                              = "${var.project_name}-media-oac"
  description                       = "Acceso seguro de CloudFront a S3 Media"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 4. Distribución de CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "CDN para ${var.project_name} (${var.environment})"
  aliases             = var.domain_name != "" ? [var.domain_name, "www.${var.domain_name}"] : []

  # Origen 1: Sitio Web Estático (Next.js)
  origin {
    domain_name              = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id                = "S3-Website-Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.site_oac.id
  }

  # Origen 2: Archivos Multimedia (Fotos / Audio)
  origin {
    domain_name              = aws_s3_bucket.media_bucket.bucket_regional_domain_name
    origin_id                = "S3-Media-Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.media_oac.id
  }

  # Comportamiento predeterminado (Sitio Web)
  default_cache_behavior {
    target_origin_id       = "S3-Website-Origin"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Comportamiento para assets multimedia (/media/*)
  ordered_cache_behavior {
    path_pattern           = "/media/*"
    target_origin_id       = "S3-Media-Origin"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 604800
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
      cookies {
        forward = "none"
      }
    }
  }

  # Configuración de respuestas de error para Next.js App Router (SPA routing fallback)
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.domain_name == "" ? true : false
    acm_certificate_arn            = var.domain_name != "" ? aws_acm_certificate_validation.cert_validation[0].certificate_arn : null
    ssl_support_method             = var.domain_name != "" ? "sni-only" : null
    minimum_protocol_version       = var.domain_name != "" ? "TLSv1.2_2021" : "TLSv1"
  }
}

# 5. Políticas de Acceso en S3 para CloudFront OAC
resource "aws_s3_bucket_policy" "website_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.website_s3_policy.json
}

data "aws_iam_policy_document" "website_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "media_policy" {
  bucket = aws_s3_bucket.media_bucket.id
  policy = data.aws_iam_policy_document.media_s3_policy.json
}

data "aws_iam_policy_document" "media_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.media_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

# 6. Certificado SSL/TLS en ACM (solo si domain_name no está vacío)
resource "aws_acm_certificate" "cert" {
  count             = var.domain_name != "" ? 1 : 0
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain_name}"
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "cert_validation" {
  count           = var.domain_name != "" ? 1 : 0
  certificate_arn = aws_acm_certificate.cert[0].arn
}
