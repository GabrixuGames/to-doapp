# 📝 To-Do App

Aplicación web de gestión de tareas construida con **React** (frontend) y **Flask** (backend). Permite crear, listar, editar, completar y eliminar tareas de forma intuitiva y eficiente.

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React** con Vite – Interfaz de usuario rápida y moderna
- 🐍 **Flask** – Servidor backend en Python
- 🐘 **PostgreSQL** o **SQLite** – Base de datos para persistencia
- 🔗 **Flask-CORS** – Permite la comunicación entre frontend y backend

---

## 📦 Instalación y ejecución

### 🔧 Backend (Flask)

1. Ir al directorio del backend:

   ```bash
   cd backend
  
2. Instalar dependencias:

   ```bash
    pip install -r requirements.txt

3. Ejecutar la app:

   ```bash
    flask run

### 💻 Frontend (React)

1. Acceder a la carpeta del forntend

   ```bash
    cd frontend

2. Instalar las dependencias:

   ```bash
     npm install```


3. Iniciar el servidor de desarrollo:

   ```bash
    npm run dev

 ### 📋 Estructura del proyecto
```
 project-root/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.tsx
│   └── vite.config.ts
│
└── README.md
```

### ✨ Funcionalidades

✅ Crear tareas
📝 Editar título y descripción
☑️ Marcar como completada
🗑️ Eliminar tareas
🕒 Mostrar fecha de creación
