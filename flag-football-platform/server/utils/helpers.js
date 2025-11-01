// Helper Functions

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Clean text (remove extra whitespace, normalize)
export function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

// Extract tags from text content
export function extractTags(text, title) {
  const allText = `${title} ${text}`.toLowerCase();
  const tagKeywords = {
    'penalty': ['penalty', 'penalties', 'foul', 'violation'],
    'scoring': ['score', 'scoring', 'touchdown', 'point', 'points'],
    'equipment': ['equipment', 'ball', 'flag', 'belt', 'uniform'],
    'field': ['field', 'yard', 'line', 'boundary', 'sideline'],
    'timing': ['time', 'clock', 'timeout', 'quarter', 'half'],
    'possession': ['possession', 'down', 'drive', 'turnover'],
    'substitution': ['substitution', 'substitute', 'player change'],
    'safety': ['safety', 'injury', 'protection', 'illegal contact']
  };

  const foundTags = [];
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      foundTags.push(tag);
    }
  }

  return foundTags;
}

// Determine difficulty level based on section title or content
export function determineDifficultyLevel(sectionTitle, order) {
  const title = sectionTitle.toLowerCase();
  
  if (title.includes('basic') || title.includes('introduction') || title.includes('getting started')) {
    return 'basic';
  }
  
  if (title.includes('advanced') || title.includes('expert') || title.includes('official')) {
    return 'advanced';
  }
  
  // Use order as fallback
  if (order <= 3) return 'basic';
  if (order > 6) return 'advanced';
  
  return 'intermediate';
}

// Success response helper
export function successResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data
  };
}

// Error response helper
export function errorResponse(message, error = null) {
  return {
    success: false,
    message,
    error: error ? error.message : null
  };
}

// Validate rulebook data
export function validateRulebookData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Rulebook name is required');
  }
  
  if (!data.version || data.version.trim() === '') {
    errors.push('Version is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}