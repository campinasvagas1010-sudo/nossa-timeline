import { ShareableCard as ShareableCardType } from '@/types/story';

interface ShareableCardProps {
  card: ShareableCardType;
}

export function ShareableCard({ card }: ShareableCardProps) {
  const getGradientClass = (gradient: string) => {
    const gradients = {
      romantic: 'from-pink-400 via-rose-400 to-red-400',
      fun: 'from-cyan-400 via-blue-400 to-purple-400',
      dark: 'from-indigo-500 via-purple-500 to-pink-500',
      neutral: 'from-gray-400 via-gray-500 to-gray-600',
    };
    return gradients[gradient as keyof typeof gradients] || gradients.neutral;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card Preview */}
      <div className={`story-card max-w-[320px] bg-gradient-to-br ${getGradientClass(card.style.gradient)} p-8 flex flex-col justify-between text-white shadow-2xl`}>
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-medium mb-2 opacity-80 uppercase tracking-wide">
            Nosso Timeline
          </p>
          {card.style.emoji && (
            <div className="text-5xl mb-3">{card.style.emoji}</div>
          )}
          <h3 className="text-2xl font-bold mb-2">{card.content.headline}</h3>
        </div>

        {/* Body */}
        <div className="flex-1 flex items-center justify-center">
          {Array.isArray(card.content.body) ? (
            <ul className="space-y-2 text-sm">
              {card.content.body.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-3xl font-bold text-center leading-tight">
              {card.content.body}
            </p>
          )}
        </div>

        {/* Footer */}
        {card.content.footer && (
          <div className="text-center mt-6 pt-4 border-t border-white/30">
            <p className="text-sm opacity-90">{card.content.footer}</p>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">{card.title}</p>
        <p className="text-xs text-gray-500 mt-1">Formato ideal para Instagram Stories</p>
      </div>
    </div>
  );
}
