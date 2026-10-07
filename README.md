# 🚀 DevOps Automation Dashboard for Build & Deployment Monitoring

[![CI/CD Pipeline](https://github.com/your-username/devops-automation-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/devops-automation-dashboard/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/your-username/devops-automation-dashboard/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/your-username/devops-automation-dashboard/actions/workflows/deploy-pages.yml)
[![Docker](https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5 / CSS3 / Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/)

A responsive, high-performance, dark-themed **DevOps Automation Dashboard** designed to monitor continuous integration pipelines, track automated workflow runs, visualize multi-stage deployment lifecycles, and analyze infrastructure health telemetry.

---

## 🌟 Key Features

1. **5 Core KPI Telemetry Cards**:
   - **Build Status**: Passing / Failing state with test pass percentage.
   - **Deployment Status**: Active target environment (`Production v2.4.1`, AWS us-east-1).
   - **Total Builds**: Aggregated build count with 30-day growth trends.
   - **Successful Builds**: Total passed runs and SLA compliance percentage.
   - **Failed Builds**: Failure rate counter with rollback triggers.
2. **Interactive CI/CD Pipeline Stepper**:
   - Visual stage-by-stage progression: `Code & Checkout` &rarr; `Build & Package` &rarr; `Automated Tests` &rarr; `Deployment`.
   - Dynamic stage status tags: **Green (Completed)**, **Yellow (Running / Pulse)**, **Red (Failed)**, and **Neutral (Pending)**.
3. **Interactive Pipeline Simulator**:
   - Live demo engine that simulates real-time build dispatch, runs through all 4 pipeline stages, generates console logs, updates metric counters, and triggers toast notifications.
4. **Recent Workflow Runs Table**:
   - Filter by status (`Success`, `Failed`, `Pending`, `Running`), branch (`main`, `staging`, `feature/auth`, `feature/docker`), or global search query (`Ctrl+K` / `⌘K`).
   - Modal drawer with full console execution logs and a "Copy Output" button.
5. **Telemetry Charts & Visualizations**:
   - Dual-axis Line/Bar chart for 7-day build frequency vs average duration.
   - Doughnut distribution chart showing workflow health and pass/fail ratios.
6. **Live GitHub Actions API Integration (Optional)**:
   - Out-of-the-box realistic mock data clearly labeled as **"DEMO MODE"**.
   - Input your GitHub repository (`owner/repo`) in Settings to fetch real GitHub Actions runs via the GitHub REST API.
7. **Production Containerization**:
   - Standard `Dockerfile` based on `nginx:1.27-alpine` with gzip compression, security headers (`X-Frame-Options`, `CSP`), and automated container healthcheck probes.
8. **Automated CI/CD Verification**:
   - Multi-job GitHub Actions workflow (`.github/workflows/ci.yml`) that validates HTML5 semantics, checks JavaScript syntax, tests Docker image builds, and generates a workflow summary.

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | Semantic HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, Dark Mode), Vanilla JavaScript (ES6+ Modules) |
| **Data & Charts** | [Chart.js](https://www.chartjs.org/) (via CDN), [Lucide Icons](https://lucide.dev/) |
| **Containerization** | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), [Nginx Alpine](https://hub.docker.com/_/nginx) |
| **CI/CD Automation** | [GitHub Actions](https://github.com/features/actions) (`ci.yml`, `deploy-pages.yml`) |
| **Hosting** | GitHub Pages / Docker Container / Static Web Server |

---

## 📁 Project Structure

```text
devops-automation-dashboard/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated CI test & Docker validation workflow
│       └── deploy-pages.yml       # Automated GitHub Pages deployment workflow
├── css/
│   └── style.css                  # Modern dark theme design system & responsive layout
├── js/
│   ├── app.js                     # Main application controller, routing & simulator
│   ├── charts.js                  # Chart.js visualization engine (Trends & Doughnut)
│   ├── data.js                    # Structured realistic sample telemetry dataset (Demo Mode)
│   └── github-api.js              # GitHub REST API client for live workflow runs
├── Dockerfile                     # Production Nginx Alpine container definition
├── docker-compose.yml             # Local Docker Compose service definition
├── .dockerignore                  # Docker build context exclusions
├── nginx.conf                     # Custom Nginx configuration with gzip & security headers
├── index.html                     # Semantic HTML5 dashboard single-page application
├── .gitignore                     # Git exclusion rules
├── LINKEDIN_GUIDE.md              # LinkedIn post & portfolio presentation blueprint
└── README.md                      # Comprehensive project documentation
```

---

## ⚡ Quick Start: Running Locally

You can run this dashboard locally using any of the methods below.

### Method 1: Using Python Built-in Server (Recommended - Zero Install)

```bash
# Clone the repository
git clone https://github.com/your-username/devops-automation-dashboard.git
cd devops-automation-dashboard

# Start Python 3 HTTP server
python -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

---

### Method 2: Using Docker Container

```bash
# 1. Build the Docker image
docker build -t devops-automation-dashboard:latest .

# 2. Run the container on port 8080
docker run -d -p 8080:80 --name devops-dashboard devops-automation-dashboard:latest

# 3. View container logs
docker logs devops-dashboard
```
Open **`http://localhost:8080`** in your browser.

To stop and remove the container:
```bash
docker stop devops-dashboard && docker rm devops-dashboard
```

---

### Method 3: Using Docker Compose

```bash
# Start container in detached mode
docker compose up -d

# Check status and health
docker compose ps

# Stop container
docker compose down
```

---

### Method 4: Using VS Code Live Server or Node `http-server`

```bash
# Using npx (Node.js)
npx http-server -p 8080 .
```

---

## 🔄 CI/CD Automation (GitHub Actions)

This project includes a continuous integration workflow configured in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Workflow Jobs:
1. **`validate-and-lint`**:
   - Checks out the code via `actions/checkout@v4`.
   - Validates HTML5 markup and tag semantics using Python validators.
   - Validates JavaScript syntax with `node --check`.
   - Verifies required project assets.
2. **`docker-build-test`**:
   - Builds the Docker image using Docker Buildx.
   - Spawns a test container instance and checks health via HTTP status code `200 OK`.
3. **`workflow-summary`**:
   - Generates a Markdown step summary visible in GitHub Actions run overview.

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete DevOps Automation Dashboard"
   git branch -M main
   git remote add origin https://github.com/your-username/devops-automation-dashboard.git
   git push -u origin main
   ```
2. Navigate to your repository on GitHub &rarr; **Settings** &rarr; **Pages**.
3. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy-pages.yml` will automatically build and publish your dashboard to `https://your-username.github.io/devops-automation-dashboard/`.

---

## 🔌 Connecting Live GitHub Actions Telemetry

By default, the dashboard runs in **Demo Mode** with mock telemetry data. To connect real data:
1. Open the dashboard &rarr; Navigate to **GitHub Integration** in the sidebar.
2. Enter your repository name in `owner/repo` format (e.g. `torvalds/linux` or `your-username/your-repo`).
3. (Optional) Provide a Personal Access Token with `actions:read` scope for private repositories.
4. Click **Connect & Fetch Runs**. The UI will switch from "Demo Mode" to "Live Mode" with real workflow runs!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
