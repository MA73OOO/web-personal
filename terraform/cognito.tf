# ==============================================================================
# AWS COGNITO (Autenticación y Control de Usuarios Administradores)
# ==============================================================================

resource "aws_cognito_user_pool" "user_pool" {
  name = "${var.project_name}-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  mfa_configuration = "ON"

  email_mfa_configuration {
    message = "Tu codigo de verificacion de 2 pasos es {####}"
    subject = "Codigo de Seguridad - MA73O Hub"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "admin_only"
      priority = 1
    }
  }

  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = "henaorangelmateo@gmail.com"
    source_arn            = aws_ses_email_identity.admin_email.arn
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "name"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "${var.project_name}-user-pool-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  generate_secret = false
}

# Creación del usuario administrador por defecto
resource "aws_cognito_user" "admin" {
  user_pool_id = aws_cognito_user_pool.user_pool.id
  username     = "henaorangelmateo@gmail.com"

  attributes = {
    email          = "henaorangelmateo@gmail.com"
    email_verified = "true"
    name           = "Mateo Henao Rangel"
  }

  # Contraseña inicial permanente para evitar el FORCE_CHANGE_PASSWORD
  password = "AdminPassword123!"
}

# Identidad de SES para verificar el remitente
resource "aws_ses_email_identity" "admin_email" {
  email = "henaorangelmateo@gmail.com"
}
