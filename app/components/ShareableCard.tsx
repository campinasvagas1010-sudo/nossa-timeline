'use client'

import { useRef, useState, useEffect } from 'react'
import domtoimage from 'dom-to-image-more'

interface ShareableCardProps {
  title: string
  description: string
  date: string
  category: 'AMOR' | 'AMIZADE'
  topic?: string
  onClose: () => void
}

export default function ShareableCard({ title, description, date, category, topic, onClose }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Gerar PNG automaticamente ao abrir
  useEffect(() => {
    const generateImage = async () => {
      // Aguardar imagem de fundo carregar
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!cardRef.current) return

      try {
        const dataUrl = await domtoimage.toPng(cardRef.current, {
          width: 1080,
          height: 1920,
          cacheBust: true,
        })
        setGeneratedImage(dataUrl)
      } catch (err) {
        console.error('Erro ao gerar imagem:', err)
        setError('Erro ao gerar imagem. Tente novamente.')
      } finally {
        setIsGenerating(false)
      }
    }

    generateImage()
  }, [])

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = `nossa-timeline-${Date.now()}.png`
    link.href = generatedImage
    link.click()
  }

  const handleShare = async () => {
    if (!generatedImage) return

    try {
      // Converter dataUrl para Blob
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const file = new File([blob], 'nossa-timeline.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Nossa Timeline',
          text: 'Confira esse momento especial! 💕',
        })
      } else {
        // Fallback: baixar
        handleDownload()
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err)
      handleDownload()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      {/* Elemento oculto para renderização */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={cardRef}
          style={{
            position: 'relative',
            width: '1080px',
            height: '1920px',
          }}
        >
          {/* Imagem de fundo (tag img, não CSS) */}
          <img
            src="/CARD COMPARTILHÁVEL.png"
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1080px',
              height: '1920px',
              objectFit: 'cover',
              zIndex: 0,
            }}
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
                zIndex: 10,
              }}
            >
              <p
                style={{
                  color: '#FFFFFF',
                  fontSize: '40px',
                  fontWeight: '800',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  margin: 0,
                  padding: 0,
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
              zIndex: 10,
            }}
          >
            <h1
              style={{
                color: '#000000',
                fontSize: title.length > 40 ? '48px' : title.length > 25 ? '58px' : '68px',
                fontWeight: '800',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                letterSpacing: '-0.02em',
                textAlign: 'center',
                lineHeight: '1.1',
                margin: 0,
                padding: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* 3. Área da Data (Interior do Calendário) - X:890 Y:500 W:130 H:95 */}
          <div
            style={{
              position: 'absolute',
              left: '890px',
              top: '500px',
              width: '130px',
              height: '95px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-4deg)',
              zIndex: 10,
            }}
          >
            <p
              style={{
                color: '#000000',
                fontSize: '22px',
                fontWeight: '700',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                textAlign: 'center',
                lineHeight: '1.2',
                margin: 0,
                padding: 0,
              }}
            >
              {date}
            </p>
          </div>

          {/* 4. Área de Conteúdo (Quadrado Roxo) - X:55 Y:730 W:970 H:1050 */}
          <div
            style={{
              position: 'absolute',
              left: '55px',
              top: '730px',
              width: '970px',
              height: '1050px',
              padding: '40px',
              display: 'flex',
              alignItems: 'flex-start',
              zIndex: 10,
            }}
          >
            <p
              style={{
                color: '#FFFFFF',
                fontSize: '36px',
                fontWeight: '500',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                lineHeight: '1.6',
                margin: 0,
                padding: 0,
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Modal com imagem gerada */}
      <div className="relative max-w-[400px] w-full">
        {isGenerating ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Gerando imagem...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold"
            >
              Fechar
            </button>
          </div>
        ) : generatedImage ? (
          <div className="flex flex-col items-center">
            {/* Imagem gerada */}
            <div className="bg-white rounded-lg p-2 mb-4 shadow-2xl">
              <img
                src={generatedImage}
                alt="Card para compartilhar"
                style={{
                  maxHeight: '70vh',
                  width: 'auto',
                  borderRadius: '8px',
                }}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleShare}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
              >
                📱 Compartilhar
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 bg-white text-purple-600 border-2 border-purple-500 py-3 px-6 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                📥 Baixar
              </button>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-white/80 hover:text-white text-sm font-medium"
            >
              ✕ Fechar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
