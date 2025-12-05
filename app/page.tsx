'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Heart, TrendingUp, Sparkles, Users, Clock, Zap, Menu } from 'lucide-react';
import BattleStoryCard from './components/BattleStoryCard';
import BattleCarousel from './components/BattleCarousel';
import { useState } from 'react';

export default function HomePage() {
  const [timelineMode, setTimelineMode] = useState<'amor' | 'amizade'>('amor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header com Logo */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Espaçador esquerda - Desktop */}
            <nav className="hidden md:flex items-center gap-6 flex-1">
              <button 
                onClick={() => document.getElementById('batalhas')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-gray-600 hover:text-purple-500 font-medium transition-colors"
              >
                Batalhas
              </button>
              <button 
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-gray-600 hover:text-pink-500 font-medium transition-colors"
              >
                Timeline
              </button>
            </nav>

            {/* Espaçador esquerda - Mobile */}
            <div className="md:hidden flex-1"></div>

            {/* Logo Centralizada */}
            <Link href="/" className="group flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Nossa Timeline" 
                width={120} 
                height={120} 
                className="group-hover:scale-105 transition-transform object-contain"
                priority
              />
            </Link>

            {/* CTA Direita - Desktop */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
              <Link 
                href="/criar" 
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Criar Grátis
              </Link>
            </div>

            {/* CTA Direita - Mobile */}
            <div className="md:hidden flex-1 flex justify-end">
              <Link href="/criar">
                <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                  Criar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Já foram criadas +500 histórias incríveis
            </span>
          </div>

          {/* Headline Principal */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up leading-tight">
            Transforme sua conversa do{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
              WhatsApp
            </span>
            <br />
            em uma história incrível
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in max-w-3xl mx-auto">
            Envie sua conversa em <span className="font-semibold">.txt</span> e nós criamos automaticamente uma{' '}
            <span className="font-semibold text-pink-600">linha do tempo</span> com momentos marcantes,{' '}
            <span className="font-semibold text-purple-600">estatísticas incríveis</span> e{' '}
            <span className="font-semibold text-blue-600">cards prontos</span> para compartilhar nas redes sociais
          </p>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/criar"
              className="group bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Criar minha história
              <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button
              onClick={() => document.getElementById('exemplos')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-600 hover:text-gray-900 px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              Ver exemplos
            </button>
          </div>

          {/* Social Proof Rápido */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Perfeito para casais</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>E amizades também</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Pronto em minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* BATALHAS DE CASAIS - SECTION */}
      <section id="batalhas" className="py-20 px-4 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header da seção */}
          <div className="text-center mb-16">
            <div className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-sm mb-4 animate-bounce">
              🔥 CHEGOU A HORA DA VERDADE
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Quem é mais ciumento? Quem briga mais? Quem é mais orgulhoso?
            </h2>
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
              A IA analisou todas as mensagens e vai revelar quem é quem nessa relação. 
              Prepare-se para as verdades mais chocantes! 😱
            </p>
          </div>

          {/* Placar Geral - DESTAQUE */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 relative overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-black text-yellow-300 mb-2">⚡ PLACAR GERAL ⚡</h3>
                  <p className="text-white/90 text-sm">Quem domina essa relação?</p>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  {/* Pedro */}
                  <div className="flex-1 text-center">
                    <Image src="/pedro.png" alt="Pedro" width={96} height={96} className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full shadow-xl border-4 border-white animate-pulse object-cover" />
                    <p className="text-white font-bold text-lg mb-2">Pedro</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <p className="text-yellow-300 font-black text-2xl">3 🏆</p>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center px-4">
                    <div className="text-5xl font-black text-yellow-300 animate-pulse">VS</div>
                  </div>

                  {/* Ana */}
                  <div className="flex-1 text-center">
                    <Image src="/ana.png" alt="Ana" width={96} height={96} className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full shadow-xl border-4 border-white animate-pulse object-cover" />
                    <p className="text-white font-bold text-lg mb-2">Ana</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <p className="text-yellow-300 font-black text-2xl">2 🏆</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carrossel de Batalhas - Card em Destaque */}
          <BattleCarousel />

          {/* CTA Final */}
          <div className="text-center mt-16">
            <p className="text-white text-lg md:text-xl font-medium mb-6">
              Quer descobrir quem <span className="font-black text-yellow-300">realmente domina</span> a sua relação?
            </p>
            <Link href="/criar" className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-5 rounded-full text-lg font-black shadow-2xl hover:scale-110 transition-all duration-300">
              <Zap className="w-6 h-6" />
              Criar Minha Batalha Agora
              <Sparkles className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Como funciona
          </h2>

          <div className="max-w-5xl mx-auto space-y-12">
            {/* Passo 1 - Com visual aprimorado */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200">
              <div className="flex gap-6 items-start mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Exporte sua conversa do WhatsApp</h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Vá até a conversa com a pessoa que você quer e siga os passos abaixo:
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md border border-pink-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center mb-1">1. Abra a conversa</p>
                  <p className="text-xs text-gray-600 text-center">No WhatsApp</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-md border border-pink-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                    <Menu className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center mb-1">2. Toque nos ⋮</p>
                  <p className="text-xs text-gray-600 text-center">3 pontinhos no topo</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-md border border-pink-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center mb-1">3. Exportar conversa</p>
                  <p className="text-xs text-gray-600 text-center">Escolha "Sem mídia"</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-md border border-pink-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center mb-1">4. Pronto!</p>
                  <p className="text-xs text-gray-600 text-center">Arquivo .txt gerado</p>
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Faça upload e preencha os dados</h3>
                <p className="text-lg text-gray-600">
                  Envie o arquivo .txt aqui no site, escolha o tipo de relação (casal ou amizade), 
                  adicione os nomes e fotos (opcional). Clique em "Gerar prévia".
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Receba sua história completa</h3>
                <p className="text-lg text-gray-600">
                  Pronto! Sua linha do tempo, estatísticas e cards já estão prontos. 
                  Compartilhe com seu amor ou amigos e faça todo mundo se emocionar! 💕
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/criar"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              Começar agora
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - O que você vai receber */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            O que você vai receber
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-shadow">
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Estatísticas divertidas</h3>
              <p className="text-gray-600">
                Descubra quem manda mais mensagens, quem deixa no vácuo, quem usa mais emojis, 
                score de compatibilidade e muito mais! Modo Romance vs Modo Disputa vs Modo Exposed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cards para Stories</h3>
              <p className="text-gray-600">
                Receba cards lindos no formato perfeito para Instagram Stories, WhatsApp Status e TikTok.
                Prontinhos para compartilhar e bombar nas redes sociais! 📱✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO TIMELINE DE NAMORO */}
      <section id="timeline" className="bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              Linha do Tempo
            </h2>

            {/* Switch Amor/Amizade */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border-2 border-gray-200 mb-6">
              <button
                onClick={() => setTimelineMode('amor')}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  timelineMode === 'amor'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                💕 Amor
              </button>
              <button
                onClick={() => setTimelineMode('amizade')}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  timelineMode === 'amizade'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🤝 Amizade
              </button>
            </div>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4 leading-relaxed">
              {timelineMode === 'amor' 
                ? 'Tenha uma página mostrando toda a trajetória de vocês com os momentos mais marcantes, em uma página linda e compartilhável' 
                : 'Tenha uma página mostrando toda a trajetória da amizade de vocês com os momentos mais marcantes, em uma página linda e compartilhável'}
            </p>
          </div>

          <div className="relative">
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full ${
              timelineMode === 'amor' 
                ? 'bg-gradient-to-b from-pink-300 via-rose-400 to-pink-300'
                : 'bg-gradient-to-b from-blue-300 via-cyan-400 to-blue-300'
            }`}></div>

            {/* Timeline AMOR */}
            {timelineMode === 'amor' && (
            <div className="space-y-8">
              
              {/* Card 1: Pedro começou a flertar */}
              <div className="relative flex items-center justify-start">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 rotate-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pr-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-pink-200 hover:shadow-pink-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📅</span>
                      <div className="bg-gradient-to-br from-pink-500 to-rose-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">03 MAR 2023</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                      Pedro começou a flertar
                      <span className="text-2xl ml-1">😏</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/pedro.png" alt="Pedro" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Pedro • 22:47</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Oi Ana! Vi que você também gosta de viajar... que tal trocar umas dicas? 😊"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Image src="/ana.png" alt="Ana" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Ana • 22:52</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Claro! Adoro conhecer lugares novos 🌎✨"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-pink-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <Clock className="w-3 h-3 text-pink-500" />
                      <span>A primeira mensagem que mudou tudo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Primeira viagem */}
              <div className="relative flex items-center justify-end">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 -rotate-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pl-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-purple-200 hover:shadow-purple-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3 justify-end">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">10 ABR 2023</p>
                      </div>
                      <span className="text-2xl">📅</span>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight text-right">
                      <span className="text-2xl mr-1">✈️</span>
                      Primeira viagem juntos
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/pedro.png" alt="Pedro" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Pedro • 14:23</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Vamos para Floripa?! Parece bom nessa época do ano"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Ana • 14:25</p>
                            <p className="text-sm font-medium leading-relaxed text-right">
                              "Ahh, eu acho que topo ir sim! 🏖️💕"
                            </p>
                          </div>
                        </div>
                        <Image src="/ana.png" alt="Ana" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-purple-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium justify-end">
                      <span>3 dias • 523 fotos • Inesquecível</span>
                      <Heart className="w-3 h-3 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Primeira briga */}
              <div className="relative flex items-center justify-start">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 rotate-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pr-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-red-200 hover:shadow-red-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📅</span>
                      <div className="bg-gradient-to-br from-red-500 to-orange-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">22 MAI 2023</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                      Primeira briga
                      <span className="text-2xl ml-1">😤</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/pedro.png" alt="Pedro" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Pedro • 19:15</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "O engraçado é que para os seus amigos você está sempre disponível, né? Vamos dar um tempo!"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Ana • 19:18</p>
                            <p className="text-sm font-medium leading-relaxed text-right">
                              "Tá bom então, se prefere assim... 😔"
                            </p>
                          </div>
                        </div>
                        <Image src="/ana.png" alt="Ana" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-red-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <MessageCircle className="w-3 h-3 text-red-500" />
                      <span>Primeira discussão</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Primeira reconciliação */}
              <div className="relative flex items-center justify-end">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 -rotate-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pl-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-green-200 hover:shadow-green-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3 justify-end">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">20 JUN 2023</p>
                      </div>
                      <span className="text-2xl">📅</span>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight text-right">
                      <span className="text-2xl mr-1">🥺</span>
                      Primeira reconciliação
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/pedro.png" alt="Pedro" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Pedro • 23:42</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Me desculpa amor, estava de cabeça quente... Podemos nos ver hoje?"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Ana • 23:44</p>
                            <p className="text-sm font-medium leading-relaxed text-right">
                              "Ok, eu entendo... Me busca no trabalho então."
                            </p>
                          </div>
                        </div>
                        <Image src="/ana.png" alt="Ana" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-green-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium justify-end">
                      <span>O amor venceu mais uma vez</span>
                      <Sparkles className="w-3 h-3 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Pedido de namoro - ESPECIAL */}
              <div className="relative flex items-center justify-start">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 rotate-6 animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pr-8">
                  <div className="bg-gradient-to-br from-white to-pink-50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-pink-400 hover:shadow-pink-400/60 transition-all duration-300 ring-2 ring-pink-200">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-2xl">📅</span>
                      <div className="bg-gradient-to-br from-pink-500 to-rose-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">20 NOV 2023</p>
                      </div>
                      <div className="bg-yellow-400 px-3 py-1 rounded-full shadow-lg">
                        <p className="text-xs font-black text-gray-900">⭐ ESPECIAL</p>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-3 leading-tight">
                      Pedido de namoro
                      <span className="text-3xl ml-1">💍</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/pedro.png" alt="Pedro" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Pedro • 20:30</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Ana, você é a pessoa mais incrível que eu já conheci... quer namorar comigo? 💕🥰"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg border border-yellow-400 max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Ana • 20:31</p>
                            <p className="text-base font-black leading-relaxed text-right">
                              "SIM SIM SIM!!! EU ACEITO!!! 😭❤️✨🎉"
                            </p>
                          </div>
                        </div>
                        <Image src="/ana.png" alt="Ana" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover animate-pulse" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-pink-200 flex items-center gap-1.5 text-xs text-pink-600 font-black">
                      <Heart className="w-4 h-4 fill-pink-600 animate-pulse" />
                      <span>O dia que mudou tudo</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            )}

            {/* Timeline AMIZADE */}
            {timelineMode === 'amizade' && (
            <div className="space-y-8">
              
              {/* Card 1: Primeira mensagem */}
              <div className="relative flex items-center justify-start">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 rotate-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pr-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-blue-200 hover:shadow-blue-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📅</span>
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">15 JAN 2022</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                      Como tudo começou
                      <span className="text-2xl ml-1">✨</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/ana.png" alt="Julia" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Julia • 10:23</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Oi! Vi que você curte as mesmas séries que eu! Vamos trocar spoilers? 😄"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Maria • 10:25</p>
                            <p className="text-sm font-medium leading-relaxed text-right">
                              "Haha com certeza! Adoro fazer amizade com pessoas de bom gosto 😂✨"
                            </p>
                          </div>
                        </div>
                        <Image src="/maria.png" alt="Maria" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>O começo de uma grande amizade</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Primeira festa juntas */}
              <div className="relative flex items-center justify-end">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 -rotate-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pl-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-purple-200 hover:shadow-purple-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3 justify-end">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">05 MAR 2022</p>
                      </div>
                      <span className="text-2xl">📅</span>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight text-right">
                      <span className="text-2xl mr-1">🎉</span>
                      Primeira festa juntas
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/ana.png" alt="Julia" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Julia • 22:15</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Bora pra festa hoje?! Prometo que vai ser épico!"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Maria • 22:17</p>
                            <p className="text-sm font-medium leading-relaxed text-right">
                              "Já tô me arrumando! Bora lacrar 💃✨"
                            </p>
                          </div>
                        </div>
                        <Image src="/maria.png" alt="Maria" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-purple-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium justify-end">
                      <span>Uma noite inesquecível • 247 fotos</span>
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Primeira briga */}
              <div className="relative flex items-center justify-start">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 rotate-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pr-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-orange-200 hover:shadow-orange-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📅</span>
                      <div className="bg-gradient-to-br from-orange-500 to-red-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">18 ABR 2022</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                      Primeira treta
                      <span className="text-2xl ml-1">😠</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/ana.png" alt="Julia" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Julia • 15:42</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Sério que você contou meu segredo pra todo mundo?! Eu confiei em você!"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Maria • 15:47</p>
                            <p className="text-sm font-medium leading-relaxed text-right">
                              "Foi sem querer, eu juro! Me desculpa... 😔"
                            </p>
                          </div>
                        </div>
                        <Image src="/maria.png" alt="Maria" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-orange-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <MessageCircle className="w-3 h-3 text-orange-500" />
                      <span>Toda amizade tem seus momentos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Reconciliação */}
              <div className="relative flex items-center justify-end">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 -rotate-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pl-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-green-200 hover:shadow-green-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3 justify-end">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">22 ABR 2022</p>
                      </div>
                      <span className="text-2xl">📅</span>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight text-right">
                      <span className="text-2xl mr-1">🤗</span>
                      Amizade verdadeira
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/maria.png" alt="Maria" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Maria • 19:30</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "Ju, me desculpa de verdade. Você é minha melhor amiga e eu não quero perder isso 💙"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Julia • 19:32</p>
                            <p className="text-sm font-medium leading-relaxed text-right">
                              "Já te perdoei! Amizade de verdade supera tudo 🥰✨"
                            </p>
                          </div>
                        </div>
                        <Image src="/ana.png" alt="Julia" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-green-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium justify-end">
                      <span>Amizade que supera tudo</span>
                      <Heart className="w-3 h-3 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Viagem das melhores amigas - ESPECIAL */}
              <div className="relative flex items-center justify-start">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 via-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-xl z-10 rotate-6 animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="w-[calc(50%-3rem)] pr-8">
                  <div className="bg-gradient-to-br from-white to-blue-50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-blue-400 hover:shadow-blue-400/60 transition-all duration-300 ring-2 ring-blue-200">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-2xl">📅</span>
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 px-4 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-black text-white tracking-wider">10 JUL 2022</p>
                      </div>
                      <div className="bg-yellow-400 px-3 py-1 rounded-full shadow-lg">
                        <p className="text-xs font-black text-gray-900">⭐ ESPECIAL</p>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-3 leading-tight">
                      Viagem das melhores amigas
                      <span className="text-3xl ml-1">✈️</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Image src="/ana.png" alt="Julia" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover" />
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl rounded-tl-none px-3 py-2 shadow-lg">
                            <p className="text-[10px] font-bold mb-1 opacity-90">Julia • 08:15</p>
                            <p className="text-sm font-medium leading-relaxed">
                              "CHEGAMOS EM PARIS!!! Essa viagem vai ser HISTÓRICA! 🗼✨"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl rounded-tr-none px-3 py-2 shadow-lg border border-yellow-400 max-w-xs">
                            <p className="text-[10px] font-bold mb-1 opacity-90 text-right">Maria • 08:16</p>
                            <p className="text-base font-black leading-relaxed text-right">
                              "MELHOR VIAGEM DA VIDA!!! TE AMO AMIGA! 😭💙🎉✨"
                            </p>
                          </div>
                        </div>
                        <Image src="/maria.png" alt="Maria" width={32} height={32} className="flex-shrink-0 w-8 h-8 rounded-full shadow-md object-cover animate-pulse" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-1.5 text-xs text-blue-600 font-black">
                      <Sparkles className="w-4 h-4 fill-blue-600 animate-pulse" />
                      <span>7 dias • 15 cidades • Amizade eterna</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            )}

          </div>

          <div className="text-center mt-10">
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-8 border-4 border-purple-300 shadow-2xl max-w-3xl mx-auto">
              <div className="mb-6">
                <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full font-black text-sm mb-4">
                  ✨ VERSÃO PREMIUM
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                  Eternize sua história completa
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Desbloqueie a experiência completa da sua Timeline
                </p>
                <div className="flex flex-col items-center justify-center mb-6">
                  <p className="text-gray-600 text-lg mb-2">
                    de <span className="line-through">R$ 39,90</span> por apenas
                  </p>
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
                    R$ 9,90
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-3 text-base text-gray-700 mb-6">
                  <span className="bg-white px-4 py-2 rounded-full font-semibold shadow-sm">✅ Momentos marcantes</span>
                  <span className="bg-white px-4 py-2 rounded-full font-semibold shadow-sm">✅ Página Compartilhável</span>
                  <span className="bg-white px-4 py-2 rounded-full font-semibold shadow-sm">✅ Acesso Vitalício</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/criar" className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-10 py-5 rounded-2xl text-xl font-black shadow-2xl hover:scale-105 transition-all">
                  <Sparkles className="w-6 h-6" />
                  Liberar Minha Página Premium
                  <Heart className="w-6 h-6" />
                </Link>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                💡 Batalhas e Cards permanecem 100% GRÁTIS para sempre
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Simples */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Nosso Timeline. Feito com 💕 para eternizar suas memórias.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Suas conversas são privadas e seguras. Não armazenamos seus dados.
          </p>
        </div>
      </footer>
    </div>
  );
}
