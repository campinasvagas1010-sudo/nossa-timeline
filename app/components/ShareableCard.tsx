'use client'

import { useRef, useState } from 'react'
import domtoimage from 'dom-to-image-more'

interface ShareableCardProps {
  title: string
  description: string
  date: string
  category: 'AMOR' | 'AMIZADE'
  topic?: string // Badge de tópico (humor, ameaça, engraçado, etc)
  onClose: () => void
}

export default function ShareableCard({ title, description, date, category, topic, onClose }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        width: 1080,
        height: 1920,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      })

      const link = document.createElement('a')
      link.download = `timeline-${category.toLowerCase()}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-[540px] w-full">
        {/* Preview */}
        <div className="bg-white rounded-lg p-4 mb-4 overflow-auto max-h-[70vh]">
          <div style={{ transform: 'scale(0.3)', transformOrigin: 'top center' }}>
            <div
              ref={cardRef}
              className="relative w-[1080px] h-[1920px]"
            >
              {/* Background fixo */}
              <img
                src="/CARD COMPARTILHÁVEL.png"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
                crossOrigin="anonymous"
              />

              {/* 1. Área de Tópico (Pílula Vermelha) - X:40 Y:490 W:420 H:85 */}
              {topic && (
                <div
                  style={{
                    position: 'absolute',
                    left: '40px',
                    top: '490px',
                    width: '420px',
                    height: '85px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontSize: '40px',
                      fontWeight: '900',
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      margin: 0,
                    }}
                  >
                    {topic}
                  </p>
                </div>
              )}

              {/* 2. Área de Título (Faixa Amarela) - X:55 Y:600 W:970 H:130 */}
              <div
                style={{
                  position: 'absolute',
                  left: '55px',
                  top: '600px',
                  width: '970px',
                  height: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px',
                }}
              >
                <h1
                  style={{
                    color: '#000000',
                    fontSize: title.length > 40 ? '50px' : title.length > 25 ? '60px' : '70px',
                    fontWeight: '900',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                    lineHeight: '1.1',
                    margin: 0,
                  }}
                >
                  {title}
                </h1>
              </div>

              {/* 4. Área da Data (Interior do Calendário) - X:890 Y:485 W:130 H:95 */}
              <div
                style={{
                  position: 'absolute',
                  left: '890px',
                  top: '485px',
                  width: '130px',
                  height: '95px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-4deg)',
                }}
              >
                <p
                  style={{
                    color: '#000000',
                    fontSize: '28px',
                    fontWeight: '900',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    textAlign: 'center',
                    lineHeight: '1.2',
                    margin: 0,
                  }}
                >
                  {date}
                </p>
              </div>

              {/* 3. Área de Conteúdo (Quadrado Roxo) - X:55 Y:730 W:970 H:1050 */}
              <div
                style={{
                  position: 'absolute',
                  left: '55px',
                  top: '730px',
                  width: '970px',
                  height: '1050px',
                  padding: '40px',
                }}
              >
                <p
                  style={{
                    color: '#FFFFFF',
                    fontSize: '38px',
                    fontWeight: '400',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '⏳ Gerando...' : '📥 Baixar Imagem'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all"
          >
            ✕ Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
