# QuduratPrep

QuduratPrep is an AI-powered web application designed to help students master the English section of the Qudurat exam. By leveraging OpenAI's GPT-4o-mini, the app provides unlimited, unique practice questions and comprehensive lessons tailored to specific exam categories.

## Features

### 📝 Quiz Mode
Practice with AI-generated questions across four key categories:
- **Odd One Out**: Identify the word that doesn't fit the group.
- **Analogy**: Find the pair of words that share the same relationship.
- **Non-Logical Word**: Spot the word that makes a sentence illogical.
- **Paragraph Meaning**: Choose the best summary for a given paragraph.

**Key capabilities:**
- **Customizable**: Choose between 5, 10, 15, or 20 questions per session.
- **Difficulty Levels**: Adjust the difficulty to match your preparation level (e.g., College).
- **Instant Feedback**: Get immediate explanations for every answer.
- **Result Summary**: Review your performance and retry incorrect questions.
- **History**: Track your progress with a local history of past quizzes.

### 📚 Teach Mode
Learn the fundamentals before testing yourself. Teach Mode generates comprehensive lessons for each category, including:
- **Detailed Explanations**: Deep dives into concepts and strategies.
- **Common Tricks**: Learn to spot and avoid common exam traps.
- **Examples**: Walk through solved examples with clear reasoning.
- **Practice**: Test your understanding with guided practice questions.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [OpenAI API](https://openai.com/) (GPT-4o-mini)
- **Styling**: CSS Modules / Tailwind-like utilities

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- An OpenAI API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbdullrahmanEsmael2007/QuduratPrep.git
   cd QuduratPrep
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is private and intended for educational purposes.
