# ==============================================================================
# AWS LAMBDA (Servicios API Serverless en Node.js)
# ==============================================================================

# 1. Rol de Ejecución de IAM para las Lambdas
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Adjuntar política básica para logs de CloudWatch
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Política de acceso a S3 para subir y gestionar fotos en el bucket multimedia
resource "aws_iam_policy" "lambda_s3_policy" {
  name        = "${var.project_name}-lambda-s3-policy"
  description = "Permite a las Lambdas leer/escribir en el bucket multimedia"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.media_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_s3" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

# 2. Empaquetado en archivos .ZIP locales
data "archive_file" "login_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist/login"
  output_path = "${path.module}/dist/login.zip"
}

data "archive_file" "photos_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist/photos"
  output_path = "${path.module}/dist/photos.zip"
}

data "archive_file" "articles_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist/articles"
  output_path = "${path.module}/dist/articles.zip"
}

data "archive_file" "tracks_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist/tracks"
  output_path = "${path.module}/dist/tracks.zip"
}

# 3. Declaración de las Funciones Lambda

# Lambda 1: Login / Autenticación
resource "aws_lambda_function" "login" {
  filename         = data.archive_file.login_zip.output_path
  source_code_hash = data.archive_file.login_zip.output_base64sha256
  function_name    = "${var.project_name}-login"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 15

  environment {
    variables = {
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.user_pool_client.id
    }
  }
}

# Lambda 2: Gestión de Fotos (Galería)
resource "aws_lambda_function" "photos" {
  filename         = data.archive_file.photos_zip.output_path
  source_code_hash = data.archive_file.photos_zip.output_base64sha256
  function_name    = "${var.project_name}-photos"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30

  environment {
    variables = {
      DATABASE_URL      = "postgresql://postgres:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/ma73ohubdb?schema=public"
      MEDIA_BUCKET_NAME = aws_s3_bucket.media_bucket.bucket
      CLOUDFRONT_DOMAIN = aws_cloudfront_distribution.cdn.domain_name
    }
  }
}

# Lambda 3: Gestión de Artículos / Escritos
resource "aws_lambda_function" "articles" {
  filename         = data.archive_file.articles_zip.output_path
  source_code_hash = data.archive_file.articles_zip.output_base64sha256
  function_name    = "${var.project_name}-articles"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30

  environment {
    variables = {
      DATABASE_URL = "postgresql://postgres:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/ma73ohubdb?schema=public"
    }
  }
}

# Lambda 4: Gestión de Canciones (Radio)
resource "aws_lambda_function" "tracks" {
  filename         = data.archive_file.tracks_zip.output_path
  source_code_hash = data.archive_file.tracks_zip.output_base64sha256
  function_name    = "${var.project_name}-tracks"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30

  environment {
    variables = {
      DATABASE_URL = "postgresql://postgres:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/ma73ohubdb?schema=public"
    }
  }
}
