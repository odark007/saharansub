// API calls to backend server
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'  // Local development
  : 'http://localhost:3000';  // Production backend Backend not deployed yet

  

// Fetch all rulebooks
export async function fetchRulebooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rulebooks`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Fetch rulebooks error:', error);
    throw error;
  }
}

// Fetch single rulebook with full structure
export async function fetchRulebook(rulebookId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rulebooks/${rulebookId}`);
    const result = await response.json();
    
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
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
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

    const response = await fetch(`${API_BASE_URL}/api/pdf/upload`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
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
    const response = await fetch(`${API_BASE_URL}/api/admin/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ruleId, youtubeUrl })
    });

    const result = await response.json();
    
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
    const response = await fetch(`${API_BASE_URL}/api/admin/error-reports`);
    const result = await response.json();
    
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
    const response = await fetch(`${API_BASE_URL}/api/admin/error-reports/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Update error report error:', error);
    throw error;
  }
}