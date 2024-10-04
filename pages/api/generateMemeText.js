import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { businessName, productName, targetAudience, keywords } = req.body;

  const prompt = `
  Based on the following information, create a catchy and engaging meme-style hook:
  - Business Name: ${businessName}
  - Product Name: ${productName}
  - Target Audience: ${targetAudience}
  - Keywords: ${keywords}

  Provide two short phrases suitable for the top and bottom text of a meme, in the following format:

  Top Text: [Your top text]
  Bottom Text: [Your bottom text]

  The text should be attention-grabbing, humorous if appropriate, and relevant to the product and audience.
  Do not include hashtags, emojis, or quotation marks in the text.
  Keep each phrase short and impactful, ideally no more than 5-7 words each.
  `;

  try {
    console.log('Sending request to OpenAI for meme text generation');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.7,
    });

    console.log('Received response from OpenAI');
    const content = completion.choices[0].message.content.trim();
    console.log('Generated content:', content);

    // Extract the top and bottom text from the response
    const topTextMatch = content.match(/Top Text:\s*(.*)/i);
    const bottomTextMatch = content.match(/Bottom Text:\s*(.*)/i);

    let topText = topTextMatch ? topTextMatch[1] : '';
    let bottomText = bottomTextMatch ? bottomTextMatch[1] : '';

    // Remove any remaining hashtags, emojis, or quotation marks
    topText = topText.replace(/#\w+|[""]|[^\w\s!?.,]/g, '').trim();
    bottomText = bottomText.replace(/#\w+|[""]|[^\w\s!?.,]/g, '').trim();

    console.log('Cleaned top text:', topText);
    console.log('Cleaned bottom text:', bottomText);

    res.status(200).json({ topText, bottomText });
  } catch (error) {
    console.error(
      'Error generating meme text:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Failed to generate meme text' });
  }
}