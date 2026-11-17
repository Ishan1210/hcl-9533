# JWT Blog Demo

React + Vite frontend connected to a Spring Boot REST API using JWT authentication.

## Backend

1. Open a terminal in `backend`.
2. Set `APP_JWT_SECRET` to a private random secret (at least 32 characters).
3. Run `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).
4. Backend runs at `http://localhost:8080`.
5. H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:jwtdemo`).

If running from IntelliJ, set `APP_JWT_SECRET` in Run Configuration > Environment variables.

## Frontend

1. Open another terminal in `frontend`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`.

Optional: create `frontend/.env` and set `VITE_API_BASE_URL=http://localhost:8080/api/v1`.

## API behavior

- `POST /api/v1/auth/register` — public registration.
- `POST /api/v1/auth/login` — public login; returns a JWT token.
- `GET /api/v1/posts` — public list of posts.
- `POST /api/v1/posts` — requires `Authorization: Bearer <token>`.

Passwords are stored using BCrypt. The JWT secret must be changed from the development fallback before deployment.
