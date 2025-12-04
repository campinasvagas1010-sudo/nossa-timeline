import { ExposedMode as ExposedModeType } from '@/types/story';
import { Eye, AlertTriangle, TrendingUp } from 'lucide-react';

interface ExposedModeProps {
  mode: ExposedModeType;
  person1Name: string;
  person2Name: string;
}

export function ExposedMode({ mode, person1Name, person2Name }: ExposedModeProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 rounded-2xl p-8 text-center border-2 border-dashed border-orange-300">
        <Eye className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{mode.title}</h2>
        <p className="text-gray-600">
          ⚠️ As verdades que vocês tentaram esconder... reveladas!
        </p>
      </div>

      {/* Secrets */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-3xl">🔓</span>
          Segredos revelados
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {mode.secrets.map((secret, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{secret.emoji}</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{secret.title}</h4>
                  <p className="text-gray-700 text-sm mb-2">{secret.description}</p>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                    <span className="text-xs font-bold text-orange-700">{secret.revealedData}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awkward Moments */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-red-500" />
          Momentos constrangedores
        </h3>
        <div className="space-y-4">
          {mode.awkwardMoments.map((moment, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-700 flex-1">{moment.description}</p>
                <div className="flex gap-1 ml-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < moment.cringeLevel ? 'opacity-100' : 'opacity-20'
                      }`}
                    >
                      😬
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(moment.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Patterns */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-purple-500" />
          Padrões detectados
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {mode.patterns.map((pattern, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{pattern.emoji}</div>
              <h4 className="font-bold text-gray-900 mb-2">{pattern.title}</h4>
              <p className="text-sm text-gray-700 mb-2">{pattern.description}</p>
              <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                <span className="text-xs font-bold text-purple-700">{pattern.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Footer */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-2xl p-6 text-center">
        <p className="text-lg font-bold mb-2">
          🔥 Modo Exposed ativado com sucesso!
        </p>
        <p className="text-sm opacity-90">
          Compartilhe com cuidado... algumas verdades são explosivas! 💣
        </p>
      </div>
    </div>
  );
}
