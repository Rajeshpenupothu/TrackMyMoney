**Render Deployment Guide**

This document shows step-by-step instructions to deploy the backend (Spring Boot) and frontend (Vite) to Render.

**Overview**
- Backend: Render Web Service (Java) — build with Maven, run the Spring Boot jar and bind to `$PORT`.
- Frontend: Render Static Site — build Vite app and publish `dist`.

**Prep (code change)**
- The frontend API client now reads a build-time environment variable: see [frontend/src/api/api.js](frontend/src/api/api.js#L1-L20). Set `VITE_API_BASE_URL` in the static site settings to point at your backend (including `/api`).

**Backend (Web Service) — fields to set in Render UI**
- Name: `trackmymoney-backend` (or your choice)
- Branch: `main`
- Root Directory: leave empty (service is in `backend/` — use build commands below)
- Build Command:

```bash
./mvnw -DskipTests package
```

- Start Command:

```bash
java -Dserver.port=$PORT -jar target/backend-0.0.1-SNAPSHOT.jar
```

- Instance Type: Hobby / Starter etc.
- Environment Variables (set these in Render for your service):
  - `SPRING_DATASOURCE_URL` = your JDBC URL (e.g. `jdbc:mysql://host:3306/dbname`)
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `JWT_SECRET` (your JWT signing secret)
  - Any other app secrets used by your app (mail, third-party APIs)

Notes:
- The start command uses `$PORT` (Render-provided). Spring Boot must bind to that port.
- If you prefer Docker, add a `Dockerfile` and choose Docker on Render.

**Frontend (Static Site) — fields to set in Render UI**
- Service Type: Static Site
- Name: `trackmymoney-frontend` (or your choice)
- Branch: `main`
- Root Directory: `frontend/`
- Build Command:

```bash
npm run build
```

- Publish Directory: `frontend/dist`
- Environment Variables (set in the Render static site settings):
  - `VITE_API_BASE_URL` = `https://<your-backend-service>.onrender.com/api`

Notes:
- Vite embeds `VITE_*` env variables at build time. Set `VITE_API_BASE_URL` in Render so the built app calls your backend.
- If you use `yarn`, use `yarn build` instead of `npm run build`.

**CORS / Security**
- Ensure your backend allows requests from your frontend origin (the static site's rendered domain). If you host frontend at e.g. `https://trackmymoney-frontend.onrender.com`, add that origin to allowed CORS origins in your Spring Boot config or SecurityConfig.

**Optional: Single-repo Render blueprint**
- You can add a `render.yaml` blueprint to automate service creation. I did not add it here to avoid schema mismatch with your Render account. If you want, I can add a `render.yaml` with both services configured — tell me and I will generate it.

**Quick checklist**
- [ ] Add backend service on Render with above build/start commands.
- [ ] Set DB and secret environment variables for backend.
- [ ] Add frontend static site on Render (root `frontend/`).
- [ ] Set `VITE_API_BASE_URL` for frontend to the backend public URL.
- [ ] Deploy backend, copy its public URL, then deploy frontend (or rebuild frontend after setting the env var).

If you'd like, I can: add a `render.yaml` blueprint, add a Dockerfile for the backend, or create a runtime configuration so the frontend reads the API URL at runtime instead of build-time. Which would you prefer?
