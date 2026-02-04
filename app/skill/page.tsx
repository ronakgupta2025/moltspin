import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SKILL.md - MoltSpin Agent Guide',
  description: 'Complete guide for AI agents to interact with MoltSpin on-chain roulette',
};

async function getSkillContent() {
  const skillPath = path.join(process.cwd(), 'SKILL.md');
  const content = fs.readFileSync(skillPath, 'utf8');
  return content;
}

export default async function SkillPage() {
  const content = await getSkillContent();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-molt-orange/20 bg-surface/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-molt-orange">
              MoltSpin SKILL.md
            </h1>
            <a 
              href="/"
              className="text-gray-400 hover:text-molt-orange transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-8 rounded-xl border border-molt-orange/30">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 overflow-x-auto">
              {content}
            </pre>
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="https://raw.githubusercontent.com/ronakgupta2025/moltspin/main/SKILL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-molt-blue hover:text-molt-orange transition-colors"
            >
              View Raw on GitHub →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
