import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

type Category = 'Odd One Out' | 'Analogy' | 'Non-Logical Word' | 'Paragraph Meaning';

interface TeachRequest {
  category: Category;
}

export async function POST(request: Request) {
  try {
    const body: TeachRequest = await request.json();
    const { category } = body;

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const openai = getOpenAIClient();

    let prompt = '';
    const systemInstruction = 'You are an expert English teacher preparing students for the Qudurat exam. Return ONLY raw JSON.';

    switch (category) {
      case 'Odd One Out':
        prompt = `Create a comprehensive lesson for "Odd One Out" questions.
        
        Output format: JSON object with keys:
        - explanation: string (detailed explanation of the concept: categories, shared features, classification - 3-4 paragraphs)
        - common_tricks: array of strings (3-5 common tricks used in exams)
        - examples: array of 5 objects, each with:
          - question: string
          - options: array of 4 strings
          - correct_answer: string
          - explanation: string (why this answer is correct)
        - practice: array of 5 objects, each with:
          - question: string
          - options: array of 4 strings
          - correct_answer: string
          - explanation: string
        `;
        break;
      case 'Analogy':
        prompt = `Create a comprehensive lesson for "Analogy (Find the Pair)" questions.
        
        Output format: JSON object with keys:
        - explanation: string (detailed explanation teaching relationship types: part→whole, cause→effect, object→function, material→object, synonyms, opposites - 3-4 paragraphs)
        - common_tricks: array of strings (3-5 common tricks)
        - examples: array of 5 objects, each with:
          - base_pair: string (e.g., "Hand : Glove")
          - question: string
          - options: array of 4 strings (formatted as "Word1 : Word2")
          - correct_answer: string
          - explanation: string (explain the relationship type)
        - practice: array of 5 objects with same structure as examples
        `;
        break;
      case 'Non-Logical Word':
        prompt = `Create a comprehensive lesson for "Non-Logical Word" questions.
        
        Output format: JSON object with keys:
        - explanation: string (detailed explanation on detecting contradictions, broken logic, wrong result, wrong verb - 3-4 paragraphs)
        - common_tricks: array of strings (3-5 common tricks)
        - examples: array of 5 objects, each with:
          - sentence: string (sentence with illogical word)
          - options: array of 4 words from the sentence
          - correct_answer: string
          - explanation: string (why this word breaks the logic)
        - practice: array of 5 objects with same structure
        `;
        break;
      case 'Paragraph Meaning':
        prompt = `Create a comprehensive lesson for "Paragraph Meaning" questions.
        
        Output format: JSON object with keys:
        - explanation: string (detailed explanation on finding main idea, ignoring details, avoiding distractor options - 3-4 paragraphs)
        - common_tricks: array of strings (3-5 common tricks)
        - examples: array of 5 objects, each with:
          - paragraph: string (2-4 sentences)
          - question: string
          - options: array of 4 possible meanings
          - correct_answer: string
          - explanation: string (why this is the main idea)
        - practice: array of 5 objects with same structure
        `;
        break;
      default:
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const result = JSON.parse(content);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error generating lesson:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate lesson' }, { status: 500 });
  }
}
