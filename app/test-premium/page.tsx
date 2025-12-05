'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Share2, 
  Heart, 
  Sparkles, 
  Home as HomeIcon,
  Lock,
  MessageCircle,
  Clock,
  Twitter,
  TrendingUp,
  EyeOff,
  Eye,
  Instagram,
} from 'lucide-react';

export default function TestPremiumPage() {
  const [hiddenMoments, setHiddenMoments] = useState<number[]>([]);

  // Dados mock
  const story = {
    person1_name: "Maria",
    person2_name: "João",
    relationship_type: "casal",
    total_messages: 15847,
    is_premium: true,
    cards: [
      {
        icon: "💕",
        title: "Mais Carinhoso",
        description: "Maria usa mais expressões de carinho e emojis de coração nas conversas."
      },
      {
        icon: "😂",
        title: "Mais Engraçado",
        description: "João faz mais piadas e usa emojis de risada com frequência."
      },
      {
        icon: "🌙",
        title: "Coruja da Madrugada",
        description: "Maria costuma enviar mensagens mais tarde, especialmente após as 23h."
      },
      {
        icon: "☀️",
        title: "Bom Dia Garantido",
        description: "João sempre manda a primeira mensagem do dia, geralmente antes das 8h."
      }
    ],
    timeline: [
      {
        emoji: "💬",
        title: "Primeira Conversa",
        date: "15 de Janeiro de 2023",
        category: "Início",
        description: "Tudo começou com um 'oi' simples, mas que mudou tudo. A primeira conversa durou 3 horas seguidas!",
        snippet: "Maria: oi! vi que você também gosta de viajar 🌍\nJoão: oi!! sim, adoro! já foi pra onde?\nMaria: já fui pra Europa, e você?\nJoão: ainda não, mas é meu sonho!"
      },
      {
        emoji: "🎬",
        title: "Maratona de Filmes",
        date: "3 de Fevereiro de 2023",
        category: "Momentos",
        description: "Descobriram que amam os mesmos filmes e combinaram uma maratona. Foram 127 mensagens trocadas só sobre cinema!",
        snippet: "João: que tal assistirmos aquele filme que falamos?\nMaria: SIIMMM! quando?\nJoão: que tal sexta à noite?\nMaria: perfeito!! 🍿"
      },
      {
        emoji: "❤️",
        title: "Primeiro 'Eu te amo'",
        date: "14 de Fevereiro de 2023",
        category: "Marco",
        description: "No Dia dos Namorados, após um jantar especial, veio a declaração mais esperada.",
        snippet: "João: hoje foi perfeito\nMaria: foi mesmo ❤️\nJoão: tem uma coisa que eu quero te falar...\nJoão: eu te amo\nMaria: EU TAMBÉM TE AMO MUITO ❤️❤️❤️"
      },
      {
        emoji: "✈️",
        title: "Primeira Viagem Juntos",
        date: "15 de Março de 2023",
        category: "Aventura",
        description: "A primeira viagem a dois! Foram para a praia e não pararam de compartilhar fotos e momentos.",
        snippet: "Maria: olha o pôr do sol! 📸\nJoão: que lindo! mas você é mais linda\nMaria: para com isso hahaha 😊\nJoão: nunca! 💕"
      },
      {
        emoji: "🎂",
        title: "Aniversário Surpresa",
        date: "22 de Abril de 2023",
        category: "Comemoração",
        description: "João organizou uma festa surpresa para Maria. As mensagens do dia mostram toda a emoção!",
        snippet: "Maria: COMO ASSIM VOCÊ FEZ ISSO TUDO???\nJoão: você merece!\nMaria: estou chorando de emoção\nMaria: melhor aniversário da minha vida ❤️"
      },
      {
        emoji: "🏠",
        title: "Morando Juntos",
        date: "1 de Junho de 2023",
        category: "Marco",
        description: "O grande passo! Decidiram morar juntos e começaram a planejar cada detalhe da nova casa.",
        snippet: "João: então... vamos fazer isso?\nMaria: VAMOS! mal posso esperar\nJoão: nossa casa vai ser incrível\nMaria: NOSSA CASA ❤️ amei isso"
      },
      {
        emoji: "🐕",
        title: "Adotaram um Pet",
        date: "15 de Julho de 2023",
        category: "Família",
        description: "Mel, a cachorrinha, entrou na família! As conversas viraram 50% sobre ela.",
        snippet: "Maria: OLHA O QUE A MEL FEZ 😂📸\nJoão: hahahaha ela é muito engraçada\nMaria: nossa filhinha 🥰\nJoão: nossa filhinha peluda!"
      },
      {
        emoji: "💍",
        title: "O Pedido",
        date: "25 de Dezembro de 2023",
        category: "Marco",
        description: "No Natal, veio o pedido mais esperado. Maria disse SIM!",
        snippet: "João: você me faz a pessoa mais feliz do mundo\nJoão: quer casar comigo?\nMaria: SIIIIIIIM ❤️❤️❤️\nMaria: MIL VEZES SIM\nJoão: EU TE AMO TANTO ❤️"
      }
    ]
  };

  const toggleHideMoment = (index: number) => {
    const newHidden = hiddenMoments.includes(index)
      ? hiddenMoments.filter(i => i !== index)
      : [...hiddenMoments, index];
    setHiddenMoments(newHidden);
  };

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    alert(`Compartilhar no ${platform}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Nosso Timeline</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              <Clock className="w-4 h-4" />
              Expira em 47h 23min
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5 text-purple-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl p-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-20 -ml-32 -mb-32"></div>
            
            <div className="relative text-center">
              <div className="mb-6">
                <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-purple-700 rounded-full text-sm font-bold shadow-lg">
                  💕 História de Amor
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
                Maria <span className="text-purple-600">&</span> João
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                  <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    15.847
                  </span>
                  <p className="text-sm text-gray-700 font-semibold mt-1">mensagens trocadas</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                  <span className="text-4xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                    4
                  </span>
                  <p className="text-sm text-gray-700 font-semibold mt-1">análises</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                  <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    8
                  </span>
                  <p className="text-sm text-gray-700 font-semibold mt-1">momentos especiais</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-black text-sm shadow-xl">
                <Sparkles size={18} className="animate-pulse" />
                PREMIUM ATIVO
              </div>
            </div>
          </div>

          {/* Cards Section - Modo Disputa */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Modo Disputa</h2>
              <span className="ml-auto text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-4 h-4" />
                Premium
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {story.cards.map((card, index) => (
                <div 
                  key={index}
                  className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{card.icon}</span>
                      <h3 className="text-xl font-black text-gray-900">{card.title}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl relative border border-gray-100">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Linha do Tempo Completa</h2>
            </div>
            
            <div className="space-y-6">
              {story.timeline.map((moment, index) => {
                const isHidden = hiddenMoments.includes(index);
                
                return (
                  <div
                    key={index}
                    className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0 group hover:border-purple-300 transition-colors"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 group-hover:scale-125 transition-transform shadow-xl flex items-center justify-center">
                      <span className="text-base">{moment.emoji}</span>
                    </div>

                    {/* Content */}
                    <div 
                      id={`moment-card-${index}`}
                      className={`bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all border border-gray-200 ${isHidden ? 'blur-md' : ''}`}
                    >
                      {/* Header com Calendário */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-2xl">{moment.emoji}</span>
                            {moment.title}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">{moment.date}</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                          {moment.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                        {moment.description}
                      </p>

                      {/* Messages (WhatsApp style) */}
                      <div className="space-y-3 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                        {moment.snippet.split('\n').map((line, idx) => {
                          if (!line.trim()) return null;
                          
                          // Detectar quem está falando
                          const isMaria = line.startsWith('Maria:');
                          const isJoao = line.startsWith('João:');
                          
                          // Extrair nome e mensagem
                          const senderName = line.split(':')[0];
                          const message = line.replace(/^[^:]+:\s*/, '');
                          
                          if (isMaria || isJoao) {
                            return (
                              <div
                                key={idx}
                                className={`flex flex-col ${isMaria ? 'items-start' : 'items-end'}`}
                              >
                                <span className="text-xs font-bold text-gray-600 mb-1 px-2">
                                  {senderName}
                                </span>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                                  isMaria 
                                    ? 'bg-white text-gray-800 rounded-tl-sm' 
                                    : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-tr-sm'
                                }`}>
                                  <p className="text-sm font-medium leading-relaxed">{message}</p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>

                      {/* Action Buttons */}
                      {!isHidden && (
                        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                          <button
                            onClick={() => toggleHideMoment(index)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                          >
                            <EyeOff className="w-4 h-4" />
                            Ocultar momento
                          </button>
                          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transform hover:scale-105 transition-all">
                            <Instagram className="w-4 h-4" />
                            Compartilhar no Instagram
                          </button>
                        </div>
                      )}
                      {isHidden && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => toggleHideMoment(index)}
                            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors font-bold"
                          >
                            <Eye className="w-4 h-4" />
                            Mostrar momento
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-10 shadow-xl text-center border border-gray-200">
            <Share2 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-black text-gray-900 mb-6">
              Compartilhe essa história
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-600 hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 bg-blue-400 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button className="flex items-center gap-2 bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 hover:shadow-xl transform hover:scale-105 transition-all">
                <Share2 className="w-5 h-5" />
                Copiar link
              </button>
            </div>
          </div>

          {/* CTA Final */}
          <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-3xl p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -ml-32 -mb-32"></div>
            
            <div className="relative">
              <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h3 className="text-4xl font-black mb-4">
                Crie sua própria história
              </h3>
              <p className="text-xl mb-8 opacity-95 font-medium max-w-2xl mx-auto">
                Transforme suas conversas em uma linda linha do tempo repleta de momentos especiais!
              </p>
              <Link
                href="/criar"
                className="inline-flex items-center gap-3 bg-white text-purple-600 px-10 py-5 rounded-2xl text-xl font-black hover:shadow-2xl transform hover:scale-110 transition-all"
              >
                <Sparkles className="w-6 h-6" />
                Criar minha história
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
