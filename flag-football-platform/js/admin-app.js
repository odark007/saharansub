// Admin App
const API_BASE_URL = 'http://localhost:3000';

// Show/hide sections
window.showSection = function(section) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav button').forEach(b => b.classList.remove('active'));
  
  // Show selected section
  document.getElementById(`section-${section}`).classList.add('active');
  document.getElementById(`btn-${section}`).classList.add('active');
  
  // Load data for section
  if (section === 'dashboard') loadStats();
  if (section === 'rulebooks') loadRulebooks();
  if (section === 'reports') loadReports();
};

// Load statistics
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
    const result = await response.json();
    
    if (result.success) {
      const stats = result.data;
      document.getElementById('stats-container').innerHTML = `
        <div class="stat-card">
          <div class="stat-value">${stats.rulebooks}</div>
          <div class="stat-label">Rulebooks</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.rules}</div>
          <div class="stat-label">Total Rules</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.users}</div>
          <div class="stat-label">Registered Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.pendingReports}</div>
          <div class="stat-label">Pending Reports</div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
    showToast('Failed to load statistics', 'error');
  }
}

// Load rulebooks
async function loadRulebooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rulebooks`);
    const result = await response.json();
    
    if (result.success) {
      const rulebooks = result.data;
      
      if (rulebooks.length === 0) {
        document.getElementById('rulebooks-container').innerHTML = `
          <div class="card">
            <div class="card-body" style="text-align: center; padding: 40px;">
              <i class="fas fa-book" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
              <p style="color: #666;">No rulebooks uploaded yet.</p>
              <button class="btn btn-primary" onclick="showSection('upload')" style="margin-top: 16px;">
                <i class="fas fa-upload"></i> Upload First Rulebook
              </button>
            </div>
          </div>
        `;
        return;
      }
      
      document.getElementById('rulebooks-container').innerHTML = `
        <div class="rulebook-list">
          ${rulebooks.map(rb => `
            <div class="rulebook-item">
              <div>
                <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #013369;">
                  ${rb.name}
                </h3>
                <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">
                  Version ${rb.version} • 
                  <span class="tag tag-${rb.status === 'active' ? 'success' : 'secondary'}">${rb.status}</span> • 
                  Added ${new Date(rb.created_at).toLocaleDateString()}
                </p>
              </div>
              <div class="rulebook-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewRulebook('${rb.id}')">
                  <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRulebook('${rb.id}', '${rb.name}')">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to load rulebooks:', error);
    showToast('Failed to load rulebooks', 'error');
  }
}

// Load error reports
async function loadReports() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/error-reports`);
    const result = await response.json();
    
    if (result.success) {
      const reports = result.data;
      
      if (reports.length === 0) {
        document.getElementById('reports-container').innerHTML = `
          <div class="card">
            <div class="card-body" style="text-align: center; padding: 40px;">
              <i class="fas fa-check-circle" style="font-size: 48px; color: #28A745; margin-bottom: 16px;"></i>
              <p style="color: #666;">No error reports. Everything looks good!</p>
            </div>
          </div>
        `;
        return;
      }
      
      document.getElementById('reports-container').innerHTML = `
        <div style="display: grid; gap: 16px;">
          ${reports.map(report => `
            <div class="card">
              <div class="card-body">
                <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                  <div>
                    <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: #013369;">
                      ${report.rules?.title || 'Unknown Rule'}
                    </h4>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">
                      ${report.rulebooks?.name || 'Unknown Rulebook'} • 
                      Reported by ${report.user_role || 'Anonymous'}
                    </p>
                  </div>
                  <span class="tag tag-${report.status === 'pending' ? 'warning' : 'success'}">
                    ${report.status}
                  </span>
                </div>
                <p style="color: #333; margin-bottom: 12px;">${report.description}</p>
                <p style="font-size: 12px; color: #999;">
                  ${new Date(report.created_at).toLocaleString()}
                </p>
                ${report.status === 'pending' ? `
                  <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button class="btn btn-primary btn-sm" onclick="updateReportStatus('${report.id}', 'reviewed')">
                      Mark Reviewed
                    </button>
                    <button class="btn btn-success btn-sm" onclick="updateReportStatus('${report.id}', 'resolved')">
                      Mark Resolved
                    </button>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to load reports:', error);
    showToast('Failed to load reports', 'error');
  }
}

// File upload handling
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('pdf-file');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type === 'application/pdf') {
    fileInput.files = files;
    showFileInfo(files[0]);
  } else {
    showToast('Please drop a PDF file', 'warning');
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    showFileInfo(e.target.files[0]);
  }
});

function showFileInfo(file) {
  fileName.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
  fileInfo.style.display = 'block';
}

window.clearFile = function() {
  fileInput.value = '';
  fileInfo.style.display = 'none';
};

// Upload form submission
document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('rulebook-name').value;
  const version = document.getElementById('rulebook-version').value;
  const file = fileInput.files[0];
  
  if (!file) {
    showToast('Please select a PDF file', 'warning');
    return;
  }
  
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('name', name);
  formData.append('version', version);
  
  // Show progress
  document.getElementById('upload-progress').style.display = 'block';
  document.querySelector('#upload-form button[type="submit"]').disabled = true;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/pdf/upload`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      document.getElementById('progress-bar').style.width = '100%';
      document.getElementById('progress-text').textContent = '100%';
      document.getElementById('progress-message').textContent = 'Processing complete!';
      
      showToast(`Successfully uploaded: ${name}`, 'success');
      
      // Reset form
      document.getElementById('upload-form').reset();
      clearFile();
      document.getElementById('upload-progress').style.display = 'none';
      
      // Show rulebooks
      setTimeout(() => {
        showSection('rulebooks');
      }, 2000);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Upload error:', error);
    showToast('Upload failed: ' + error.message, 'error');
    document.getElementById('upload-progress').style.display = 'none';
  } finally {
    document.querySelector('#upload-form button[type="submit"]').disabled = false;
  }
});

// View rulebook
window.viewRulebook = function(id) {
  window.open(`./index.html#/rulebook/${id}`, '_blank');
};

// Delete rulebook
window.deleteRulebook = async function(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rulebooks/${id}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Rulebook deleted successfully', 'success');
      loadRulebooks();
      loadStats();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Failed to delete rulebook', 'error');
  }
};

// Update report status
window.updateReportStatus = async function(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/error-reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast(`Report marked as ${status}`, 'success');
      loadReports();
      loadStats();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Update error:', error);
    showToast('Failed to update report', 'error');
  }
};

// Toast notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="fas ${iconMap[type]}"></i>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.remove(), 5000);
}

// Load initial dashboard
loadStats();