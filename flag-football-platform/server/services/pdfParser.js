// PDF Parser Service
import pdfParse from 'pdf-parse';
import { supabase } from './supabase.js';
import { 
  cleanText, 
  extractTags, 
  determineDifficultyLevel 
} from '../utils/helpers.js';

export class PDFParser {
  constructor() {
    this.currentRulebookId = null;
  }

  // Main parsing function
  async parsePDF(buffer, rulebookName, version) {
    try {
      console.log('Starting PDF parsing...');
      
      // Parse PDF
      const data = await pdfParse(buffer);
      const text = data.text;
      
      console.log('PDF parsed successfully, text length:', text.length);

      // Create rulebook entry
      const rulebook = await this.createRulebook(rulebookName, version);
      this.currentRulebookId = rulebook.id;

      // Parse structure
      const structure = this.parseStructure(text);
      
      // Save to database
      await this.saveToDatabase(structure);

      // Update rulebook status
      await this.updateRulebookStatus(rulebook.id, 'active');

      return {
        success: true,
        rulebookId: rulebook.id,
        stats: {
          sections: structure.sections.length,
          totalRules: structure.sections.reduce((sum, s) => 
            sum + s.categories.reduce((cSum, c) => cSum + c.rules.length, 0), 0)
        }
      };

    } catch (error) {
      console.error('PDF parsing error:', error);
      if (this.currentRulebookId) {
        await this.updateRulebookStatus(this.currentRulebookId, 'archived');
      }
      throw error;
    }
  }

  // Create rulebook entry
  async createRulebook(name, version) {
    const { data, error } = await supabase
      .from('rulebooks')
      .insert({
        name,
        version,
        status: 'processing'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Parse PDF text into structure
  parseStructure(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    const structure = {
      sections: []
    };

    let currentSection = null;
    let currentCategory = null;
    let sectionOrder = 0;
    let categoryOrder = 0;
    let ruleOrder = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect sections (usually numbered or all caps headings)
      if (this.isSectionHeading(line)) {
        if (currentSection && currentCategory) {
          currentSection.categories.push(currentCategory);
        }
        if (currentSection) {
          structure.sections.push(currentSection);
        }
        
        sectionOrder++;
        categoryOrder = 0;
        ruleOrder = 0;
        
        currentSection = {
          title: cleanText(line),
          order: sectionOrder,
          categories: []
        };
        currentCategory = null;
        
      } else if (this.isCategoryHeading(line)) {
        // Detect categories (sub-headings)
        if (currentCategory) {
          currentSection.categories.push(currentCategory);
        }
        
        categoryOrder++;
        ruleOrder = 0;
        
        currentCategory = {
          title: cleanText(line),
          order: categoryOrder,
          rules: []
        };
        
      } else if (this.isRuleContent(line)) {
        // Detect rules (usually starts with number or bullet)
        if (!currentCategory) {
          // Create default category if none exists
          categoryOrder++;
          currentCategory = {
            title: 'General Rules',
            order: categoryOrder,
            rules: []
          };
        }
        
        ruleOrder++;
        
        // Collect multi-line rule content
        let ruleContent = line;
        let j = i + 1;
        while (j < lines.length && !this.isSectionHeading(lines[j]) && 
               !this.isCategoryHeading(lines[j]) && !this.isRuleContent(lines[j])) {
          ruleContent += ' ' + lines[j];
          j++;
        }
        i = j - 1;
        
        const ruleTitle = this.extractRuleTitle(ruleContent);
        const ruleBody = cleanText(ruleContent);
        
        currentCategory.rules.push({
          title: ruleTitle,
          content: ruleBody,
          order: ruleOrder
        });
      }
    }

    // Push remaining items
    if (currentCategory) {
      currentSection.categories.push(currentCategory);
    }
    if (currentSection) {
      structure.sections.push(currentSection);
    }

    return structure;
  }

  // Detect section headings (heuristic)
  isSectionHeading(line) {
    // Check if line is all caps, short, or starts with "SECTION" or numbers like "1."
    return (
      line.length < 100 &&
      (line === line.toUpperCase() ||
       /^SECTION\s+\d+/i.test(line) ||
       /^\d+\.\s+[A-Z]/.test(line))
    );
  }

  // Detect category headings
  isCategoryHeading(line) {
    return (
      line.length < 80 &&
      line.length > 5 &&
      /^[A-Z]/.test(line) &&
      !this.isRuleContent(line)
    );
  }

  // Detect rule content
  isRuleContent(line) {
    return (
      /^\d+\./.test(line) ||      // Starts with number
      /^[a-z]\)/.test(line) ||     // Starts with letter)
      /^•/.test(line) ||           // Bullet point
      /^-/.test(line)              // Dash
    );
  }

  // Extract rule title from content
  extractRuleTitle(content) {
    const firstSentence = content.split('.')[0];
    return cleanText(firstSentence.substring(0, 100));
  }

  // Save parsed structure to database
  async saveToDatabase(structure) {
    for (const section of structure.sections) {
      // Insert section
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .insert({
          rulebook_id: this.currentRulebookId,
          title: section.title,
          order: section.order,
          difficulty_level: determineDifficultyLevel(section.title, section.order)
        })
        .select()
        .single();

      if (sectionError) throw sectionError;

      for (const category of section.categories) {
        // Insert category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .insert({
            section_id: sectionData.id,
            title: category.title,
            order: category.order
          })
          .select()
          .single();

        if (categoryError) throw categoryError;

        // Insert rules
        for (const rule of category.rules) {
          const tags = extractTags(rule.content, rule.title);
          
          const { error: ruleError } = await supabase
            .from('rules')
            .insert({
              category_id: categoryData.id,
              title: rule.title,
              content: rule.content,
              tags: tags,
              order: rule.order
            });

          if (ruleError) throw ruleError;
        }
      }
    }
  }

  // Update rulebook status
  async updateRulebookStatus(rulebookId, status) {
    const { error } = await supabase
      .from('rulebooks')
      .update({ status })
      .eq('id', rulebookId);

    if (error) throw error;
  }
}