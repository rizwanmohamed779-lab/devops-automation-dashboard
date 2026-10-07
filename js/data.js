/**
 * DevOps Automation Dashboard - Mock Telemetry & Sample Data
 * NOTE: This file contains realistic sample/demo data for initial preview.
 * It is clearly labeled across the UI as DEMO DATA.
 */

window.DevOpsData = {
  // Flag indicating current dataset source
  isDemoData: true,
  lastUpdated: new Date().toISOString(),

  // Key KPI Metrics
  kpis: {
    buildStatus: {
      status: "Passing",
      type: "success",
      detail: "100% tests passed in last cycle",
      score: 100
    },
    deploymentStatus: {
      version: "Production v2.4.1",
      environment: "AWS us-east-1",
      timeAgo: "42m ago",
      type: "info"
    },
    totalBuilds: 1428,
    successfulBuilds: 1379,
    failedBuilds: 49,
    successRate: 96.56,
    avgDuration: "3m 12s",
    avgDurationSec: 192
  },

  // Active Pipeline Stages Visualization Data
  activePipeline: {
    id: "pipe-prod-main-1428",
    name: "Production CI/CD Automated Flow",
    branch: "main",
    commitSha: "8a4f91d",
    commitMsg: "feat(auth): harden JWT validation & session timeout",
    author: "devops-engineer",
    status: "success",
    totalDuration: "2m 56s",
    stages: [
      {
        id: "stage-code",
        name: "1. Code & Checkout",
        description: "Git checkout, HTML/CSS validation, secret scanning",
        status: "completed", // 'completed', 'running', 'failed', 'pending'
        duration: "14s",
        icon: "code-2",
        details: "Validated HTML5 semantics & scanned 42 files (0 secrets detected)."
      },
      {
        id: "stage-build",
        name: "2. Build & Package",
        description: "Docker multi-stage build, Nginx bundle creation",
        status: "completed",
        duration: "1m 22s",
        icon: "box",
        details: "Created Docker image `devops-dashboard:v2.4.1` (Size: 24.8 MB)."
      },
      {
        id: "stage-test",
        name: "3. Automated Tests",
        description: "HTML5 validation, unit & security test suites",
        status: "completed",
        duration: "48s",
        icon: "check-check",
        details: "142 test assertions executed, 100% pass rate."
      },
      {
        id: "stage-deploy",
        name: "4. Deployment",
        description: "Kubernetes rolling update / Nginx Edge rollout",
        status: "completed",
        duration: "32s",
        icon: "rocket",
        details: "Rolled out 3 pods across us-east-1. Zero downtime."
      }
    ]
  },

  // Recent GitHub Actions Workflow Runs
  workflowRuns: [
    {
      id: "run-1428",
      name: "CI/CD Build & Validate",
      runNumber: 1428,
      branch: "main",
      commit: {
        sha: "8a4f91d",
        shortSha: "8a4f91d",
        message: "feat(auth): harden JWT validation & session timeout",
        author: "Alex Morgan"
      },
      event: "push",
      status: "success", // success, failed, pending, running
      duration: "2m 56s",
      durationSec: 176,
      timestamp: "2026-10-07T20:15:00Z",
      logs: [
        { ts: "20:15:01", step: "Setup Job", type: "info", text: "Runner ubuntu-latest hosted by GitHub Actions" },
        { ts: "20:15:04", step: "Checkout Code", type: "info", text: "actions/checkout@v4 - Checked out ref refs/heads/main" },
        { ts: "20:15:18", step: "HTML & CSS Lint", type: "success", text: "HTML5 semantic validator: 0 errors, 0 warnings found." },
        { ts: "20:15:45", step: "Docker Build", type: "info", text: "docker build -t devops-dashboard:8a4f91d ." },
        { ts: "20:16:30", step: "Docker Healthcheck", type: "success", text: "Container curl healthcheck returned HTTP 200 OK." },
        { ts: "20:17:40", step: "Deployment Edge", type: "success", text: "Deployed to Production CDN & Nginx Edge cluster." },
        { ts: "20:17:57", step: "Complete", type: "success", text: "Workflow completed with exit status 0 (SUCCESS)." }
      ]
    },
    {
      id: "run-1427",
      name: "Docker Production Release",
      runNumber: 1427,
      branch: "main",
      commit: {
        sha: "3c7b20e",
        shortSha: "3c7b20e",
        message: "chore(docker): optimize alpine nginx security headers",
        author: "Sarah Chen"
      },
      event: "push",
      status: "success",
      duration: "3m 40s",
      durationSec: 220,
      timestamp: "2026-10-07T18:40:00Z",
      logs: [
        { ts: "18:40:02", step: "Setup Job", type: "info", text: "Starting build runner" },
        { ts: "18:40:20", step: "Docker Build", type: "info", text: "Building Docker container image tag v2.4.1" },
        { ts: "18:43:20", step: "Registry Push", type: "success", text: "Pushed image to ghcr.io/devops/dashboard:v2.4.1" },
        { ts: "18:43:42", step: "Complete", type: "success", text: "Completed release packaging successfully." }
      ]
    },
    {
      id: "run-1426",
      name: "Pull Request CI Validator",
      runNumber: 1426,
      branch: "feature/auth",
      commit: {
        sha: "5e91a04",
        shortSha: "5e91a04",
        message: "fix(css): adjust high-contrast glassmorphism border radius",
        author: "Marcus Vance"
      },
      event: "pull_request",
      status: "success",
      duration: "1m 45s",
      durationSec: 105,
      timestamp: "2026-10-07T16:22:00Z",
      logs: [
        { ts: "16:22:01", step: "PR Check", type: "info", text: "Triggered by PR #48 from feature/auth" },
        { ts: "16:23:10", step: "HTML Validator", type: "success", text: "HTML5 validation completed with 0 errors" },
        { ts: "16:23:46", step: "Summary", type: "success", text: "All PR checks passed. Safe to merge." }
      ]
    },
    {
      id: "run-1425",
      name: "Security SAST Scan",
      runNumber: 1425,
      branch: "staging",
      commit: {
        sha: "1f89c42",
        shortSha: "1f89c42",
        message: "refactor(api): upgrade octokit dependency",
        author: "Sarah Chen"
      },
      event: "schedule",
      status: "failed",
      duration: "4m 12s",
      durationSec: 252,
      timestamp: "2026-10-07T14:10:00Z",
      logs: [
        { ts: "14:10:01", step: "SAST Scan", type: "info", text: "Running Trivy container vulnerability scanner" },
        { ts: "14:13:50", step: "Vulnerability Found", type: "error", text: "High severity CVE-2026-1194 detected in upstream library" },
        { ts: "14:14:12", step: "Job Failed", type: "error", text: "Exit code 1: Security threshold violated. Build terminated." }
      ]
    },
    {
      id: "run-1424",
      name: "CI/CD Build & Validate",
      runNumber: 1424,
      branch: "feature/docker",
      commit: {
        sha: "9b2c33a",
        shortSha: "9b2c33a",
        message: "feat(docker): add multi-stage healthcheck probe",
        author: "DevOps Bot"
      },
      event: "pull_request",
      status: "success",
      duration: "2m 18s",
      durationSec: 138,
      timestamp: "2026-10-07T11:05:00Z",
      logs: [
        { ts: "11:05:00", step: "Job Init", type: "info", text: "Executing PR checks" },
        { ts: "11:07:18", step: "Complete", type: "success", text: "Container healthcheck passed." }
      ]
    },
    {
      id: "run-1423",
      name: "Staging Pipeline Promotion",
      runNumber: 1423,
      branch: "staging",
      commit: {
        sha: "4a71bf9",
        shortSha: "4a71bf9",
        message: "ci: update github actions runner matrix to ubuntu-latest",
        author: "Alex Morgan"
      },
      event: "push",
      status: "success",
      duration: "3m 05s",
      durationSec: 185,
      timestamp: "2026-10-07T08:30:00Z",
      logs: [
        { ts: "08:30:00", step: "Deploy Staging", type: "info", text: "Deploying build #1423 to staging-k8s.internal" },
        { ts: "08:33:05", step: "Health Verified", type: "success", text: "Staging environment responding healthy." }
      ]
    }
  ],

  // Project Activity Stream Log
  activityStream: [
    {
      id: "act-1",
      icon: "rocket",
      type: "success",
      title: "Production Deployment v2.4.1 Completed",
      detail: "Automated CD pipeline deployed commit 8a4f91d to AWS us-east-1 cluster.",
      time: "42m ago"
    },
    {
      id: "act-2",
      icon: "git-commit",
      type: "info",
      title: "Commit pushed to main by Alex Morgan",
      detail: "feat(auth): harden JWT validation & session timeout (#48)",
      time: "1h 10m ago"
    },
    {
      id: "act-3",
      icon: "check-circle",
      type: "success",
      title: "GitHub Actions Workflow Passed",
      detail: "CI/CD Build & Validate run #1428 completed in 2m 56s.",
      time: "1h 15m ago"
    },
    {
      id: "act-4",
      icon: "alert-triangle",
      type: "danger",
      title: "Security Scan Alert on branch staging",
      detail: "SAST scan detected 1 CVE vulnerability in dependency chain.",
      time: "6h 45m ago"
    },
    {
      id: "act-5",
      icon: "box",
      type: "info",
      title: "Docker Image Built & Tagged",
      detail: "Image devops-dashboard:v2.4.1 pushed to container registry.",
      time: "8h 12m ago"
    }
  ],

  // Deployment History & Releases
  deploymentHistory: [
    {
      id: "dep-1",
      version: "v2.4.1",
      environment: "Production (AWS us-east-1)",
      status: "active",
      deployedBy: "GitHub Actions CD",
      deployedAt: "Today, 19:35 UTC",
      commitSha: "8a4f91d",
      notes: "Hardened JWT validation, updated dark theme UI"
    },
    {
      id: "dep-2",
      version: "v2.4.2-rc1",
      environment: "Staging Cluster",
      status: "active",
      deployedBy: "Alex Morgan",
      deployedAt: "Today, 17:10 UTC",
      commitSha: "3c7b20e",
      notes: "Testing Nginx security headers and caching"
    },
    {
      id: "dep-3",
      version: "v2.4.0",
      environment: "Production (AWS us-east-1)",
      status: "superseded",
      deployedBy: "Automated Release Workflow",
      deployedAt: "Yesterday, 14:00 UTC",
      commitSha: "7d11ab4",
      notes: "Initial stable release with Docker container support"
    },
    {
      id: "dep-4",
      version: "v2.3.9",
      environment: "Production (AWS us-east-1)",
      status: "rollback_target",
      deployedBy: "Release Bot",
      deployedAt: "Oct 04, 2026",
      commitSha: "2a99c01",
      notes: "Golden fallback build"
    }
  ],

  // Detailed Pipeline Definitions (Pipelines View)
  pipelineDefinitions: [
    {
      id: "pipe-ci-main",
      name: "CI/CD Build & Validate",
      file: ".github/workflows/ci.yml",
      triggers: ["push to main", "pull_request"],
      status: "passing",
      lastDuration: "2m 56s",
      successRate: 98.4,
      stages: ["Checkout", "HTML5 Validate", "CSS Lint", "Docker Build", "Deploy Test"]
    },
    {
      id: "pipe-docker-prod",
      name: "Docker Container Packaging",
      file: ".github/workflows/docker.yml",
      triggers: ["release tag", "workflow_dispatch"],
      status: "passing",
      lastDuration: "3m 40s",
      successRate: 95.0,
      stages: ["Base Image", "Multi-stage Nginx", "Trivy Scan", "Registry Push"]
    },
    {
      id: "pipe-security-audit",
      name: "Nightly Security SAST Scan",
      file: ".github/workflows/security.yml",
      triggers: ["schedule: 0 0 * * *"],
      status: "failed",
      lastDuration: "4m 12s",
      successRate: 88.0,
      stages: ["Dependency Audit", "Secret Scanning", "Container SAST", "Slack Alert"]
    }
  ],

  // Environments & Infrastructure
  environments: [
    {
      id: "env-prod",
      name: "Production Cluster",
      provider: "AWS us-east-1",
      type: "production",
      status: "healthy",
      uptime: "99.98%",
      version: "v2.4.1",
      instances: 3,
      cpuUsage: "28%",
      memUsage: "44%"
    },
    {
      id: "env-staging",
      name: "Staging Cluster",
      provider: "AWS us-west-2",
      type: "staging",
      status: "healthy",
      uptime: "99.85%",
      version: "v2.4.2-rc1",
      instances: 2,
      cpuUsage: "14%",
      memUsage: "32%"
    },
    {
      id: "env-edge",
      name: "Nginx Edge Proxy / CDN",
      provider: "Global Anycast Edge",
      type: "edge",
      status: "healthy",
      uptime: "100%",
      version: "Nginx 1.27-alpine",
      instances: 12,
      cpuUsage: "8%",
      memUsage: "19%"
    }
  ],

  // 7-day Historical Trend Data for Charts
  trends: {
    labels: ["Oct 01", "Oct 02", "Oct 03", "Oct 04", "Oct 05", "Oct 06", "Oct 07"],
    buildCounts: [180, 210, 195, 230, 245, 198, 170],
    avgDurationsSec: [210, 195, 205, 185, 190, 180, 176],
    successCounts: [174, 202, 190, 222, 238, 192, 161],
    failedCounts: [6, 8, 5, 8, 7, 6, 9]
  }
};
