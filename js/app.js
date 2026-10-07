/**
 * DevOps Automation Dashboard - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Application State
  const state = {
    currentView: 'overview',
    activeData: { ...window.DevOpsData },
    isLiveGitHub: false,
    filters: {
      status: 'all',
      branch: 'all',
      search: ''
    },
    isSimulating: false,
    refreshTimer: null,
    preferences: {
      refreshInterval: 30000,
      simSpeedMs: 1500
    }
  };

  // DOM Elements Cache
  const elements = {
    // Layout & Navigation
    navItems: document.querySelectorAll('.nav-item'),
    viewSections: document.querySelectorAll('.view-section'),
    currentViewTitle: document.getElementById('current-view-title'),
    sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
    sidebar: document.getElementById('sidebar'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    globalSearchInput: document.getElementById('global-search'),
    dataSourcePill: document.getElementById('data-source-pill'),
    dataSourceLabel: document.getElementById('data-source-label'),
    demoBanner: document.getElementById('demo-banner'),
    btnDismissBanner: document.getElementById('btn-dismiss-banner'),
    btnTriggerDemoBuild: document.getElementById('btn-trigger-demo-build'),
    btnRefreshData: document.getElementById('btn-refresh-data'),
    refreshIcon: document.getElementById('refresh-icon'),
    lastSyncedTime: document.getElementById('last-synced-time'),
    btnNewPipelineRun: document.getElementById('btn-new-pipeline-run'),
    btnSimulateFlow: document.getElementById('btn-simulate-flow'),

    // Metric KPIs
    metricBuildStatus: document.getElementById('metric-build-status'),
    metricDeployStatus: document.getElementById('metric-deploy-status'),
    metricTotalBuilds: document.getElementById('metric-total-builds'),
    metricSuccessBuilds: document.getElementById('metric-success-builds'),
    metricSuccessRate: document.getElementById('metric-success-rate'),
    metricFailedBuilds: document.getElementById('metric-failed-builds'),
    metricAvgDuration: document.getElementById('metric-avg-duration'),

    // Pipeline Stepper
    pipelineActiveSha: document.getElementById('pipeline-active-sha'),
    stageCode: document.getElementById('stage-code'),
    stageBuild: document.getElementById('stage-build'),
    stageTest: document.getElementById('stage-test'),
    stageDeploy: document.getElementById('stage-deploy'),
    btnToggleTerminal: document.getElementById('btn-toggle-terminal'),

    // Table & Lists
    workflowRunsTbody: document.getElementById('workflow-runs-tbody'),
    filterWorkflowStatus: document.getElementById('filter-workflow-status'),
    filterWorkflowBranch: document.getElementById('filter-workflow-branch'),
    tableShowingCount: document.getElementById('table-showing-count'),
    btnExportWorkflows: document.getElementById('btn-export-workflows'),
    activityStreamContainer: document.getElementById('activity-stream-container'),
    deploymentHistoryContainer: document.getElementById('deployment-history-container'),

    // Specific Views
    pipelinesContainer: document.getElementById('pipelines-container'),
    allWorkflowsTbody: document.getElementById('all-workflows-tbody'),
    environmentsDetailedGrid: document.getElementById('environments-detailed-grid'),
    infraCardsContainer: document.getElementById('infra-cards-container'),
    terminalOutput: document.getElementById('terminal-output'),

    // Modals
    logModal: document.getElementById('log-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    modalTerminalBody: document.getElementById('modal-terminal-body'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    btnModalDismiss: document.getElementById('btn-modal-dismiss'),
    btnModalCopy: document.getElementById('btn-modal-copy'),

    triggerRunModal: document.getElementById('trigger-run-modal'),
    triggerModalCloseBtn: document.getElementById('trigger-modal-close-btn'),
    btnCancelTrigger: document.getElementById('btn-cancel-trigger'),
    btnSubmitTrigger: document.getElementById('btn-submit-trigger'),
    triggerWorkflowSelect: document.getElementById('trigger-workflow-select'),
    triggerBranchSelect: document.getElementById('trigger-branch-select'),
    triggerCommitMsg: document.getElementById('trigger-commit-msg'),
    triggerForceFail: document.getElementById('trigger-force-fail'),

    // Settings
    githubApiForm: document.getElementById('github-api-form'),
    ghOwnerRepo: document.getElementById('gh-owner-repo'),
    ghToken: document.getElementById('gh-token'),
    ghUseLiveToggle: document.getElementById('gh-use-live-toggle'),
    btnResetDemoData: document.getElementById('btn-reset-demo-data'),
    ghConnectionStatus: document.getElementById('gh-connection-status'),
    prefRefreshInterval: document.getElementById('pref-refresh-interval'),
    prefSimSpeed: document.getElementById('pref-sim-speed'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // =========================================================================
  // Initialization
  // =========================================================================
  function init() {
    loadSavedTheme();
    loadGitHubSettings();
    setupEventListeners();
    renderAll();
    setupAutoRefresh();

    // Re-render Lucide icons
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // =========================================================================
  // Theme Management
  // =========================================================================
  function loadSavedTheme() {
    const savedTheme = localStorage.getItem('devops_dashboard_theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('devops_dashboard_theme', 'light');
      showToast('Switched to Light Theme', 'info');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('devops_dashboard_theme', 'dark');
      showToast('Switched to Dark Theme', 'info');
    }
    // Update charts for theme contrast
    DevOpsCharts.initAll(state.activeData);
    if (window.lucide) lucide.createIcons();
  }

  // =========================================================================
  // View Switching / Routing
  // =========================================================================
  function switchView(viewName) {
    state.currentView = viewName;

    // Update Sidebar navigation active state
    elements.navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update visible view sections
    elements.viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update Header Breadcrumb Title
    const titleMap = {
      overview: 'Overview',
      pipelines: 'CI/CD Pipelines',
      workflows: 'Workflow Runs',
      deployments: 'Deployments & Releases',
      environments: 'Environments & Infrastructure',
      logs: 'Live Build Logs',
      settings: 'GitHub Integration & Settings',
      docs: 'Documentation & Architecture'
    };
    elements.currentViewTitle.textContent = titleMap[viewName] || 'Overview';

    // Render specific view content on switch
    if (viewName === 'pipelines') renderPipelinesView();
    if (viewName === 'workflows') renderAllWorkflowsView();
    if (viewName === 'deployments') renderDeploymentsView();
    if (viewName === 'environments') renderEnvironmentsView();
    if (viewName === 'logs') streamSampleTerminalLogs();

    // Close mobile sidebar if open
    elements.sidebar.classList.remove('mobile-open');

    if (window.lucide) lucide.createIcons();
  }

  // =========================================================================
  // Rendering Functions
  // =========================================================================
  function renderAll() {
    renderDataSourceIndicator();
    renderKpiCards();
    renderWorkflowRunsTable();
    renderActivityStream();
    renderDeploymentHistory();
    renderLiveTerminal();
    
    // Render Charts
    DevOpsCharts.initAll(state.activeData);

    // Update Last Synced Time
    elements.lastSyncedTime.textContent = new Date().toLocaleTimeString();

    if (window.lucide) lucide.createIcons();
  }

  function renderDataSourceIndicator() {
    if (state.isLiveGitHub) {
      elements.dataSourcePill.innerHTML = `
        <span class="indicator-dot success"></span>
        <span>Live: ${state.activeData.ownerRepo}</span>
      `;
      elements.demoBanner.classList.add('hidden');
    } else {
      elements.dataSourcePill.innerHTML = `
        <span class="indicator-dot warning"></span>
        <span>Simulated Data (Demo Mode)</span>
      `;
    }
  }

  function renderKpiCards() {
    const kpis = state.activeData.kpis;
    
    // 1. Build Status
    elements.metricBuildStatus.textContent = kpis.buildStatus.status;
    elements.metricBuildStatus.className = `stat-value text-${kpis.buildStatus.type}`;

    // 2. Deployment Status
    elements.metricDeployStatus.textContent = kpis.deploymentStatus.version;

    // 3. Total Builds
    elements.metricTotalBuilds.textContent = Number(kpis.totalBuilds).toLocaleString();
    elements.metricAvgDuration.textContent = kpis.avgDuration;

    // 4. Successful Builds
    elements.metricSuccessBuilds.textContent = Number(kpis.successfulBuilds).toLocaleString();
    elements.metricSuccessRate.textContent = `${kpis.successRate}%`;

    // 5. Failed Builds
    elements.metricFailedBuilds.textContent = Number(kpis.failedBuilds).toLocaleString();
  }

  function getStatusBadgeHtml(status) {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'passing':
        return `<span class="badge badge-success"><i data-lucide="check-circle-2"></i> Success</span>`;
      case 'failed':
      case 'failure':
      case 'failing':
        return `<span class="badge badge-danger"><i data-lucide="x-circle"></i> Failed</span>`;
      case 'pending':
      case 'queued':
        return `<span class="badge badge-warning"><i data-lucide="clock"></i> Pending</span>`;
      case 'running':
      case 'in_progress':
        return `<span class="badge badge-warning"><i data-lucide="loader-2"></i> Running</span>`;
      default:
        return `<span class="badge badge-neutral">${status}</span>`;
    }
  }

  function renderWorkflowRunsTable() {
    const runs = state.activeData.workflowRuns || [];
    
    // Apply filters
    const filteredRuns = runs.filter(run => {
      const matchStatus = state.filters.status === 'all' || run.status.toLowerCase() === state.filters.status.toLowerCase();
      const matchBranch = state.filters.branch === 'all' || run.branch.toLowerCase().includes(state.filters.branch.toLowerCase());
      const query = state.filters.search.toLowerCase();
      const matchSearch = !query || 
        run.name.toLowerCase().includes(query) ||
        run.branch.toLowerCase().includes(query) ||
        run.commit.message.toLowerCase().includes(query) ||
        run.commit.sha.toLowerCase().includes(query) ||
        run.commit.author.toLowerCase().includes(query);

      return matchStatus && matchBranch && matchSearch;
    });

    elements.tableShowingCount.textContent = `Showing ${filteredRuns.length} of ${runs.length} runs`;

    if (filteredRuns.length === 0) {
      elements.workflowRunsTbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 32px; color: var(--text-muted);">
            <i data-lucide="inbox" style="width:32px; height:32px; margin-bottom: 8px; opacity:0.5;"></i>
            <p>No workflow runs matched the selected filter criteria.</p>
          </td>
        </tr>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    elements.workflowRunsTbody.innerHTML = filteredRuns.map(run => {
      const dateFormatted = new Date(run.timestamp).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr data-run-id="${run.id}">
          <td>${getStatusBadgeHtml(run.status)}</td>
          <td>
            <div class="workflow-name-cell">
              <i data-lucide="file-code-2" style="width:16px; color:#818cf8;"></i>
              <span>${escapeHtml(run.name)}</span>
            </div>
          </td>
          <td><span class="branch-badge"><i data-lucide="git-branch" style="width:12px;"></i> ${escapeHtml(run.branch)}</span></td>
          <td>
            <div class="commit-cell">
              <span class="commit-message" title="${escapeHtml(run.commit.message)}">${escapeHtml(run.commit.message)}</span>
              <span class="commit-sha">#${run.commit.shortSha} &bull; ${escapeHtml(run.commit.author)}</span>
            </div>
          </td>
          <td><span class="badge badge-neutral">${escapeHtml(run.event)}</span></td>
          <td><i data-lucide="clock" style="width:12px;"></i> ${run.duration}</td>
          <td style="white-space:nowrap;">${dateFormatted}</td>
          <td>
            <button class="btn btn-xs btn-outline btn-view-run-log" data-run-id="${run.id}" title="View step execution logs">
              <i data-lucide="terminal"></i> Logs
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach click handlers to log buttons
    document.querySelectorAll('.btn-view-run-log').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const runId = e.currentTarget.getAttribute('data-run-id');
        openRunLogModal(runId);
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderActivityStream() {
    const activities = state.activeData.activityStream || [];
    elements.activityStreamContainer.innerHTML = activities.map(act => `
      <div class="activity-item">
        <div class="activity-icon-wrap status-${act.type}-bg">
          <i data-lucide="${act.icon}" class="text-${act.type}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-title">${escapeHtml(act.title)}</span>
            <span class="activity-time">${act.time}</span>
          </div>
          <p class="activity-details">${escapeHtml(act.detail)}</p>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  }

  function renderDeploymentHistory() {
    const deployments = state.activeData.deploymentHistory || [];
    elements.deploymentHistoryContainer.innerHTML = deployments.map(dep => {
      const isCurrent = dep.status === 'active';
      return `
        <div class="deployment-item">
          <div class="deploy-icon-wrap ${isCurrent ? 'status-success-bg' : 'status-neutral-bg'}">
            <i data-lucide="${isCurrent ? 'cloud-lightning' : 'archive'}" class="${isCurrent ? 'text-success' : 'text-neutral'}"></i>
          </div>
          <div class="deploy-content">
            <div class="deploy-header">
              <span class="deploy-title">${escapeHtml(dep.version)} &bull; ${escapeHtml(dep.environment)}</span>
              <span class="badge ${isCurrent ? 'badge-success' : 'badge-neutral'}">${dep.status.toUpperCase()}</span>
            </div>
            <p class="deploy-details">${escapeHtml(dep.notes)}</p>
            <div class="step-meta" style="margin-top:6px;">
              <span><i data-lucide="user"></i> ${escapeHtml(dep.deployedBy)}</span>
              <span><i data-lucide="clock"></i> ${dep.deployedAt}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  function renderLiveTerminal() {
    const defaultRun = state.activeData.workflowRuns[0];
    if (!defaultRun || !elements.terminalOutput) return;

    elements.terminalOutput.innerHTML = defaultRun.logs.map(log => `
      <div class="log-line">
        <span class="log-ts">[${log.ts}]</span>
        <span class="log-step">${log.step}:</span>
        <span class="log-${log.type}">${escapeHtml(log.text)}</span>
      </div>
    `).join('');
  }

  function streamSampleTerminalLogs() {
    const runs = state.activeData.workflowRuns;
    if (!runs.length) return;
    const latestRun = runs[0];
    elements.terminalOutput.innerHTML = '';
    
    latestRun.logs.forEach((log, index) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'log-line';
        div.innerHTML = `
          <span class="log-ts">[${new Date().toLocaleTimeString()}]</span>
          <span class="log-step">${log.step}:</span>
          <span class="log-${log.type}">${escapeHtml(log.text)}</span>
        `;
        elements.terminalOutput.appendChild(div);
        elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
      }, index * 250);
    });
  }

  // =========================================================================
  // Sub-Views Dynamic Renderers
  // =========================================================================
  function renderPipelinesView() {
    const pipelines = state.activeData.pipelineDefinitions || [];
    elements.pipelinesContainer.innerHTML = pipelines.map(p => `
      <div class="pipeline-card">
        <div class="pipeline-card-header">
          <div>
            <h3 class="pipeline-card-title">${escapeHtml(p.name)}</h3>
            <span class="pipeline-card-file">${escapeHtml(p.file)}</span>
          </div>
          ${getStatusBadgeHtml(p.status)}
        </div>
        
        <div class="pipeline-stages-pill-row">
          ${p.stages.map(s => `<span class="stage-pill ${p.status === 'passing' ? 'success' : 'failed'}"><i data-lucide="check"></i> ${s}</span>`).join('')}
        </div>

        <div class="step-meta">
          <span><i data-lucide="clock"></i> Last: ${p.lastDuration}</span>
          <span><i data-lucide="activity"></i> ${p.successRate}% Success</span>
        </div>

        <button class="btn btn-sm btn-primary btn-run-single-pipeline" data-pipeline-name="${escapeHtml(p.name)}">
          <i data-lucide="play"></i> Dispatch Workflow
        </button>
      </div>
    `).join('');

    document.querySelectorAll('.btn-run-single-pipeline').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.currentTarget.getAttribute('data-pipeline-name');
        triggerPipelineSimulation({ workflowName: name, shouldFail: name.includes('Security') });
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderAllWorkflowsView() {
    const runs = state.activeData.workflowRuns || [];
    elements.allWorkflowsTbody.innerHTML = runs.map(run => `
      <tr>
        <td>${getStatusBadgeHtml(run.status)}</td>
        <td><strong>${escapeHtml(run.name)}</strong></td>
        <td>#${run.runNumber}</td>
        <td><span class="branch-badge">${escapeHtml(run.branch)}</span></td>
        <td><code>${run.commit.shortSha}</code> - ${escapeHtml(run.commit.message)}</td>
        <td><span class="badge badge-neutral">${escapeHtml(run.event)}</span></td>
        <td>${run.duration}</td>
        <td>${new Date(run.timestamp).toLocaleString()}</td>
        <td>
          <button class="btn btn-xs btn-outline btn-view-run-log" data-run-id="${run.id}">
            <i data-lucide="file-text"></i>
          </button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('#all-workflows-tbody .btn-view-run-log').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openRunLogModal(e.currentTarget.getAttribute('data-run-id'));
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderDeploymentsView() {
    const envs = state.activeData.environments || [];
    elements.environmentsDetailedGrid.innerHTML = envs.map(env => `
      <div class="pipeline-card">
        <div class="pipeline-card-header">
          <div>
            <h3 class="pipeline-card-title">${escapeHtml(env.name)}</h3>
            <span class="pipeline-card-file">${escapeHtml(env.provider)}</span>
          </div>
          <span class="badge badge-success"><i data-lucide="shield-check"></i> ${env.status.toUpperCase()}</span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding: 12px 0; border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle);">
          <div>
            <div style="color:var(--text-muted); font-size:0.72rem;">RELEASE VERSION</div>
            <strong>${env.version}</strong>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.72rem;">UPTIME SLA</div>
            <strong class="text-success">${env.uptime}</strong>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.72rem;">CONTAINER PODS</div>
            <strong>${env.instances} Active</strong>
          </div>
        </div>

        <div class="step-meta">
          <span><i data-lucide="cpu"></i> CPU: ${env.cpuUsage}</span>
          <span><i data-lucide="hard-drive"></i> RAM: ${env.memUsage}</span>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline" style="flex:1;"><i data-lucide="rotate-ccw"></i> Rollback</button>
          <button class="btn btn-sm btn-primary" style="flex:1;"><i data-lucide="refresh-cw"></i> Sync Pods</button>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  }

  function renderEnvironmentsView() {
    elements.infraCardsContainer.innerHTML = `
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <div class="panel-icon"><i data-lucide="container"></i></div>
            <div>
              <h3 class="panel-title">Docker Engine Daemon</h3>
              <p class="panel-subtitle">Alpine 3.20 Nginx Static Runtime</p>
            </div>
          </div>
          <span class="badge badge-success">Running</span>
        </div>
        <p style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:12px;">Lightweight, secure container image running Nginx 1.27 with gzip compression & HTTP/2 support.</p>
        <pre class="code-snippet"><code>Image: devops-dashboard:latest
Ports: 8080:80 (HTTP)
Base: nginx:alpine (24.8MB)</code></pre>
      </div>

      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <div class="panel-icon"><i data-lucide="git-branch"></i></div>
            <div>
              <h3 class="panel-title">GitHub Actions Runner Pool</h3>
              <p class="panel-subtitle">ubuntu-latest Virtual Environments</p>
            </div>
          </div>
          <span class="badge badge-success">Active</span>
        </div>
        <p style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:12px;">Managed Linux runners with Node.js 20, Python 3.12, and Docker toolchains pre-installed.</p>
        <pre class="code-snippet"><code>Runner: Hosted GitHub Action
Concurrent Jobs: 20
Avg Queue Latency: 1.8s</code></pre>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }

  // =========================================================================
  // Pipeline Simulation Engine (Interactive Demo)
  // =========================================================================
  async function triggerPipelineSimulation(options = {}) {
    if (state.isSimulating) {
      showToast('A pipeline run is already in progress!', 'warning');
      return;
    }

    state.isSimulating = true;
    const workflowName = options.workflowName || 'CI/CD Build & Validate';
    const branch = options.branch || 'main';
    const commitMsg = options.commitMsg || 'Automated CI/CD validation run';
    const shouldFail = options.shouldFail || false;
    const speed = state.preferences.simSpeedMs || 1500;

    showToast(`Started pipeline: "${workflowName}" on branch [${branch}]`, 'info');

    // Switch to Overview to watch visual progression if in another tab
    if (state.currentView !== 'overview') {
      switchView('overview');
    }

    const randomSha = Math.random().toString(16).substring(2, 9);
    elements.pipelineActiveSha.textContent = randomSha;

    const stages = [
      { el: elements.stageCode, name: '1. Code & Checkout' },
      { el: elements.stageBuild, name: '2. Build & Package' },
      { el: elements.stageTest, name: '3. Automated Tests' },
      { el: elements.stageDeploy, name: '4. Deployment' }
    ];

    // Reset all stages to pending
    stages.forEach(st => {
      st.el.className = 'pipeline-step-item pending';
      const tag = st.el.querySelector('.step-status-tag');
      if (tag) {
        tag.className = 'step-status-tag pending';
        tag.textContent = 'Pending';
      }
    });

    // Animate stage by stage
    for (let i = 0; i < stages.length; i++) {
      const current = stages[i];
      current.el.className = 'pipeline-step-item running';
      const tag = current.el.querySelector('.step-status-tag');
      if (tag) {
        tag.className = 'step-status-tag running';
        tag.textContent = 'Running...';
      }

      await sleep(speed);

      // Check for simulated failure at Test stage
      if (shouldFail && i === 2) {
        current.el.className = 'pipeline-step-item failed';
        if (tag) {
          tag.className = 'step-status-tag failed';
          tag.textContent = 'Failed';
        }
        showToast(`Pipeline Failed at "${current.name}"`, 'danger');
        recordNewWorkflowRun(workflowName, branch, randomSha, commitMsg, 'failed', shouldFail);
        state.isSimulating = false;
        return;
      }

      current.el.className = 'pipeline-step-item completed';
      if (tag) {
        tag.className = 'step-status-tag success';
        tag.textContent = 'Completed';
      }
    }

    showToast('Pipeline execution finished successfully!', 'success');
    recordNewWorkflowRun(workflowName, branch, randomSha, commitMsg, 'success', shouldFail);
    state.isSimulating = false;
  }

  function recordNewWorkflowRun(workflowName, branch, sha, message, status, simulatedFail) {
    const newRunNumber = (state.activeData.workflowRuns[0]?.runNumber || 1428) + 1;
    const now = new Date();
    const durationSec = status === 'success' ? Math.floor(Math.random() * 80) + 120 : 65;
    const durationFormatted = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;

    const newRun = {
      id: `run-${newRunNumber}`,
      name: workflowName,
      runNumber: newRunNumber,
      branch: branch,
      commit: {
        sha: sha,
        shortSha: sha,
        message: message,
        author: 'DevOps Simulator'
      },
      event: 'workflow_dispatch',
      status: status,
      duration: durationFormatted,
      durationSec: durationSec,
      timestamp: now.toISOString(),
      logs: [
        { ts: now.toLocaleTimeString(), step: "Workflow Trigger", type: "info", text: `Dispatched ${workflowName} by user` },
        { ts: now.toLocaleTimeString(), step: "Code Checkout", type: "success", text: `Checked out commit ${sha} on branch ${branch}` },
        { ts: now.toLocaleTimeString(), step: "Docker Build", type: "info", text: `Built image devops-dashboard:${sha}` },
        { 
          ts: now.toLocaleTimeString(), 
          step: "Automated Verification", 
          type: status === 'success' ? 'success' : 'error', 
          text: status === 'success' ? "All 142 checks passed successfully (100% OK)." : "Test assertion error: Simulated failure in security scanner." 
        },
        { 
          ts: now.toLocaleTimeString(), 
          step: "Conclusion", 
          type: status === 'success' ? 'success' : 'error', 
          text: status === 'success' ? "Deployed to edge cluster. Exit code: 0." : "Workflow failed with exit code: 1." 
        }
      ]
    };

    // Prepend to workflow runs list
    state.activeData.workflowRuns.unshift(newRun);

    // Update KPI counters
    state.activeData.kpis.totalBuilds += 1;
    if (status === 'success') {
      state.activeData.kpis.successfulBuilds += 1;
    } else {
      state.activeData.kpis.failedBuilds += 1;
    }
    const total = state.activeData.kpis.totalBuilds;
    const succ = state.activeData.kpis.successfulBuilds;
    state.activeData.kpis.successRate = ((succ / total) * 100).toFixed(1);

    // Add to activity stream
    state.activeData.activityStream.unshift({
      id: `act-${Date.now()}`,
      icon: status === 'success' ? 'check-circle' : 'alert-octagon',
      type: status === 'success' ? 'success' : 'danger',
      title: `${workflowName} Run #${newRunNumber} ${status === 'success' ? 'Passed' : 'Failed'}`,
      detail: `Branch ${branch} (commit #${sha}) &bull; Duration ${durationFormatted}`,
      time: 'Just now'
    });

    renderAll();
  }

  // =========================================================================
  // Modal Handlers
  // =========================================================================
  function openRunLogModal(runId) {
    const run = state.activeData.workflowRuns.find(r => r.id === runId);
    if (!run) return;

    elements.modalTitle.textContent = `Logs: ${run.name} (#${run.runNumber})`;
    elements.modalSubtitle.textContent = `Branch: ${run.branch} • Commit #${run.commit.shortSha} • Duration: ${run.duration} • ${run.status.toUpperCase()}`;
    
    elements.modalTerminalBody.innerHTML = run.logs.map(log => `
      <div class="log-line">
        <span class="log-ts">[${log.ts}]</span>
        <span class="log-step">${log.step}:</span>
        <span class="log-${log.type}">${escapeHtml(log.text)}</span>
      </div>
    `).join('');

    elements.logModal.classList.add('open');
    elements.logModal.setAttribute('aria-hidden', 'false');
  }

  function closeModals() {
    elements.logModal.classList.remove('open');
    elements.logModal.setAttribute('aria-hidden', 'true');
    elements.triggerRunModal.classList.remove('open');
    elements.triggerRunModal.setAttribute('aria-hidden', 'true');
  }

  // =========================================================================
  // Settings & GitHub Integration
  // =========================================================================
  function loadGitHubSettings() {
    const config = GitHubAPI.getConfig();
    if (config.ownerRepo) {
      elements.ghOwnerRepo.value = config.ownerRepo;
      elements.ghToken.value = config.token || '';
      elements.ghUseLiveToggle.checked = config.enabled || false;

      if (config.enabled) {
        connectToGitHubAPI(config.ownerRepo, config.token, false);
      }
    }
  }

  async function connectToGitHubAPI(ownerRepo, token, showToasts = true) {
    elements.ghConnectionStatus.style.display = 'block';
    elements.ghConnectionStatus.innerHTML = `<span class="status-pulse-dot warning"></span> Connecting to GitHub REST API for <code>${escapeHtml(ownerRepo)}</code>...`;

    try {
      const liveData = await GitHubAPI.fetchWorkflowRuns(ownerRepo, token);
      
      // Update global active data
      state.activeData = {
        ...window.DevOpsData,
        ...liveData,
        ownerRepo: ownerRepo
      };
      state.isLiveGitHub = true;

      // Save valid config
      GitHubAPI.saveConfig({ ownerRepo, token, enabled: true });

      elements.ghConnectionStatus.innerHTML = `
        <span class="text-success" style="font-weight:600;"><i data-lucide="check-circle-2"></i> Connected Successfully!</span>
        <p style="margin-top:4px; color:var(--text-secondary);">Fetched <strong>${liveData.workflowRuns.length}</strong> real GitHub Actions workflow runs from <code>${escapeHtml(ownerRepo)}</code>.</p>
      `;

      renderAll();
      if (showToasts) showToast(`Connected to GitHub Actions for ${ownerRepo}`, 'success');

    } catch (err) {
      console.error('GitHub API Connection Error:', err);
      elements.ghConnectionStatus.innerHTML = `
        <span class="text-danger" style="font-weight:600;"><i data-lucide="alert-octagon"></i> Connection Failed</span>
        <p style="margin-top:4px; color:var(--text-secondary);">${escapeHtml(err.message)}</p>
      `;
      if (showToasts) showToast(`GitHub Connection Error: ${err.message}`, 'danger');
    }

    if (window.lucide) lucide.createIcons();
  }

  function resetToDemoData() {
    state.activeData = { ...window.DevOpsData };
    state.isLiveGitHub = false;
    elements.ghUseLiveToggle.checked = false;
    GitHubAPI.saveConfig({ ownerRepo: '', token: '', enabled: false });
    elements.ghConnectionStatus.style.display = 'none';
    elements.demoBanner.classList.remove('hidden');
    renderAll();
    showToast('Reset dashboard to simulated demo telemetry data.', 'info');
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconMap = {
      success: 'check-circle',
      danger: 'alert-triangle',
      warning: 'alert-circle',
      info: 'info'
    };

    toast.innerHTML = `
      <i data-lucide="${iconMap[type] || 'info'}" class="text-${type}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // =========================================================================
  // Auto-Refresh
  // =========================================================================
  function setupAutoRefresh() {
    if (state.refreshTimer) clearInterval(state.refreshTimer);

    if (state.preferences.refreshInterval > 0) {
      state.refreshTimer = setInterval(() => {
        refreshDashboardData(false);
      }, state.preferences.refreshInterval);
    }
  }

  async function refreshDashboardData(showUserToast = true) {
    elements.refreshIcon.style.animation = 'spin-slow 1s linear infinite';

    if (state.isLiveGitHub) {
      const config = GitHubAPI.getConfig();
      await connectToGitHubAPI(config.ownerRepo, config.token, false);
    } else {
      // Simulate minor telemetry jitter for demo feel
      state.activeData.kpis.avgDurationSec += (Math.random() > 0.5 ? 1 : -1);
      elements.lastSyncedTime.textContent = new Date().toLocaleTimeString();
      renderKpiCards();
    }

    setTimeout(() => {
      elements.refreshIcon.style.animation = '';
      if (showUserToast) showToast('Dashboard telemetry data refreshed.', 'info');
    }, 600);
  }

  // =========================================================================
  // Event Listeners Setup
  // =========================================================================
  function setupEventListeners() {
    // Navigation items
    elements.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        switchView(view);
      });
    });

    // Theme Toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Sidebar Collapse
    elements.sidebarToggleBtn.addEventListener('click', () => {
      elements.sidebar.classList.toggle('collapsed');
    });

    // Mobile Menu Toggle
    elements.mobileMenuBtn.addEventListener('click', () => {
      elements.sidebar.classList.toggle('mobile-open');
    });

    // Dismiss Demo Banner
    elements.btnDismissBanner.addEventListener('click', () => {
      elements.demoBanner.classList.add('hidden');
    });

    // Trigger Demo Build Quick Buttons
    elements.btnTriggerDemoBuild.addEventListener('click', () => {
      triggerPipelineSimulation();
    });
    elements.btnSimulateFlow.addEventListener('click', () => {
      triggerPipelineSimulation();
    });

    // Open Trigger Custom Build Modal
    elements.btnNewPipelineRun.addEventListener('click', () => {
      elements.triggerRunModal.classList.add('open');
      elements.triggerRunModal.setAttribute('aria-hidden', 'false');
    });

    // Modal Close buttons
    elements.modalCloseBtn.addEventListener('click', closeModals);
    elements.btnModalDismiss.addEventListener('click', closeModals);
    elements.triggerModalCloseBtn.addEventListener('click', closeModals);
    elements.btnCancelTrigger.addEventListener('click', closeModals);

    // Click outside modal to close
    window.addEventListener('click', (e) => {
      if (e.target === elements.logModal || e.target === elements.triggerRunModal) {
        closeModals();
      }
    });

    // Submit Custom Trigger Form
    elements.btnSubmitTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const workflowName = elements.triggerWorkflowSelect.value;
      const branch = elements.triggerBranchSelect.value;
      const commitMsg = elements.triggerCommitMsg.value || 'Manual pipeline trigger';
      const shouldFail = elements.triggerForceFail.checked;

      closeModals();
      triggerPipelineSimulation({ workflowName, branch, commitMsg, shouldFail });
    });

    // Manual Refresh Button
    elements.btnRefreshData.addEventListener('click', () => {
      refreshDashboardData(true);
    });

    // Table Filters
    elements.filterWorkflowStatus.addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      renderWorkflowRunsTable();
    });

    elements.filterWorkflowBranch.addEventListener('change', (e) => {
      state.filters.branch = e.target.value;
      renderWorkflowRunsTable();
    });

    // Global Search with Debounce
    elements.globalSearchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      renderWorkflowRunsTable();
    });

    // Keyboard shortcut (Ctrl+K or Cmd+K) for search
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        elements.globalSearchInput.focus();
      }
      if (e.key === 'Escape') {
        closeModals();
      }
    });

    // Export Workflows to JSON
    elements.btnExportWorkflows.addEventListener('click', () => {
      const jsonStr = JSON.stringify(state.activeData.workflowRuns, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-runs-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported workflow runs to JSON', 'success');
    });

    // Copy Modal Logs
    elements.btnModalCopy.addEventListener('click', () => {
      const text = elements.modalTerminalBody.innerText;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Logs copied to clipboard', 'success');
      });
    });

    // GitHub Settings Form Submit
    elements.githubApiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ownerRepo = elements.ghOwnerRepo.value.trim();
      const token = elements.ghToken.value.trim();
      if (!ownerRepo) {
        showToast('Please specify a repository (owner/repo)', 'warning');
        return;
      }
      connectToGitHubAPI(ownerRepo, token, true);
    });

    // Reset Demo Data
    elements.btnResetDemoData.addEventListener('click', resetToDemoData);

    // Refresh interval preference
    elements.prefRefreshInterval.addEventListener('change', (e) => {
      state.preferences.refreshInterval = parseInt(e.target.value, 10);
      setupAutoRefresh();
      showToast('Updated refresh interval preference', 'info');
    });

    // Simulation speed preference
    elements.prefSimSpeed.addEventListener('change', (e) => {
      const val = e.target.value;
      state.preferences.simSpeedMs = val === 'fast' ? 1000 : val === 'real' ? 4000 : 2000;
      showToast(`Simulation speed set to: ${val}`, 'info');
    });
  }

  // =========================================================================
  // Helper Functions
  // =========================================================================
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start the application
  init();
});
