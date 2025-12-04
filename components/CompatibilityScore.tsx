interface CompatibilityScoreProps {
  score: number;
  person1Name: string;
  person2Name: string;
  size?: 'small' | 'medium' | 'large';
}

export function CompatibilityScore({ score, person1Name, person2Name, size = 'medium' }: CompatibilityScoreProps) {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-40 h-40',
    large: 'w-56 h-56',
  };

  const textSizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-5xl',
  };

  // Cor baseada no score
  const getColor = (score: number) => {
    if (score >= 90) return 'from-pink-500 to-rose-500';
    if (score >= 75) return 'from-purple-500 to-pink-500';
    if (score >= 60) return 'from-blue-500 to-purple-500';
    return 'from-gray-400 to-gray-500';
  };

  const getMessage = (score: number) => {
    if (score >= 95) return 'Conexão perfeita! 💖';
    if (score >= 90) return 'Quase perfeito! 💕';
    if (score >= 80) return 'Muito compatíveis! 💗';
    if (score >= 70) return 'Ótima conexão! 💘';
    if (score >= 60) return 'Boa sintonia! 💝';
    return 'Em construção... 🌱';
  };

  // Calcular o stroke-dashoffset para animar o círculo
  const circumference = 2 * Math.PI * 70; // raio de 70
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* SVG Circle */}
        <svg className={`${sizeClasses[size]} transform -rotate-90`}>
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="70"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-pink-500" stopColor="currentColor" />
              <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score no centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r ${getColor(score)} text-transparent bg-clip-text`}>
            {score}%
          </span>
          <span className="text-xs text-gray-600 font-medium">compatibilidade</span>
        </div>
      </div>

      {/* Nomes e mensagem */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900">
          {person1Name} & {person2Name}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {getMessage(score)}
        </p>
      </div>
    </div>
  );
}
