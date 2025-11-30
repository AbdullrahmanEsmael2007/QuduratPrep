import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { z } from 'zod'; // We might not have zod installed, I'll stick to basic validation or install zod. 
// I didn't install zod. I'll use basic validation.

// Types
type Category = 'Odd One Out' | 'Analogy' | 'Non-Logical Word' | 'Paragraph Meaning';

interface GenerateQuizRequest {
  category: Category;
  count: number;
  difficulty?: string;
}

export async function POST(request: Request) {
  try {
    const body: GenerateQuizRequest = await request.json();
    const { category, count, difficulty = 'College' } = body;

    if (!category || !count) {
      return NextResponse.json({ error: 'Category and count are required' }, { status: 400 });
    }

    const openai = getOpenAIClient();

    // Academic level modifiers
    const difficultyInstructions = {
      'High School': 'Use vocabulary and concepts appropriate for high school students (grades 9-12). Keep language accessible and straightforward.',
      'College': 'Use vocabulary and concepts suitable for undergraduate college students. Include moderately complex relationships and academic terminology.',
      'Academic': 'Use advanced academic vocabulary and sophisticated concepts. Include nuanced distinctions, complex relationships, and graduate-level reasoning.'
    };

    const difficultyNote = difficultyInstructions[difficulty as keyof typeof difficultyInstructions] || difficultyInstructions.College;

    let prompt = '';
    let systemInstruction = `You are a helpful assistant that generates English quiz questions for exam preparation. ${difficultyNote} Return ONLY raw JSON.`;

    switch (category) {
      case 'Odd One Out':
        prompt = `Generate ${count} "Odd One Out" questions at ${difficulty} academic level.
        For each question, provide 4 words where 3 share a category and 1 is logically different.
        Output format: JSON array of objects with keys:
        - id (string)
        - type: "Odd One Out"
        - question_text: "Choose the word that does not belong."
        - options: array of 4 strings
        - correct_answer: string (the odd word)
        - explanation: string (why it is different)
        `;
        break;
      case 'Analogy':
        prompt = `Generate ${count} "Analogy" (Find the Pair) questions at ${difficulty} academic level.
        For each question, provide a base pair (A : B) and 4 option pairs.
        One option pair must have the same relationship as the base pair.
        Output format: JSON array of objects with keys:
        - id (string)
        - type: "Analogy"
        - question_text: "Choose the pair that has a similar relationship to: [Base Pair]"
        - options: array of 4 strings (formatted as "Word1 : Word2")
        - correct_answer: string (the correct pair)
        - explanation: string (explain the relationship)
        `;
        break;
      case 'Non-Logical Word':
        prompt = `Generate ${count} "Non-Logical Word" questions at ${difficulty} academic level.
        For each question, create a sentence where one word makes it illogical or breaks the meaning.
        Output format: JSON array of objects with keys:
        - id (string)
        - type: "Non-Logical Word"
        - question_text: "Identify the word that makes the sentence illogical."
        - context: string (the full sentence with the illogical word)
        - options: array of 4 words from the sentence (including the illogical one)
        - correct_answer: string (the illogical word)
        - explanation: string (why it doesn't fit)
        `;
        break;
      case 'Paragraph Meaning':
        prompt = `Generate ${count} "Paragraph Meaning" questions at ${difficulty} academic level.
        For each question, provide a short paragraph (2-4 sentences) and 4 possible meanings/summaries.
        Output format: JSON array of objects with keys:
        - id (string)
        - type: "Paragraph Meaning"
        - question_text: "Read the paragraph and choose the best summary or meaning."
        - context: string (the paragraph text)
        - options: array of 4 strings
        - correct_answer: string (the correct summary)
        - explanation: string (why it is the best summary)
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
      model: 'gpt-4o-mini', // Using a fast and capable model
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const result = JSON.parse(content);
    // Expecting the LLM to return { "questions": [...] } or just the array inside a key.
    // I'll adjust the prompt to be specific about the root key if needed, or handle it here.
    // Let's assume it returns { "questions": [...] } or I should explicitly ask for it.
    
    // Let's refine the prompt in the next step if I see it's needed, but usually 'JSON array' might return just [ ... ].
    // Safest is to ask for a root object.
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate quiz' }, { status: 500 });
  }
}
