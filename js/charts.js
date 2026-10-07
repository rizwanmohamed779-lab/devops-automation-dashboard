/**
 * DevOps Automation Dashboard - Charts Module (Chart.js Integration)
 */

window.DevOpsCharts = (function() {
  let trendsChartInstance = null;
  let doughnutChartInstance = null;

  // Chart Theme Palettes
  const colors = {
    accent: '#6366f1',
    accentLight: 'rgba(99, 102, 241, 0.2)',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#38bdf8',
    gridDark: 'rgba(255, 255, 255, 0.06)',
    textMuted: '#94a3b8'
  };

  /**
   * Initialize or update the Build Trends Chart
   */
  function initTrendsChart(data) {
    const canvas = document.getElementById('chart-build-trends');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    if (trendsChartInstance) {
      trendsChartInstance.destroy();
    }

    // Create subtle gradient for build counts
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    trendsChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.trends.labels,
        datasets: [
          {
            label: 'Total Builds',
            data: data.trends.buildCounts,
            borderColor: colors.accent,
            backgroundColor: gradient,
            borderWidth: 2.5,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: colors.accent,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
          },
          {
            label: 'Avg Duration (sec)',
            data: data.trends.avgDurationsSec,
            borderColor: colors.info,
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.2,
            fill: false,
            pointBackgroundColor: colors.info,
            pointRadius: 3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              color: colors.textMuted,
              font: { family: 'Inter', size: 11, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: 'Inter', size: 12, weight: '700' },
            bodyFont: { family: 'Inter', size: 11 }
          }
        },
        scales: {
          x: {
            grid: { color: colors.gridDark, drawBorder: false },
            ticks: { color: colors.textMuted, font: { family: 'Inter', size: 11 } }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: colors.gridDark, drawBorder: false },
            ticks: { color: colors.textMuted, font: { family: 'Inter', size: 11 } },
            title: { display: true, text: 'Build Count', color: colors.textMuted, font: { size: 10 } }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: colors.info, font: { family: 'Inter', size: 11 } },
            title: { display: true, text: 'Duration (s)', color: colors.info, font: { size: 10 } }
          }
        }
      }
    });
  }

  /**
   * Initialize or update Workflow Health Doughnut Chart
   */
  function initDoughnutChart(data) {
    const canvas = document.getElementById('chart-build-doughnut');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    if (doughnutChartInstance) {
      doughnutChartInstance.destroy();
    }

    const successful = data.kpis.successfulBuilds || 1379;
    const failed = data.kpis.failedBuilds || 49;
    const pending = 12; // active queue sample

    doughnutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Successful', 'Failed', 'Pending / In Progress'],
        datasets: [
          {
            data: [successful, failed, pending],
            backgroundColor: [colors.success, colors.danger, colors.warning],
            borderColor: '#1e293b',
            borderWidth: 3,
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              color: colors.textMuted,
              padding: 16,
              font: { family: 'Inter', size: 11, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                const total = successful + failed + pending;
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Initialize all dashboard charts
   */
  function initAll(data) {
    initTrendsChart(data);
    initDoughnutChart(data);
  }

  return {
    initAll,
    initTrendsChart,
    initDoughnutChart
  };
})();
