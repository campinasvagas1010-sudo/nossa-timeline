'use client';

import { useState } from 'react';
import BattleStoryCard from './BattleStoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BattleCarousel() {
  const [activeIndex, setActiveIndex] = useState(2);

  const battles = [
    {
      category: 'ciumento' as const,
      winner: 'Ana' as 'Ana',
      winnerPhoto: '/ana.png',
      stat: '68%',
      // statLabel removido
      // placar removido
    },
    {
      category: 'dr' as const,
      winner: 'Pedro' as 'Pedro',
      winnerPhoto: '/pedro.png',
      stat: '15',
      // statLabel removido
      // placar removido
    },
    {
      category: 'vacuo' as const,
      winner: 'Pedro' as 'Pedro',
      winnerPhoto: '/pedro.png',
      stat: '3d 7h',
      // statLabel removido
      // placar removido
    },
    {
      category: 'demora' as const,
      winner: 'Ana' as 'Ana',
      winnerPhoto: '/ana.png',
      stat: '2h 47min',
      // statLabel removido
      // placar removido
    },
    {
      category: 'orgulhoso' as const,
      winner: 'Ana' as 'Ana',
      winnerPhoto: '/ana.png',
      stat: '73%',
      // statLabel removido
      // placar removido
    },
  ];

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % battles.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + battles.length) % battles.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const position = diff === 0 ? 0 : diff < 0 ? diff : diff;

    // Card ativo (centro)
    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1)',
        zIndex: 50,
        opacity: 1,
        filter: 'blur(0px)',
      };
    }

    // Card à esquerda
    if (diff === -1 || (activeIndex === 0 && index === battles.length - 1)) {
      return {
        transform: 'translateX(-120%) scale(0.75)',
        zIndex: 30,
        opacity: 0.5,
        filter: 'blur(2px)',
      };
    }

    // Card à direita
    if (diff === 1 || (activeIndex === battles.length - 1 && index === 0)) {
      return {
        transform: 'translateX(120%) scale(0.75)',
        zIndex: 30,
        opacity: 0.5,
        filter: 'blur(2px)',
      };
    }

    // Cards muito distantes (escondidos)
    return {
      transform: diff < 0 ? 'translateX(-200%) scale(0.5)' : 'translateX(200%) scale(0.5)',
      zIndex: 10,
      opacity: 0,
      filter: 'blur(4px)',
    };
  };

  return (
    <div className="max-w-7xl mx-auto relative py-12">
      {/* Container dos cards */}
      <div className="relative h-[600px] flex items-center justify-center">
        {battles.map((battle, index) => (
          <div
            key={index}
            className="absolute transition-all duration-500 ease-out cursor-pointer"
            style={getCardStyle(index)}
            onClick={() => setActiveIndex(index)}
          >
            <BattleStoryCard
              category={battle.category}
              winner={battle.winner}
              winnerPhoto={battle.winnerPhoto}
              stat={battle.stat}
            />
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <button
          onClick={goToPrev}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Card anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Indicadores */}
        <div className="flex gap-3">
          {battles.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? 'w-12 h-3 bg-yellow-400'
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir para card ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Próximo card"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Instruções */}
      <p className="text-center text-white/80 text-sm mt-6">
        👆 Clique nos cards laterais ou use as setas para navegar
      </p>
    </div>
  );
}
