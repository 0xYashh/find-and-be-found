const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { analyzeSearchQuery, generateFriendlyResponse } = require('../utils/gemini');

router.post('/', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Try to analyze with Gemini first
        const searchCriteria = await analyzeSearchQuery(query);

        // Build Supabase query
        let supabaseQuery = supabase.from('profiles').select('*');

        // If Gemini analysis worked, use structured search
        if (searchCriteria.location || (searchCriteria.interests && searchCriteria.interests.length) || searchCriteria.building) {
            const conditions = [];

            if (searchCriteria.location) {
                conditions.push(`location.ilike.%${searchCriteria.location}%`);
            }

            if (searchCriteria.interests && searchCriteria.interests.length > 0) {
                searchCriteria.interests.forEach(interest => {
                    conditions.push(`interests.cs.{${interest}}`);
                });
            }

            if (searchCriteria.building) {
                conditions.push(`building.ilike.%${searchCriteria.building}%`);
            }

            if (conditions.length > 0) {
                supabaseQuery = supabaseQuery.or(conditions.join(','));
            }
        } else {
            // Fallback to basic text search if Gemini analysis failed
            const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
            if (searchTerms.length > 0) {
                const conditions = searchTerms.map(term => 
                    `or(location.ilike.%${term}%,building.ilike.%${term}%,intro.ilike.%${term}%)`
                );
                supabaseQuery = supabaseQuery.or(conditions.join(','));
            }
        }

        // Execute the query
        const { data: profiles, error } = await supabaseQuery;

        if (error) {
            console.error('Supabase query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (!profiles || profiles.length === 0) {
            return res.json({
                message: "I couldn't find anyone matching your search. Try being more specific or using different keywords!",
                profiles: []
            });
        }

        // Generate a friendly response
        const friendlyResponse = await generateFriendlyResponse(profiles);

        res.json({
            message: friendlyResponse,
            profiles: profiles
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Failed to process search request',
            details: error.message 
        });
    }
});

module.exports = router; 