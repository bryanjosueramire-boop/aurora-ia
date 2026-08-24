import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Falta la variable GEMINI_API_KEY en Render." });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "Eres A.U.R.O.R.A., una inteligencia artificial futurista, eficiente y cortés."
      }
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: `Error en la IA: ${error.message || 'Error desconocido'}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
