const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeSearchQuery(query) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Given this search query: "${query}", extract the following information in JSON format:
        {
            "location": "extracted location or null",
            "interests": ["list of interests or empty array"],
            "building": "what they're building or null"
        }
        
        Example: For "I want a filmmaker from Delhi building a YouTube channel", return:
        {
            "location": "Delhi",
            "interests": ["filmmaking"],
            "building": "YouTube channel"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse Gemini response');
        }
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error in Gemini analysis:', error);
        // Return a default structure if Gemini fails
        return {
            location: null,
            interests: [],
            building: null
        };
    }
}

async function generateFriendlyResponse(profiles) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `Create a friendly, casual response introducing these people. Format it as a natural conversation:
        
        Profiles: ${JSON.stringify(profiles)}
        
        Example response format:
        "Hey! I found Sarah — she's filming stuff in Delhi. And Yash is building Galactica from Noida!"
        
        Keep it concise, friendly, and highlight their key details.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating friendly response:', error);
        // Return a simple formatted response if Gemini fails
        return profiles.map(profile => 
            `${profile.name} from ${profile.location}${profile.building ? ` is building ${profile.building}` : ''}`
        ).join('. ');
    }
}

module.exports = {
    analyzeSearchQuery,
    generateFriendlyResponse
}; 