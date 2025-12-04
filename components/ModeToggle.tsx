'use client';

import { useState } from 'react';

type ViewMode = 'romance' | 'disputa' | 'exposed';

interface ModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  const modes = [
    {
      id: 'romance' as ViewMode,
      label: 'Romance',
      emoji: '💕',
      description: 'Versão emocional',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-500',
      textColor: 'text-pink-700',
    },
    {
      id: 'disputa' as ViewMode,
      label: 'Disputa',
      emoji: '⚔️',
      description: 'Quem é quem?',
      color: 'from-purple-500 to-blue-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-700',
    },
    {
      id: 'exposed' as ViewMode,
      label: 'Exposed',
      emoji: '🔍',
      description: 'Arquivos secretos',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
        Escolha o modo de visualização
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`p-4 rounded-xl border-2 transition-all text-center ${
              currentMode === mode.id
                ? `${mode.borderColor} ${mode.bgColor} shadow-md scale-105`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="text-3xl mb-2">{mode.emoji}</div>
            <div className={`font-bold mb-1 ${currentMode === mode.id ? mode.textColor : 'text-gray-900'}`}>
              {mode.label}
            </div>
            <div className="text-xs text-gray-600">{mode.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
