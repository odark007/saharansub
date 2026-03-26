import { MOCK_RULEBOOKS, MOCK_STATS } from './mock-data.js';

// API calls to backend server
const API_BASE_URL =
  (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) ||
  window.__API_BASE_URL__ ||
  `${window.location.protocol}//${window.location.host}`;

const ENABLE_LOCAL_MOCKS = Boolean(window.APP_CONFIG && window.APP_CONFIG.ENABLE_LOCAL_MOCKS);

async function requestJson(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed (${response.status}): ${text || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: backend unavailable or blocked by CORS.');
    }
    throw error;
  }
}

  

// Fetch all rulebooks
export async function fetchRulebooks() {
  try {
    const result = await requestJson('/api/admin/rulebooks');
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    if (ENABLE_LOCAL_MOCKS) {
      console.warn('Using local mock rulebooks due to API failure:', error.message);
      return MOCK_RULEBOOKS;
    }
    console.error('Fetch rulebooks error:', error);
    throw error;
  }
}

// Fetch single rulebook with full structure
export async function fetchRulebook(rulebookId) {
  try {
    const result = await requestJson(`/api/admin/rulebooks/${rulebookId}`);
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Fetch rulebook error:', error);
    throw error;
  }
}

// Fetch platform statistics
export async function fetchStats() {
  try {
    const result = await requestJson('/api/admin/stats');
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    if (ENABLE_LOCAL_MOCKS) {
      console.warn('Using local mock stats due to API failure:', error.message);
      return MOCK_STATS;
    }
    console.error('Fetch stats error:', error);
    throw error;
  }
}

// Upload PDF rulebook
export async function uploadPDF(file, name, version) {
  try {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('name', name);
    formData.append('version', version);

    const result = await requestJson('/api/pdf/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Upload PDF error:', error);
    throw error;
  }
}

// Add video to rule
export async function addVideo(ruleId, youtubeUrl) {
  try {
    const result = await requestJson('/api/admin/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ruleId, youtubeUrl })
    });
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Add video error:', error);
    throw error;
  }
}

// Fetch error reports
export async function fetchErrorReports() {
  try {
    const result = await requestJson('/api/admin/error-reports');
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Fetch error reports error:', error);
    throw error;
  }
}

// Update error report status
export async function updateErrorReportStatus(reportId, status) {
  try {
    const result = await requestJson(`/api/admin/error-reports/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Update error report error:', error);
    throw error;
  }
}