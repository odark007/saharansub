// PDF Upload Routes
import express from 'express';
import multer from 'multer';
import { PDFParser } from '../services/pdfParser.js';
import { successResponse, errorResponse, validateRulebookData } from '../utils/helpers.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// POST /api/pdf/upload
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse('No PDF file uploaded'));
    }

    const { name, version } = req.body;

    // Validate input
    const validation = validateRulebookData({ name, version });
    if (!validation.isValid) {
      return res.status(400).json(errorResponse(validation.errors.join(', ')));
    }

    console.log(`Processing PDF: ${name} v${version}`);

    // Parse PDF
    const parser = new PDFParser();
    const result = await parser.parsePDF(req.file.buffer, name, version);

    res.json(successResponse(result, 'PDF processed successfully'));

  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json(errorResponse('Failed to process PDF', error));
  }
});

// GET /api/pdf/status/:rulebookId
router.get('/status/:rulebookId', async (req, res) => {
  try {
    const { rulebookId } = req.params;
    
    const { supabase } = await import('../services/supabase.js');
    
    const { data, error } = await supabase
      .from('rulebooks')
      .select('id, name, version, status, created_at')
      .eq('id', rulebookId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json(errorResponse('Rulebook not found'));
    }

    res.json(successResponse(data));

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json(errorResponse('Failed to check status', error));
  }
});

export default router;