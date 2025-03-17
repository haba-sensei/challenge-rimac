# API RESTful - Reto Técnico Star Wars & API Meteorológica

## Descripción del Reto Técnico

Este reto consiste en desarrollar una API RESTful utilizando Node.js versión 20, implementada con TypeScript y desplegada en AWS Lambda mediante Serverless Framework. Los puntos clave del desafío son:

1. **Integración de APIs externas:**

   - Integrar dos APIs públicas distintas: la API de Star Wars (SWAPI) y una API pública adicional (por ejemplo, una API meteorológica).
   - Fusionar los datos obtenidos de ambas APIs en un modelo coherente. Por ejemplo, combinar información de personajes de Star Wars con datos meteorológicos basados en la ubicación de sus planetas.
   - Normalizar y procesar los datos, asegurando que todos los campos estén correctamente formateados (conversión de tipos, unidades de medida, etc.).

2. **Endpoints desarrollados:**

   - **GET /fusionados:** Consulta ambas APIs y devuelve los datos fusionados. La respuesta se almacena en una base de datos (DynamoDB o MySQL) para futuras consultas.
   - **POST /almacenar:** Permite almacenar información personalizada (no relacionada con las APIs externas) en la base de datos.
   - **GET /historial:** Retorna el historial de todas las respuestas almacenadas por el endpoint `/fusionados`, ordenado cronológicamente y con paginación.

3. **Implementación de Cache:**

   - Se implementa un sistema de caché para las respuestas de las APIs externas. Si la información consultada ha sido obtenida en los últimos 30 minutos, se devuelve desde el caché (utilizando DynamoDB o Redis), evitando múltiples llamadas a las APIs.

4. **Optimización y Buenas Prácticas:**

   - Optimización de costos mediante ajustes en el timeout y la memoria de AWS Lambda.
   - Pruebas unitarias e integrales utilizando Jest.
   - Uso de TypeScript para tipado estático y mayor seguridad en el código.

5. **Despliegue:**
   - El despliegue se realiza en AWS utilizando Serverless Framework, configurando funciones Lambda y API Gateway.
   - Almacenamiento en DynamoDB o MySQL, según los requerimientos del proyecto.

---

## Guía de Despliegue en AWS con Serverless Framework

### Pasos para el Despliegue

1. **Requisitos Previos:**

   - Instalar Node.js versión 20.
   - Instalar Serverless Framework globalmente:
     ```bash
     npm install -g serverless
     ```
   - Configurar las credenciales de AWS utilizando AWS CLI (`aws configure`) o mediante variables de entorno (`AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`).
   - Instalar las dependencias del proyecto:
     ```bash
     npm install
     ```

2. **Configuración del Proyecto:**

   - Asegúrate de que el archivo `serverless.yml` tenga el siguiente contenido:

     ```yaml
     service: fn-challenge-rimac
     frameworkVersion: '3'

     plugins:
       - serverless-esbuild
       - serverless-offline

     provider:
       name: aws
       runtime: nodejs20.x
       environment:
         NODE_OPTIONS: '--enable-source-maps --inspect'
         REGION: 'us-east-1'
         WEATHER_API_KEY: '01fecc4aa14848e89d1193127251603'
         REDIS_HOST: 'redis://localhost:6379'
         MYSQL_HOST: '127.0.0.1'
         MYSQL_DATABASE: 'starwarsBD'
         MYSQL_USER: 'user'
         MYSQL_PASSWORD: 'password'
         MYSQL_PORT: '3307'

     custom:
       serverless-offline:
         noPrependStageInUrl: true
         httpPort: 4000
         lambdaPort: 3003
         useChildProcesses: true
         printOutput: true
       esbuild:
         bundle: true
         minify: true
         sourcemap: false
         target: esnext
         keepNames: true
         watch:
           pattern: 'src/**/*.ts'

     functions:
       fn-challenge-rimac:
         handler: src/index.handler
         events:
           - httpApi: '*'
     ```

3. **Compilación y Empaquetado:**

   - El plugin `serverless-esbuild` se encargará de compilar y empaquetar el código TypeScript a JavaScript. No es necesario un paso de compilación manual.

4. **Despliegue en AWS:**

   - Ejecuta el siguiente comando en la raíz del proyecto para desplegar la API:
     ```bash
     serverless deploy
     ```
   - Este comando empaquetará la aplicación, la subirá a AWS y configurará las funciones Lambda y API Gateway según lo definido en `serverless.yml`.

5. **Verificación del Despliegue:**

   - Una vez finalizado el despliegue, Serverless Framework mostrará la URL del endpoint. Utiliza herramientas como Postman o cURL para probar los endpoints.

6. **Ejecución Local (Opcional):**

   - Para probar la API localmente, ejecuta:
     ```bash
     serverless offline
     ```
   - Esto iniciará un servidor local en los puertos configurados (HTTP en el puerto 4000 y Lambda en el puerto 3003).

7. **Pruebas Unitarias:**
   - Para ejecutar las pruebas unitarias e integrales, utiliza:
     ```bash
     npm test
     ```
