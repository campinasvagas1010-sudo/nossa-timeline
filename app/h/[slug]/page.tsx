'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Share2, 
  Heart, 
  Sparkles, 
  Home as HomeIcon,
  Loader2,
  Lock,
  MessageCircle,
  Clock,
  Twitter,
} from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';

export default function PublicStoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (slug) {
      loadStory();
    }
  }, [slug]);

  const loadStory = async () => {
    try {
      const response = await fetch(`/api/stories/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setStory(data.story);
      }
    } catch (error) {
      console.error('Erro ao carregar história:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">História não encontrada</h1>
          <Link href="/" className="text-purple-600 hover:underline">Criar minha história</Link>
        </div>
      </div>
    );
  }

  const displayedMoments = story.is_premium ? story.moments : story.moments.slice(0, 4);

  const handleShare = async (platform: 'whatsapp' | 'twitter') => {
    const url = window.location.href;
    const text = `Veja a história de ${story.person1_name} e ${story.person2_name}! 💕`;

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          previewId={story.preview_id || ''}
          onSuccess={(newSlug) => router.push(`/pagamento/${newSlug}`)}
        />
      )}
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Nosso Timeline</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-5 h-5 text-purple-600" />
            </button>
            {!story.is_premium && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Desbloquear Premium
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                {story.relationship_type === 'casal' ? '💕 História de Amor' : '🤝 História de Amizade'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {story.person1_name} {story.relationship_type === 'casal' ? '&' : 'e'} {story.person2_name}
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-600">
              <div>
                <span className="text-3xl font-bold text-purple-600">{story.total_messages.toLocaleString()}</span>
                <p className="text-sm">mensagens</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-300"></div>
              <div>
                <span className="text-3xl font-bold text-pink-600">{story.cards.length}</span>
                <p className="text-sm">análises</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-300"></div>
              <div>
                <span className="text-3xl font-bold text-blue-600">{displayedMoments.length}</span>
                <p className="text-sm">momentos</p>
              </div>
            </div>

            {story.is_premium && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                <Sparkles size={16} />
                Premium
              </div>
            )}
          </div>

          {/* Cards Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Análises da Relação
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {story.cards.map((card: any, index: number) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{card.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                  </div>
                  <p className="text-gray-700">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl relative">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                {story.is_premium ? 'Linha do Tempo Completa' : 'Prévia da Linha do Tempo'}
              </h2>
            </div>
            
            <div className="space-y-8">
              {displayedMoments.map((moment: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{moment.title}</h3>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{moment.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{moment.description}</p>
                      {moment.messages && moment.messages.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {moment.messages.map((msg: any, msgIndex: number) => (
                            <div key={msgIndex} className="bg-white/80 p-3 rounded-lg border border-gray-200">
                              <p className="text-sm font-semibold text-purple-600">{msg.sender}</p>
                              <p className="text-sm text-gray-700 italic">"{msg.text}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Overlay */}
            {!story.is_premium && (
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white to-transparent flex items-end justify-center pb-8">
                <div className="text-center">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-2 border-purple-200">
                    <Lock className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Desbloqueie a História Completa
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Você está vendo apenas 4 momentos. Libere todos os momentos especiais por apenas <span className="font-bold text-purple-600">R$ 9,90</span>!
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Desbloquear por R$ 9,90
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Share Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Compartilhe essa história
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 bg-blue-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copiado!');
                }}
                className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Copiar link
              </button>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl p-8 text-center shadow-2xl">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-3">
              Crie sua própria história
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Transforme suas conversas em uma linda linha do tempo!
            </p>
            <Link
              href="/criar"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Criar minha história
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            © 2024 Nosso Timeline. Feito com 💕 para eternizar suas memórias.
          </p>
          <Link 
            href="/criar"
            className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
          >
            Crie sua própria história →
          </Link>
        </div>
      </footer>
    </div>
  );
}
