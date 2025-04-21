const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: __dirname + '/../.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 