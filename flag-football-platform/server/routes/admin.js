// Admin Routes
import express from 'express';
import { supabase } from '../services/supabase.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

const router = express.Router();

// GET /api/admin/rulebooks - List all rulebooks
router.get('/rulebooks', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rulebooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(successResponse(data));

  } catch (error) {
    console.error('Fetch rulebooks error:', error);
    res.status(500).json(errorResponse('Failed to fetch rulebooks', error));
  }
});

// GET /api/admin/rulebooks/:id - Get single rulebook with structure
router.get('/rulebooks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get rulebook
    const { data: rulebook, error: rulebookError } = await supabase
      .from('rulebooks')
      .select('*')
      .eq('id', id)
      .single();

    if (rulebookError) throw rulebookError;

    // Get sections with categories and rules
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select(`
        *,
        categories (
          *,
          rules (*)
        )
      `)
      .eq('rulebook_id', id)
      .order('order');

    if (sectionsError) throw sectionsError;

    const result = {
      ...rulebook,
      sections
    };

    res.json(successResponse(result));

  } catch (error) {
    console.error('Fetch rulebook error:', error);
    res.status(500).json(errorResponse('Failed to fetch rulebook', error));
  }
});

// DELETE /api/admin/rulebooks/:id - Delete rulebook
router.delete('/rulebooks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('rulebooks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json(successResponse(null, 'Rulebook deleted successfully'));

  } catch (error) {
    console.error('Delete rulebook error:', error);
    res.status(500).json(errorResponse('Failed to delete rulebook', error));
  }
});

// POST /api/admin/videos - Add video to rule
router.post('/videos', async (req, res) => {
  try {
    const { ruleId, youtubeUrl } = req.body;

    if (!ruleId || !youtubeUrl) {
      return res.status(400).json(errorResponse('Rule ID and YouTube URL are required'));
    }

    const { data, error } = await supabase
      .from('videos')
      .insert({
        rule_id: ruleId,
        youtube_url: youtubeUrl
      })
      .select()
      .single();

    if (error) throw error;

    res.json(successResponse(data, 'Video added successfully'));

  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json(errorResponse('Failed to add video', error));
  }
});

// GET /api/admin/error-reports - Get error reports
router.get('/error-reports', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('error_reports')
      .select(`
        *,
        rules (title),
        rulebooks (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(successResponse(data));

  } catch (error) {
    console.error('Fetch error reports error:', error);
    res.status(500).json(errorResponse('Failed to fetch error reports', error));
  }
});

// PATCH /api/admin/error-reports/:id - Update error report status
router.patch('/error-reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status'));
    }

    const { data, error } = await supabase
      .from('error_reports')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(successResponse(data, 'Error report updated'));

  } catch (error) {
    console.error('Update error report error:', error);
    res.status(500).json(errorResponse('Failed to update error report', error));
  }
});

// GET /api/admin/stats - Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    // Count rulebooks
    const { count: rulebooksCount } = await supabase
      .from('rulebooks')
      .select('*', { count: 'exact', head: true });

    // Count users
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Count rules
    const { count: rulesCount } = await supabase
      .from('rules')
      .select('*', { count: 'exact', head: true });

    // Count pending error reports
    const { count: pendingReportsCount } = await supabase
      .from('error_reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const stats = {
      rulebooks: rulebooksCount || 0,
      users: usersCount || 0,
      rules: rulesCount || 0,
      pendingReports: pendingReportsCount || 0
    };

    res.json(successResponse(stats));

  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json(errorResponse('Failed to fetch statistics', error));
  }
});

export default router;