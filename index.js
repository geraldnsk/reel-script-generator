const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate', async (req, res) => {
  const { niche } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a viral Instagram coach.' },
        { role: 'user', content: `Give me a short viral IG Reel script about ${niche}` }
      ]
    });

    const script = completion.data.choices[0]?.message?.content || "No script returned.";
    res.json({ script });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong generating the script.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
