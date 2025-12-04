import { RomanceMode as RomanceModeType } from '@/types/story';
import { Heart, Sparkles } from 'lucide-react';

interface RomanceModeProps {
  mode: RomanceModeType;
  person1Name: string;
  person2Name: string;
}

export function RomanceMode({ mode, person1Name, person2Name }: RomanceModeProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-red-100 rounded-2xl p-8 text-center">
        <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{mode.title}</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
            {mode.loveScore}%
          </span>
          <span className="text-gray-600">Love Score</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200">
        <p className="text-lg text-gray-700 leading-relaxed text-center">
          {mode.summary}
        </p>
      </div>

      {/* Highlights */}
      <div className="grid md:grid-cols-2 gap-6">
        {mode.highlights.map((highlight, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{highlight.emoji}</span>
              <h3 className="text-xl font-bold text-gray-900">{highlight.title}</h3>
            </div>
            <p className="text-gray-700">{highlight.description}</p>
            {highlight.date && (
              <p className="text-sm text-gray-500 mt-2">
                {new Date(highlight.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Romantic Quote */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-2xl p-8 text-center shadow-xl">
        <Sparkles className="w-8 h-8 mx-auto mb-4" />
        <blockquote className="text-2xl font-bold italic mb-4">
          "Cada mensagem é uma prova de que o amor de vocês é real, intenso e único."
        </blockquote>
        <p className="text-pink-100">
          A história de {person1Name} e {person2Name} é uma inspiração 💕
        </p>
      </div>
    </div>
  );
}
