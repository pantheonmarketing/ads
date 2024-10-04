import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { 
    avatar, 
    desiredOutcome, 
    ineffectiveMethod1, 
    ineffectiveMethod2, 
    ineffectiveMethod3, 
    newSolution 
  } = req.body;

  const prompt = `
  Write two variations of a Facebook ad caption using the following information:

  Avatar and Their Problem: ${avatar}
  Desired Outcome: ${desiredOutcome}
  Ineffective Method 1: ${ineffectiveMethod1}
  Ineffective Method 2: ${ineffectiveMethod2}
  Ineffective Method 3: ${ineffectiveMethod3}
  New Solution Name: ${newSolution}

  Please write each ad copy variation in this format:

  Variation 1:
  Line 1: 📞 CALLING ALL [AVATAR + THEIR PAIN]: [achieve your desired outcome] with this NEW METHOD...
  Line 2: I understand that you may have already tried:
  - [Ineffective Method 1]
  - [Ineffective Method 2]
  - Or even - [Ineffective Method 3]
  Line 3: But you're still seeing no progress towards [desired outcome].
  Line 4: That's why I want to introduce you to [new solution name].
  Line 5: As of 2024, it's the fastest and easiest way to [desired outcome].
  Line 6: If you're interested in learning more…
  Line 7: You can access it right here: [INSERT LINK]

  Variation 2:
  [Create a different approach using the same information but with a unique angle or hook]

  Make sure both ad copy variations are engaging, persuasive, and tailored to the specific avatar and their problem. Use emojis where appropriate to make the ads more visually appealing.
  `;

  try {
    console.log('Sending request to OpenAI for ad script generation');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log('Received response from OpenAI');
    const content = completion.choices[0].message.content.trim();
    console.log('Generated content:', content);

    // Split the content into two variations
    const variations = content.split('Variation 2:');
    const variation1 = variations[0].replace('Variation 1:', '').trim();
    const variation2 = variations[1].trim();

    res.status(200).json({ variation1, variation2 });
  } catch (error) {
    console.error(
      'Error generating ad script:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Failed to generate ad script' });
  }
}