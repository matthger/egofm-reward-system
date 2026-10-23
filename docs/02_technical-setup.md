# Technical Setup & Deployment

## Project Structure

```
egofm/
├── apps/
│   ├── frontend/               # Angular SSR application
│   └── backend/                # NestJS REST API with TypeORM
├── libs/
│   └── shared/                 # Shared interfaces and enums used by both frontend and backend
├── nginx/                      # NGINX reverse proxy configuration
│   ├── nginx.conf              # Development config: with Swagger access, hot reload proxy
│   └── nginx.prod.conf         # Production config: optimized for static delivery, restricted routes, no Swagger
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── .env                        # Environment variables (not tracked in Git)
├── package.json
├── nx.json
├── tsconfig.base.json
└── README.md
````

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/matthger/egofm-reward-system.git
cd egofm-reward-system
````

### 2. Create a `.env` File

```env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=db
POSTGRES_PORT=5432
JWT_SECRET=
SEEDUSER_PASSWORD=
```

**SEEDUSER\_PASSWORD** is the default password for seeded users (listener, supporter, fan, insider, diehard, champion).
Each user will initially have this password and can later change it in their account settings.

> ⚠️ Do **not** commit `.env` to Git.

---

## Running the Stack with Docker (Development)

```bash
docker compose up --build
```

This command will:

* Build and run the frontend and backend containers with hot reload
* Start a PostgreSQL database with mounted volume
* Proxy HTTP traffic through NGINX (port 80)
* Seed the database with test data (if not already present)

---

## Development Environment Setup (optimized for Linux)

### Node.js with `nvm`

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install 22
nvm use 22

node -v
npm -v
```

### Docker & Docker Compose

#### 1. Add Docker’s GPG key and apt repository

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

```bash
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

#### 2. Install Docker

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### 3. Run Docker without `sudo`

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

Test installation:

```bash
docker run hello-world
```

---

## CLI Tools

Install Angular CLI, NestJS CLI and Nx globally:

```bash
npm install -g @angular/cli
npm install -g @nestjs/cli
npm install -g nx
```

---

## Access

| Service       | URL                                                          |
| ------------- | ------------------------------------------------------------ |
| Frontend      | [http://localhost](http://localhost)                         |
| Backend API   | [http://localhost/api](http://localhost/api)                 |
| Swagger UI    | [http://localhost/api/swagger](http://localhost/api/swagger) |
| PostgreSQL DB | localhost:5432                                               |

---

## Useful Commands

### Stop all services

```bash
docker compose down
```

### Rebuild and start (clean)

```bash
docker compose up --build
```

---

## Production Environment Setup

To build and run the production version:

```bash
docker compose -f docker-compose.prod.yml up --build
```

This will:

* Build **optimized production images** for frontend and backend
* Disable hot reload and development tools
* Use production-ready environment settings
* Serve the frontend statically via NGINX
* Launch the backend using `node dist/main.js`

Docker images will be named:

* `egofm-reward-frontend:prod`
* `egofm-reward-backend:prod`

---

## Differences: Development vs. Production

| Feature              | Development              | Production                 |
| -------------------- | ------------------------ | -------------------------- |
| Hot Reload           | Enabled                  | Disabled                   |
| Frontend Build       | JIT via Angular CLI      | Precompiled (Angular SSR)  |
| Backend Start        | `ts-node` (live)         | `node dist/main.js`        |
| TypeORM `synchronize` | Enabled (auto schema sync) | Disabled (manual migrations) |
| Swagger (API Docs)   | Enabled                  | Disabled                   |
| Backend Logging      | `debug`                  | `info`                     |
