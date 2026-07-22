# Lista de Tareas — Refactorización e Infraestructura Serverless

- [x] Crear archivos Terraform individuales para la separación de responsabilidades
  - [x] Crear `s3_cloudfront.tf` y mover código
  - [x] Crear `cognito.tf` y mover código
  - [x] Crear `database.tf` y mover código
  - [x] Actualizar `main.tf` quitando bloques redundantes
- [x] Crear `lambdas.tf` con la infraestructura de AWS Lambda
- [x] Crear `api_gateway.tf` con la infraestructura de API Gateway
- [x] Actualizar `outputs.tf` para añadir el endpoint de la API
- [x] Implementar Panel de Administración (`src/app/admin/page.tsx`)
- [x] Conectar fotos dinámicas de la base de datos en el frontend (`src/app/galeria/page.tsx`)
- [x] Implementar Opción 1: Playlists de Spotify dinámicas en la radio (`src/context/RadioContext.tsx` y `src/components/RadioPlayer.tsx`)
- [/] Compilar y desplegar
  - [x] Compilar localmente las Lambdas en `/backend` (`pnpm build` inicial)
  - [x] Ejecutar `terraform apply` (Despliegue inicial exitoso)
  - [ ] Correr la nueva migración de base de datos en `/backend`
  - [ ] Re-compilar las Lambdas con la nueva lógica de Spotify
  - [ ] Ejecutar `terraform apply` (Actualización de código de Lambdas en AWS)
  - [ ] Validar funcionamiento general
