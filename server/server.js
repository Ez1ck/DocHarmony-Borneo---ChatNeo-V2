import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import OpenAI from "openai";

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from ChatNeo!'
  })

  // TRAIN THE MODEL WITH LATEST DATA HERE:

  
  // TRAIN IT LIKE THIS: (But ofcourse, change it a bit)
  // openai.ChatCompletion.create(
  //   model="gpt-3.5-turbo",
  //   messages=[
  //         {"role": "system", "content": "You are a helpful assistant."},
  //         {"role": "user", "content": "Tell me a joke."},
  //         {"role": "assistant", "content": "Sure, here's a joke: Why did the chicken cross the road?"},
  //         {"role": "user", "content": "I don't know, why did the chicken cross the road?"},
  //         {"role": "assistant", "content": "To get to the other side!"},
  //         # Add more user and assistant messages for training
  //     ]
  // )

  // Changes maybe like this:
  // const messages = [
  //   { role: 'system', content: 'You are a helpful assistant.' },
  //   { role: 'user', content: 'What are the requirements for obtaining a KTP?' },
  //   { role: 'assistant', content: 'To obtain a KTP (Kartu Tanda Penduduk), you need to provide a photocopy of Kartu Keluarga (KK) and a letter from the RT/RW.' },
  //   // Add more training examples based on the information you provided
  // ];

})

// `${prompt}`

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": `${prompt}`
        }
      ],
      temperature: 1,
      max_tokens: 3000, // $0.002 per 1000 tokens, 500,000 tokens for $1. I think a token is a letter.
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log("THIS IS ITTTTT!!!!")
    console.log(JSON.stringify(response.choices[0], null, 2));


    res.status(200).send({
      // bot: "some text" // THIS SENDS CORRECTLY!!! this means the "bot: response.choices[0].text" line is sending something in an unexpected format that's not string.
      // bot: response.choices[0].text
      bot: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error.message || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))