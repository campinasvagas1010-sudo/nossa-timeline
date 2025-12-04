'use client';

import Image from 'next/image';

interface BattleStoryCardProps {
  category: 'ciumento' | 'dr' | 'vacuo' | 'demora' | 'orgulhoso';
  winner: 'Pedro' | 'Ana';
  winnerPhoto: string;
  stat: string;
}

// Mapear categorias do card para arquivos PNG
const categoryToImage: Record<string, string> = {
  ciumento: '/cards/ciume.png',
  dr: '/cards/brigas.png',
  vacuo: '/cards/vacuo.png',
  demora: '/cards/demora.png',
  orgulhoso: '/cards/orgulho.png',
};

export default function BattleStoryCard({
  category,
  winner,
  winnerPhoto,
  stat,
}: BattleStoryCardProps) {
  const cardImage = categoryToImage[category];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview do Card (escala 0.25: 1080px → 270px) */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ width: '270px', height: '480px' }}>
        {/* Imagem PNG de fundo (1080x1920) */}
        <div 
          className="absolute inset-0"
          style={{
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
            width: '1080px',
            height: '1920px'
          }}
        >
          <Image
            src={cardImage}
            alt={`Card ${category}`}
            width={1080}
            height={1920}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        
        {/* Overlay com textos nas coordenadas exatas */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
            width: '1080px',
            height: '1920px'
          }}
        >
          {/* Campo Superior */}
          <div 
            className="absolute flex items-center justify-center"
            style={{
              left: '100px',
              top: '940px',
              width: '880px',
              height: '160px'
            }}
          >
            <p 
              className="font-black text-center leading-tight"
              style={{
                fontSize: winner.length > 8 ? '90px' : winner.length > 6 ? '110px' : '140px',
                fontFamily: '\'Montserrat\', \'Inter\', -apple-system, sans-serif',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 40%, #ec4899 70%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 20px rgba(124, 58, 237, 0.3)'
              }}
            >
              {winner.toUpperCase()}
            </p>
          </div>

          {/* Campo Inferior */}
          <div 
            className="absolute flex items-center justify-center px-4"
            style={{
              left: '100px',
              top: '1220px',
              width: '880px',
              height: '200px'
            }}
          >
            <p 
              className="text-gray-900 font-black text-center leading-none"
              style={{ 
                fontSize: '140px',
                fontFamily: '\'Montserrat\', \'Inter\', -apple-system, sans-serif',
                fontWeight: 900
              }}
            >
              {stat}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
