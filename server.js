const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/enrich', async (req, res) => {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
