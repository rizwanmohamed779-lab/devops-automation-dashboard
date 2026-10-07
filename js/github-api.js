/**
 * DevOps Automation Dashboard - GitHub Actions REST API Integration Module
 * Enables fetching real live workflow runs from any public or private GitHub repository.
 */

window.GitHubAPI = (function() {
  const STORAGE_KEY = 'devops_dashboard_gh_config';

  /**
   * Load saved GitHub API configuration from localStorage
   */
  function getConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { ownerRepo: '', token: '', enabled: false };
    } catch (e) {
      console.warn('Unable to read GitHub config from localStorage', e);
      return { ownerRepo: '', token: '', enabled: false };
    }
  }

  /**
   * Save GitHub API configuration to localStorage
   */
  function saveConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Unable to save GitHub config to localStorage', e);
    }
  }

  /**
   * Format duration in seconds to "Xm Ys"
   */
  function formatDuration(sec) {
    if (!sec || isNaN(sec) || sec < 0) return '0s';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  /**
   * Map GitHub Actions run status/conclusion to dashboard standard status
   */
  function mapStatus(status, conclusion) {
    if (status === 'in_progress' || status === 'queued') {
      return status === 'queued' ? 'pending' : 'running';
    }
    if (conclusion === 'success') return 'success';
    if (conclusion === 'failure' || conclusion === 'timed_out') return 'failed';
    if (conclusion === 'cancelled') return 'failed';
    return 'pending';
  }

  /**
   * Fetch Workflow Runs from GitHub Actions REST API
   * @param {string} ownerRepo - "owner/repo"
   * @param {string} token - Optional PAT token
   * @returns {Promise<object>} Transformed telemetry data
   */
  async function fetchWorkflowRuns(ownerRepo, token) {
    if (!ownerRepo || !ownerRepo.includes('/')) {
      throw new Error('Please specify a valid repository in the format "owner/repo" (e.g. octocat/Hello-World)');
    }

    const [owner, repo] = ownerRepo.trim().split('/');
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=15`;
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };

    if (token && token.trim()) {
      headers['Authorization'] = `token ${token.trim()}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository "${ownerRepo}" not found or GitHub Actions is not enabled.`);
      } else if (response.status === 403) {
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        const resetMsg = rateLimitReset ? ` Rate limit resets at ${new Date(rateLimitReset * 1000).toLocaleTimeString()}.` : '';
        throw new Error(`GitHub API rate limit exceeded or access forbidden.${resetMsg} Provide a Personal Access Token in settings.`);
      } else {
        throw new Error(`GitHub API returned HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    const rawRuns = data.workflow_runs || [];

    // Calculate aggregated metrics from real GitHub runs
    let totalBuilds = rawRuns.length;
    let successfulBuilds = 0;
    let failedBuilds = 0;
    let totalDurationSec = 0;

    const transformedRuns = rawRuns.map(run => {
      const createdAt = new Date(run.created_at);
      const updatedAt = new Date(run.updated_at);
      const durationSec = Math.max(1, Math.round((updatedAt - createdAt) / 1000));
      const status = mapStatus(run.status, run.conclusion);

      if (status === 'success') successfulBuilds++;
      if (status === 'failed') failedBuilds++;
      totalDurationSec += durationSec;

      return {
        id: `gh-run-${run.id}`,
        name: run.name || 'GitHub Workflow',
        runNumber: run.run_number,
        branch: run.head_branch || 'main',
        commit: {
          sha: run.head_sha || 'unknown',
          shortSha: (run.head_sha || 'unknown').substring(0, 7),
          message: run.head_commit?.message || 'Workflow run commit',
          author: run.head_commit?.author?.name || run.actor?.login || 'GitHub User'
        },
        event: run.event || 'push',
        status: status,
        duration: formatDuration(durationSec),
        durationSec: durationSec,
        timestamp: run.created_at,
        htmlUrl: run.html_url,
        logs: [
          { ts: createdAt.toLocaleTimeString(), step: "Job Trigger", type: "info", text: `Event: ${run.event} on branch ${run.head_branch}` },
          { ts: createdAt.toLocaleTimeString(), step: "Runner Assignment", type: "info", text: `Workflow Run #${run.run_number} (${run.name})` },
          { ts: updatedAt.toLocaleTimeString(), step: "Conclusion", type: status === 'success' ? 'success' : 'error', text: `Completed with status: ${run.status} (${run.conclusion || 'pending'})` }
        ]
      };
    });

    const successRate = totalBuilds > 0 ? ((successfulBuilds / totalBuilds) * 100).toFixed(1) : "0.0";
    const avgDurationSec = totalBuilds > 0 ? Math.round(totalDurationSec / totalBuilds) : 0;

    // Return transformed data structure matching DevOpsData
    return {
      isDemoData: false,
      ownerRepo: ownerRepo,
      lastUpdated: new Date().toISOString(),
      kpis: {
        buildStatus: {
          status: successfulBuilds >= failedBuilds ? "Passing" : "Failing",
          type: successfulBuilds >= failedBuilds ? "success" : "danger",
          detail: `${successfulBuilds} of ${totalBuilds} recent runs passed on GitHub`,
          score: totalBuilds > 0 ? Math.round((successfulBuilds / totalBuilds) * 100) : 0
        },
        deploymentStatus: {
          version: `Live (${ownerRepo})`,
          environment: "GitHub Actions",
          timeAgo: "Real-time sync",
          type: "info"
        },
        totalBuilds: totalBuilds,
        successfulBuilds: successfulBuilds,
        failedBuilds: failedBuilds,
        successRate: parseFloat(successRate),
        avgDuration: formatDuration(avgDurationSec),
        avgDurationSec: avgDurationSec
      },
      workflowRuns: transformedRuns,
      // Retain structure for views
      trends: {
        labels: transformedRuns.slice(0, 7).reverse().map(r => `#${r.runNumber}`),
        buildCounts: transformedRuns.slice(0, 7).reverse().map(() => 1),
        avgDurationsSec: transformedRuns.slice(0, 7).reverse().map(r => r.durationSec),
        successCounts: transformedRuns.slice(0, 7).reverse().map(r => r.status === 'success' ? 1 : 0),
        failedCounts: transformedRuns.slice(0, 7).reverse().map(r => r.status === 'failed' ? 1 : 0)
      }
    };
  }

  return {
    getConfig,
    saveConfig,
    fetchWorkflowRuns
  };
})();
