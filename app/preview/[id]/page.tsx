'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PreviewStoryData } from '@/types/story';
import { CompatibilityScore } from '@/components/CompatibilityScore';
import { TimelineSection } from '@/components/TimelineSection';
import { StatsComparison } from '@/components/StatsComparison';
import { ShareableCard } from '@/components/ShareableCard';
import { Loader2, Lock, Sparkles, Star, TrendingUp, Image as ImageIcon, Heart, ArrowLeft, Zap } from 'lucide-react';

export default function PreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewStoryData | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/generate?id=${params.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Erro ao carregar prévia');
        }

        setPreviewData(data.data);
      } catch (err) {
        console.error('Erro ao carregar preview:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar prévia');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Preparando sua história...</p>
          <p className="text-sm text-gray-500 mt-2">Analisando momentos especiais ✨</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops!</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Não foi possível carregar a prévia. A história pode ter expirado.'}
          </p>
          <Link
            href="/criar"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Criar nova história
          </Link>
        </div>
      </div>
    );
  }

  const { compatibilityScore, timelinePreview, statsPreview, cardPreview, metadata, participants } = previewData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Início</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            Nosso Timeline
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Preview Badge */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white p-6 rounded-2xl text-center shadow-xl animate-pulse-slow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Prévia Gratuita</h2>
              <Star className="w-6 h-6" />
            </div>
            <p className="text-sm opacity-90">
              Veja um gostinho da sua história completa! 🎉
            </p>
          </div>

          {/* Header da História */}
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                {metadata.relationType === 'casal' && '💕 História de Amor'}
                {metadata.relationType === 'amizade' && '🤝 História de Amizade'}
                {metadata.relationType === 'outro' && '💬 Nossa História'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {participants.person1.name} & {participants.person2.name}
            </h1>

            <p className="text-lg text-gray-600 mb-2">
              {metadata.totalDays} dias de conversa
            </p>
            <p className="text-gray-500">
              {new Date(metadata.startDate).toLocaleDateString('pt-BR')} até{' '}
              {new Date(metadata.endDate).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Compatibility Score */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-900">Score de Compatibilidade</h2>
            </div>
            <CompatibilityScore
              score={compatibilityScore}
              person1Name={participants.person1.name}
              person2Name={participants.person2.name}
              size="large"
            />
          </div>

          {/* Timeline Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Linha do Tempo</h2>
              <span className="ml-auto text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                Prévia: {timelinePreview.length} capítulos
              </span>
            </div>
            <TimelineSection chapters={timelinePreview} isPreview={true} />
          </div>

          {/* Stats Preview */}
          {statsPreview.comparison && (
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Modo Disputa</h2>
                <span className="ml-auto text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  Prévia
                </span>
              </div>
              <StatsComparison
                battles={[
                  {
                    category: 'Mais tagarela',
                    metric: 'Total de mensagens',
                    person1Score: statsPreview.comparison.person1.totalMessages,
                    person2Score: statsPreview.comparison.person2.totalMessages,
                    winner: statsPreview.comparison.winner.mostMessages,
                    emoji: '💬',
                    funnyComment: 'Alguém aqui não para de falar! 😅',
                  },
                  {
                    category: 'Mais emotivo',
                    metric: 'Emojis usados',
                    person1Score: statsPreview.comparison.person1.totalEmojis,
                    person2Score: statsPreview.comparison.person2.totalEmojis,
                    winner: statsPreview.comparison.winner.mostEmojis,
                    emoji: '😊',
                    funnyComment: 'Não vive sem um emoji! 💕',
                  },
                ]}
                person1Name={participants.person1.name}
                person2Name={participants.person2.name}
                overallWinner={statsPreview.comparison.winner.mostMessages}
              />
            </div>
          )}

          {/* Fun Facts Preview */}
          {statsPreview.fun && (
            <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                🤯 Curiosidades sobre vocês
              </h3>
              <div className="space-y-3">
                {statsPreview.fun.funFacts?.slice(0, 3).map((fact, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                    <p className="text-gray-700">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Card para Stories</h2>
            </div>
            <ShareableCard card={cardPreview} />
            <p className="text-center text-sm text-gray-600 mt-6">
              Na versão completa você recebe vários cards prontos para compartilhar! 📱✨
            </p>
          </div>

          {/* Locked Content Teaser */}
          <div className="bg-gradient-to-br from-gray-800 via-purple-900 to-pink-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Lock className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Versão Completa</h2>
              </div>
              
              <p className="text-center text-lg mb-6 opacity-90">
                Desbloqueie a história completa e receba:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold">Linha do tempo completa</h3>
                  </div>
                  <p className="text-sm opacity-80">Todos os capítulos da sua história, do início até hoje</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-pink-300" />
                    <h3 className="font-bold">Modo Romance</h3>
                  </div>
                  <p className="text-sm opacity-80">Versão emocional e romântica da história</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-300" />
                    <h3 className="font-bold">Modo Disputa completo</h3>
                  </div>
                  <p className="text-sm opacity-80">Todas as batalhas e estatísticas detalhadas</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔍</span>
                    <h3 className="font-bold">Modo Exposed</h3>
                  </div>
                  <p className="text-sm opacity-80">Arquivos secretos e padrões revelados</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-5 h-5 text-green-300" />
                    <h3 className="font-bold">Cards ilimitados</h3>
                  </div>
                  <p className="text-sm opacity-80">Vários cards prontos para Stories e posts</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold">Link compartilhável</h3>
                  </div>
                  <p className="text-sm opacity-80">Página pública para mostrar para amigos</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  disabled
                  className="inline-flex items-center gap-2 bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold cursor-not-allowed opacity-75 border-2 border-white/30"
                >
                  <Lock className="w-5 h-5" />
                  Em breve: Desbloquear versão completa
                </button>
                <p className="text-sm mt-3 opacity-75">
                  🚀 Sistema de pagamento será adicionado em breve!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Gostou da prévia?
            </h3>
            <p className="text-gray-600 mb-6">
              Crie mais histórias incríveis com suas conversas!
            </p>
            <Link
              href="/criar"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <Zap className="w-5 h-5" />
              Criar nova história
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Nosso Timeline. Feito com 💕 para eternizar suas memórias.
          </p>
        </div>
      </footer>
    </div>
  );
}
