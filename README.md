# Monitor de Temperatura

Aplicación web para monitoreo de temperatura en tiempo real. El sistema se compone de un frontend moderno, un backend para recepción de datos, y está contenedorizado con Docker para facilitar su ejecución.

Los datos son enviados desde un microcontrolador **ESP32** conectado a un sensor **MAX6675** (termocupla tipo K). El código fuente que corre en el ESP32 se encuentra disponible en este repositorio:

👉 [ESP32-MAX6675 – TermocuplaESP32.ino](https://github.com/ESCALOS/ESP32-MAX6675)

## 🚀 Características

- Monitoreo en tiempo real
- Interfaz moderna e intuitiva
- Backend robusto para procesamiento de datos
- Contenedorización con Docker y Docker Compose

## 📁 Estructura del Proyecto

- `realtime-monitor/`
  - `backend/` – Código fuente del backend
  - `frontend/` – Código fuente del frontend
  - `docker-compose.yml` – Configuración para levantar los servicios

## 🛠️ Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/ESCALOS/realtime-monitor.git
   cd realtime-monitor
   ```
2. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.
   ```bash
   git clone https://github.com/ESCALOS/realtime-monitor.git
   cd realtime-monitor
   ```
3. Levanta los servicios usando Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Accede a la aplicación desde tu navegador en:
   ```bash
   http://localhost:3000
   ```
## ▶️ Uso

Una vez que los servicios estén corriendo:
- Abre tu navegador y accede a `http://localhost:3000`.
- Interactúa con la interfaz para visualizar y monitorear los datos en tiempo real.
- El backend se encarga de recibir, procesar y enviar los datos actualizados al frontend.

### Comandos útiles
- Detener los servicios:
  ```bash
  docker-compose down
  ```
- Ver los logs en tiempo real:
  ```bash
  Ver los logs en tiempo real:
  ```
- Reconstruir los contenedores:
  ```bash
  docker-compose up --build
  ```
## 🧪 Tecnologías Utilizadas

- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [Express](https://expressjs.com/) + [Socket.IO](https://socket.io/)
- **Base de datos**: [MongoDB](https://www.mongodb.com/)
- **Contenedorización**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)
- **Microcontrolador**: ESP32
- **Sensor**: MAX6675 (termocupla tipo K)

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. Haz un fork del repositorio.
2. Crea una rama nueva: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y haz commit: `git commit -m "Agrega nueva funcionalidad"`.
4. Haz push a tu rama: `git push origin feature/nueva-funcionalidad`.
5. Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 📫 Contacto

Si tienes dudas o sugerencias, no dudes en abrir un issue o escribir a stornblood6969@gmail.com.
