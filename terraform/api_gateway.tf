# ==============================================================================
# AWS API GATEWAY (Punto de Entrada HTTP para los Microservicios/Lambdas)
# ==============================================================================

# 1. Crear el API Gateway de tipo HTTP (más rápido y económico que REST)
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"] # Ajustar a tu dominio de producción si es necesario
    allow_headers = ["Content-Type", "Authorization"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    max_age       = 300
  }
}

# 2. Configurar la etapa (Stage) por defecto
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# 3. Integraciones de API Gateway con cada Lambda
resource "aws_apigatewayv2_integration" "login" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.login.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "photos" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.photos.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "articles" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.articles.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "tracks" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.tracks.arn
  payload_format_version = "2.0"
}

# 4. Definición de Rutas

# Ruta 1: Login
resource "aws_apigatewayv2_route" "login_post" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /auth/login"
  target    = "integrations/${aws_apigatewayv2_integration.login.id}"
}

# Rutas 2: Gestión de Fotos
resource "aws_apigatewayv2_route" "photos_get" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /photos"
  target    = "integrations/${aws_apigatewayv2_integration.photos.id}"
}

resource "aws_apigatewayv2_route" "photos_post" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /photos"
  target    = "integrations/${aws_apigatewayv2_integration.photos.id}"
}

resource "aws_apigatewayv2_route" "photos_delete" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "DELETE /photos/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.photos.id}"
}

# Rutas 3: Gestión de Artículos
resource "aws_apigatewayv2_route" "articles_get" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /articles"
  target    = "integrations/${aws_apigatewayv2_integration.articles.id}"
}

resource "aws_apigatewayv2_route" "articles_get_id" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /articles/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.articles.id}"
}

resource "aws_apigatewayv2_route" "articles_post" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /articles"
  target    = "integrations/${aws_apigatewayv2_integration.articles.id}"
}

resource "aws_apigatewayv2_route" "articles_put" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "PUT /articles/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.articles.id}"
}

resource "aws_apigatewayv2_route" "articles_delete" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "DELETE /articles/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.articles.id}"
}

# Rutas 4: Gestión de Canciones (Radio)
resource "aws_apigatewayv2_route" "tracks_get" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /tracks"
  target    = "integrations/${aws_apigatewayv2_integration.tracks.id}"
}

resource "aws_apigatewayv2_route" "tracks_post" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /tracks"
  target    = "integrations/${aws_apigatewayv2_integration.tracks.id}"
}

resource "aws_apigatewayv2_route" "tracks_delete" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "DELETE /tracks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.tracks.id}"
}

# 5. Permisos para que API Gateway pueda invocar cada Lambda

resource "aws_lambda_permission" "api_gw_login" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.login.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_photos" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.photos.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_articles" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.articles.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_tracks" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tracks.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}
