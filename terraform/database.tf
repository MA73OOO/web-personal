# ==============================================================================
# BASE DE DATOS (AWS RDS PostgreSQL)
# ==============================================================================

# Generador de contraseña aleatoria segura para la BD
resource "random_password" "db_password" {
  length  = 16
  special = false
}

# Obtener la VPC por defecto
data "aws_vpc" "default" {
  default = true
}

# Obtener las subredes por defecto de la VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Grupo de seguridad de la base de datos (PostgreSQL puerto 5432)
resource "aws_security_group" "db_sg" {
  name        = "${var.project_name}-db-sg"
  description = "Permitir acceso a PostgreSQL"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Abierto para permitir migraciones locales y Lambdas
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Grupo de subredes RDS
resource "aws_db_subnet_group" "db_subnet" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids
}

# Instancia de base de datos RDS PostgreSQL (Capa gratuita db.t4g.micro)
resource "aws_db_instance" "postgres" {
  identifier             = "${var.project_name}-db"
  allocated_storage      = 20
  max_allocated_storage  = 100
  storage_type           = "gp3"
  engine                 = "postgres"
  engine_version         = "16.3"
  instance_class         = "db.t4g.micro" # Capa gratuita elegible
  db_name                = "ma73ohubdb"
  username               = "postgres"
  password               = random_password.db_password.result
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  publicly_accessible    = true # Para simplificar las migraciones desde tu entorno local
  skip_final_snapshot    = true
}
