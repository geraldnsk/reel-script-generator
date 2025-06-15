const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// OpenAI Setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Route to generate script
app.post('/generate', async (req, res) => {
  const { niche } = req.body;

  if (!niche) {
    return res.status(400).json({ error: 'Niche is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a viral Instagram coach.' },
        { role: 'user', content: `Give me a short IG reel script for the niche: ${niche}` }
      ]
    });

    const script = completion.data.choices[0]?.message?.content || "Script generation failed.";
    res.json({ script });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong generating the script.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
