'use client';

import { useEffect, useState } from 'react';

interface BattleAnalysisProgressProps {
  stage: 'filtering' | 'analyzing' | 'interpreting' | 'complete';
  progress: number; // 0-100
}

export default function BattleAnalysisProgress({ stage, progress }: BattleAnalysisProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  
  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev >= progress) return progress;
        return prev + 1;
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, [progress]);
  
  const getStageInfo = () => {
    switch (stage) {
      case 'filtering':
        return {
          emoji: '🔍',
          title: 'Filtrando mensagens...',
          description: 'Removendo conteúdo irrelevante para otimizar análise',
        };
      case 'analyzing':
        return {
          emoji: '📊',
          title: 'Analisando padrões...',
          description: 'Detectando comportamentos e métricas de relacionamento',
        };
      case 'interpreting':
        return {
          emoji: '🤖',
          title: 'Interpretando comportamentos...',
          description: 'IA analisando contexto emocional das conversas',
        };
      case 'complete':
        return {
          emoji: '✨',
          title: 'Gerando resultados...',
          description: 'Preparando seus cards personalizados',
        };
    }
  };
  
  const stageInfo = getStageInfo();
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Emoji animado */}
      <div className="text-center mb-6">
        <span className="text-6xl inline-block animate-bounce">{stageInfo.emoji}</span>
      </div>
      
      {/* Título e descrição */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {stageInfo.title}
        </h3>
        <p className="text-sm text-gray-600">
          {stageInfo.description}
        </p>
      </div>
      
      {/* Barra de progresso */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${displayProgress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {/* Porcentagem */}
      <div className="text-center">
        <span className="text-sm font-semibold text-gray-700">
          {displayProgress}%
        </span>
      </div>
      
      {/* Loading dots */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Stages indicator */}
      <div className="flex items-center justify-between mt-8 px-4">
        <div className={`flex flex-col items-center ${stage === 'filtering' ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${stage === 'filtering' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <span className="text-xs text-gray-600">Filtrar</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${stage === 'analyzing' || stage === 'interpreting' || stage === 'complete' ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
        
        <div className={`flex flex-col items-center ${stage === 'analyzing' ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${stage === 'analyzing' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <span className="text-xs text-gray-600">Analisar</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${stage === 'interpreting' || stage === 'complete' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
        
        <div className={`flex flex-col items-center ${stage === 'interpreting' ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${stage === 'interpreting' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
          <span className="text-xs text-gray-600">Interpretar</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${stage === 'complete' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        
        <div className={`flex flex-col items-center ${stage === 'complete' ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${stage === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            ✓
          </div>
          <span className="text-xs text-gray-600">Pronto</span>
        </div>
      </div>
    </div>
  );
}
