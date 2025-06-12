## **Paquete de Handoff: Creación de Boilerplate de Producción para Next.js**

### **A. Objetivo de la Tarea**

¡Equipo, hola!

Nuestra primera misión es construir un activo estratégico: un **boilerplate/starter kit de alta calidad, genérico y reutilizable** para aplicaciones Next.js. El objetivo es crear una base de código con las mejores prácticas de la industria en cuanto a estructura, seguridad, testing y configuración.

Esta base nos permitirá iniciar nuevos proyectos con una fundación sólida y probada, acelerando drásticamente el tiempo de desarrollo y asegurando la consistencia y calidad desde el día uno. El primer proyecto que utilizará este boilerplate será "VodaEventos".

### **B. Documentación de Referencia**

La única fuente de verdad para los requerimientos técnicos de este boilerplate es el **Documento de Arquitectura** que hemos definido. Este documento contiene el stack tecnológico, los patrones y las decisiones que deben implementarse.

- **Documento de Arquitectura v1.4:** Define el "plano técnico" del boilerplate.

### **C. Organización de Directorios Recomendada para el Boilerplate**

La estructura está diseñada para ser un punto de partida lógico y escalable para cualquier proyecto futuro.

```plaintext
/nextjs-production-boilerplate/
|
|-- /app/                   # Corazón de la app Next.js 15. Contiene ejemplos de rutas.
|   |-- /api/               # Endpoints de API de ejemplo (ej. /api/health).
|   |-- /(auth)/            # Grupo de rutas para login, registro.
|   |-- /(protected)/       # Grupo de rutas para páginas que requieren autenticación.
|   |   |-- /dashboard/
|   |       |-- page.tsx      # Página de ejemplo protegida.
|   |-- /layout.tsx
|
|-- /components/            # Componentes de React "tontos", puramente presentacionales.
|   |-- /ui/                # Componentes base de shadcn/ui (Button, Input, Card).
|
|-- /hooks/                 # Hooks de React personalizados y genéricos.
|
|-- /lib/                   # Lógica de negocio, utilidades y código compartido.
|   |-- /actions/           # Server Actions (ej. login, signup).
|   |-- /db/                # Configuración de Drizzle ORM, schema y repositorios.
|   |-- /auth/              # Configuración de Lucia Auth.
|   |-- /types/             # Definiciones de tipos de TypeScript.
|
|-- /specs/                 # (Opcional) Especificaciones técnicas granulares del boilerplate.
|
|-- /ai_docs/               # (Opcional) Prompts para generar código compatible con esta arquitectura.
|
|-- package.json
|-- tsconfig.json
```

### **D. Tarea Asignada: Historia 0.0 (Sprint 0)**

A continuación, la historia de desarrollo que define el trabajo a realizar para crear el boilerplate.

```markdown
# Historia 0.0: Creación del Boilerplate/Starter Kit Genérico de Producción

- **Épica:** 0. Boilerplate Fundacional
- **Tipo:** Tarea Técnica
- **Descripción:** Como Equipo de Desarrollo, queremos construir un **Starter Kit de Next.js 15 genérico y de grado producción**. Este boilerplate debe incluir nuestro stack tecnológico definido (Drizzle, Lucia Auth, TailwindCSS) y las mejores prácticas de configuración (testing, CI/CD, performance), para servir como una fundación sólida y reutilizable, siempre usando Typescript.

---

### Criterios de Aceptación (Definition of Done)

1.  El repositorio del boilerplate está inicializado con la estructura de directorios definida.
2.  Todas las dependencias principales están instaladas y configuradas.
3.  La autenticación con **Lucia Auth** está completamente implementada: un usuario puede registrarse, iniciar sesión (con email/contraseña) y cerrar sesión.
4.  La conexión a una base de datos PostgreSQL (a través de variables de entorno) con **Drizzle ORM** está funcionando, con esquemas y migraciones para las tablas `users` y `sessions`.
5.  Las rutas bajo un grupo `(protected)` son inaccesibles para usuarios no autenticados.
6.  La estrategia de testing está implementada, con ejemplos funcionales para:
    - Pruebas unitarias con **Vitest**.
    - Pruebas de componente con **React Testing Library**.
    - Pruebas E2E con **Playwright** para los flujos de autenticación.
7.  El proyecto se despliega correctamente en Vercel.
8.  **Performance Baseline:** El boilerplate desplegado alcanza un score de Lighthouse > 95 en Performance, Accesibilidad y Best Practices.
9.  **Monitoring Baseline:** Se ha integrado Sentry para el reporte de errores y Vercel Analytics para Core Web Vitals.

---

### Tareas de Desarrollo (Checklist)

- [ ] 1. **Setup Inicial:** Crear repositorio, inicializar proyecto Next.js 15 con `pnpm`, e implementar la estructura de carpetas.
- [ ] 2. **Configuración del Stack:** Instalar y configurar Drizzle, Lucia Auth, TailwindCSS, `shadcn/ui`, Sentry y Vercel Analytics.
- [ ] 3. **Implementación de Autenticación:**
  - [ ] Definir esquemas Drizzle para `users` y `sessions` (nombres genéricos).
  - [ ] Crear las Server Actions para `signup`, `login` y `logout`.
  - [ ] Configurar el `middleware.ts` para la protección de rutas.
- [ ] 4. **Implementación de Testing y UI:**
  - [ ] **(BDD):** Escribir pruebas E2E en Playwright para los flujos de autenticación.
  - [ ] Instalar y configurar **Vitest** y **React Testing Library**.
  - [ ] Construir los componentes de UI genéricos para los formularios de autenticación.
  - [ ] **(TDD):** Crear un ejemplo de prueba unitaria y un ejemplo de prueba de componente.
- [ ] 5. **CI/CD y Despliegue:** Configurar el pipeline en GitHub Actions y verificar el despliegue en Vercel.
```
