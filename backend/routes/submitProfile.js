const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

router.post('/', async (req, res) => {
  try {
    const { name, location, interests, intro, socialLinks, building } = req.body;

    // Validate required fields
    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          name,
          location,
          interests: interests ? interests.split(',').map(i => i.trim()) : [],
          intro,
          social_links: socialLinks,
          building,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'Profile created successfully',
      profile: data[0]
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

module.exports = router; 