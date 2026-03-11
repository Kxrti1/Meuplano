require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');
const path    = require('path');

const app     = express();
const PORT    = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('❌  ANTHROPIC_API_KEY não definida nas variáveis de ambiente');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: { message: 'Erro: ' + err.message } });
  }
});

// Todas as rotas devolvem o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`✅ A correr na porta ${PORT}`));
