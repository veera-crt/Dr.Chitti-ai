/*require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const winston = require('winston');

// Initialize Express app
const app = express();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase client
let supabase;
try {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Supabase credentials are missing in environment variables');
  }
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  logger.info('Supabase client initialized successfully');
} catch (error) {
  logger.error('Initialization error', { error: error.message });
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    database: !!supabase,
    timestamp: new Date().toISOString()
  });
});

// Deep search function for medical knowledge
async function deepSearchMedicalKnowledge(query) {
  try {
    // First try: Full text search with ranking
    const { data: fullTextData, error: fullTextError } = await supabase
      .from('medical_knowledge')
      .select('*')
      .textSearch('content', query, {
        type: 'websearch',
        config: 'english'
      })
      .order('rank', { ascending: false })
      .limit(5);

    if (!fullTextError && fullTextData?.length > 0) {
      return fullTextData;
    }

    // Second try: Pattern matching if full text search fails
    const { data: patternData, error: patternError } = await supabase
      .from('medical_knowledge')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(5);

    if (!patternError && patternData?.length > 0) {
      return patternData;
    }

    // Third try: Split query into keywords and search
    const keywords = query.split(/\s+/).filter(word => word.length > 3);
    if (keywords.length > 0) {
      const { data: keywordData, error: keywordError } = await supabase
        .from('medical_knowledge')
        .select('*')
        .contains('keywords', keywords)
        .limit(5);

      if (!keywordError && keywordData?.length > 0) {
        return keywordData;
      }
    }

    return null;
  } catch (error) {
    logger.error('Deep search error', { error: error.message });
    throw error;
  }
}

// API endpoint to handle medical queries
app.post('/api/medical-query', async (req, res) => {
  try {
    // Validate input
    if (!req.body?.query || typeof req.body.query !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Query must be a non-empty string'
      });
    }

    const query = req.body.query.trim();
    logger.info('Processing medical query', { query });

    // Perform deep search
    const results = await deepSearchMedicalKnowledge(query);

    if (!results || results.length === 0) {
      return res.status(404).json({
        response: "No medical information found for your query. Please try different wording or consult a healthcare professional."
      });
    }

    // Format the best matching result
    const bestMatch = results[0];
    const response = {
      title: bestMatch.title,
      content: bestMatch.content,
      source: bestMatch.source || 'Medical Knowledge Base',
      additionalResults: results.length > 1 ? results.slice(1) : undefined
    };

    return res.json(response);

  } catch (error) {
    logger.error('Medical query error', {
      error: error.message,
      stack: error.stack,
      query: req.body?.query
    });

    return res.status(500).json({
      error: 'Database error',
      message: 'Failed to process your medical query'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Server error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  res.status(500).json({
    error: 'Internal server error',
    message: 'Please try again later'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});'''
