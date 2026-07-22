variable "aws_region" {
  description = "Región de AWS donde se aprovisionará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "Perfil de credenciales de AWS CLI a utilizar"
  type        = string
  default     = "default"
}


variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "web-personal"
}

variable "environment" {
  description = "Entorno de despliegue (prod, dev, staging)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Nombre de dominio personalizado (opcional)"
  type        = string
  default     = ""
}
