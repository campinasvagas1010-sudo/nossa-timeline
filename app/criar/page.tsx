'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, Heart, Users, Home as HomeIcon, Loader2, Image as ImageIcon, FileText, CheckCircle2, ArrowLeft, Trophy, TrendingUp, Share2, Sparkles, ChevronLeft, ChevronRight, Instagram, Download, Lock, Clock, MessageCircle } from 'lucide-react';
import { RelationType } from '@/types/story';
import JSZip from 'jszip';
import { parseWhatsAppConversation, extractParticipants, ParticipantInfo } from '@/lib/whatsapp-parser';
import ParticipantConfirmationModal from '@/components/ParticipantConfirmationModal';
import PaymentModal from '@/components/PaymentModal';
import { toPng } from 'html-to-image';

interface Card {
  id: string;
  title: string;
  winner: string;
  stat: string;
  statLabel: string;
  confidence: number;
}

interface Moment {
  title: string;
  emoji: string;
  category: string;
  description: string;
  snippet: string;
}

export default function CriarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    file: null as File | null,
    relationType: 'casal' as RelationType,
    person1Name: '',
    person2Name: '',
    person1Photo: null as File | null,
    person2Photo: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resultCards, setResultCards] = useState<Card[] | null>(null);
  const [resultMoments, setResultMoments] = useState<Moment[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timelineCardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [participants, setParticipants] = useState<ParticipantInfo[] | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [parsedFileContent, setParsedFileContent] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    // Validar tamanho (40MB para ZIP, 20MB para TXT)
    const maxSize = fileName.endsWith('.zip') ? 40 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ ...errors, file: `Arquivo muito grande. Máximo ${maxSize / 1024 / 1024}MB.` });
      return;
    }

    // Se for ZIP, descompactar e extrair .txt
    if (fileName.endsWith('.zip')) {
      try {
        setLoading(true);
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        
        // Procurar arquivo .txt dentro do ZIP
        let txtFile: File | null = null;
        let txtContent = '';
        
        for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
          if (filename.toLowerCase().endsWith('.txt') && !zipEntry.dir) {
            // Extrair conteúdo do .txt
            txtContent = await zipEntry.async('string');
            
            // Criar novo File a partir do conteúdo
            const blob = new Blob([txtContent], { type: 'text/plain' });
            txtFile = new File([blob], filename, { type: 'text/plain' });
            break;
          }
        }
        
        if (!txtFile || !txtContent) {
          setErrors({ ...errors, file: 'Nenhum arquivo .txt encontrado no ZIP. Verifique o arquivo exportado.' });
          setLoading(false);
          return;
        }
        
        // Validar tamanho do TXT extraído
        if (txtFile.size > 20 * 1024 * 1024) {
          setErrors({ ...errors, file: 'Arquivo .txt extraído é muito grande. Máximo 20MB.' });
          setLoading(false);
          return;
        }
        
        setFormData({ ...formData, file: txtFile });
        setErrors({ ...errors, file: '' });
        
        // Parse conversation to extract participants
        try {
          const parsed = parseWhatsAppConversation(txtContent);
          const detectedParticipants = extractParticipants(parsed.messages);
          
          if (detectedParticipants.length >= 2) {
            setParticipants(detectedParticipants.slice(0, 2)); // Only first 2
            setParsedFileContent(txtContent);
            setShowParticipantModal(true);
          }
        } catch (parseError) {
          console.error('Error parsing participants:', parseError);
        }
        
        setLoading(false);
        
      } catch (error) {
        console.error('Erro ao descompactar ZIP:', error);
        setErrors({ ...errors, file: 'Erro ao processar arquivo ZIP. Verifique se o arquivo está correto.' });
        setLoading(false);
      }
    }
    // Se for .txt direto
    else if (fileName.endsWith('.txt')) {
      setFormData({ ...formData, file });
      setErrors({ ...errors, file: '' });
      
      // Parse conversation to extract participants
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            const parsed = parseWhatsAppConversation(content);
            const detectedParticipants = extractParticipants(parsed.messages);
            
            if (detectedParticipants.length >= 2) {
              setParticipants(detectedParticipants.slice(0, 2)); // Only first 2
              setParsedFileContent(content);
              setShowParticipantModal(true);
            }
          } catch (parseError) {
            console.error('Error parsing participants:', parseError);
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
    // Formato não suportado
    else {
      setErrors({ ...errors, file: 'Formato não suportado. Envie um arquivo .txt ou .zip' });
    }
  };

  const handleParticipantConfirmation = (mapping: { participant1: string; participant2: string }) => {
    // Auto-fill the names from detected participants
    setFormData({
      ...formData,
      person1Name: mapping.participant1,
      person2Name: mapping.participant2
    });
    setShowParticipantModal(false);
  };

  const handlePhotoChange = (person: 'person1' | 'person2') => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar se é imagem
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, [person]: 'Por favor, envie uma imagem' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setErrors({ ...errors, [person]: 'Imagem muito grande. Máximo 5MB.' });
        return;
      }
      setFormData({ ...formData, [`${person}Photo`]: file });
      setErrors({ ...errors, [person]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.file) {
      newErrors.file = 'Por favor, envie o arquivo da conversa';
    }
    if (!formData.person1Name.trim()) {
      newErrors.person1Name = 'Por favor, preencha o primeiro nome';
    }
    if (!formData.person2Name.trim()) {
      newErrors.person2Name = 'Por favor, preencha o segundo nome';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar FormData para enviar ao backend
      const formDataToSend = new FormData();
      if (formData.file) formDataToSend.append('file', formData.file);
      formDataToSend.append('relationType', formData.relationType);
      formDataToSend.append('person1Name', formData.person1Name);
      formDataToSend.append('person2Name', formData.person2Name);
      if (formData.person1Photo) formDataToSend.append('person1Photo', formData.person1Photo);
      if (formData.person2Photo) formDataToSend.append('person2Photo', formData.person2Photo);

      // Chamar API
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar história');
      }

      if (data.success && data.previewId && data.data) {
        // Salvar previewId para usar no pagamento
        setPreviewId(data.previewId);
        
        // Usar dados que já vieram no POST (não precisa fazer GET)
        if (data.data.cards) {
          setResultCards(data.data.cards);
          setResultMoments(data.data.moments || []);
          setShowResults(true);
          setLoading(false);
          
          // Scroll suave até os resultados
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } else {
          throw new Error('Dados dos cards não encontrados');
        }
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro ao gerar história:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Erro ao processar. Tente novamente.' 
      });
      setLoading(false);
    }
  };

  const relationTypeOptions = [
    { value: 'casal', label: 'Casal', emoji: '💕', description: 'História de amor romântica' },
    { value: 'amizade', label: 'Amizade', emoji: '🤝', description: 'História de parceria' },
  ];

  const shareCardToInstagram = async (cardId: string) => {
    const cardElement = cardRefs.current[cardId];
    if (!cardElement) return;

    setIsDownloading(true);
    try {
      // Criar um container temporário com o card + marca d'água
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1080px';
      tempContainer.style.height = '1920px';
      document.body.appendChild(tempContainer);

      // Clonar o card (já está com scale, precisamos pegar os elementos internos)
      const bgDiv = cardElement.querySelector('div[style*="1080px"]') as HTMLElement;
      if (!bgDiv) {
        document.body.removeChild(tempContainer);
        setIsDownloading(false);
        return;
      }
      
      const clonedBg = bgDiv.cloneNode(true) as HTMLElement;
      clonedBg.style.transform = 'none';
      clonedBg.style.width = '1080px';
      clonedBg.style.height = '1920px';
      tempContainer.appendChild(clonedBg);

      // Adicionar marca d'água
      const watermark = document.createElement('div');
      watermark.style.position = 'absolute';
      watermark.style.bottom = '60px';
      watermark.style.left = '0';
      watermark.style.right = '0';
      watermark.style.display = 'flex';
      watermark.style.justifyContent = 'center';
      watermark.style.alignItems = 'center';
      watermark.style.gap = '12px';
      watermark.style.padding = '24px';
      watermark.style.background = 'rgba(0, 0, 0, 0.5)';
      watermark.style.backdropFilter = 'blur(10px)';
      
      watermark.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <span style="
          color: white; 
          font-size: 32px; 
          font-weight: 700; 
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.02em;
        ">
          envie a sua conversa para<br/>nossa-timeline.com
        </span>
      `;
      
      tempContainer.appendChild(watermark);

      // Gerar imagem do container temporário
      const dataUrl = await toPng(tempContainer, {
        quality: 1,
        pixelRatio: 2
      });

      // Remover container temporário
      document.body.removeChild(tempContainer);

      // Converter dataUrl para Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `nosso-timeline-${cardId}.png`, { type: 'image/png' });

      // Tentar usar Web Share API (funciona em mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Nosso Timeline',
          text: `${resultCards?.find(c => c.id === cardId)?.title} - ${formData.person1Name} e ${formData.person2Name} 💕`
        });
      } else {
        // Fallback: fazer download
        const link = document.createElement('a');
        link.download = `nosso-timeline-${cardId}.png`;
        link.href = dataUrl;
        link.click();
      }

      setIsDownloading(false);
    } catch (error) {
      console.error('Erro ao compartilhar card:', error);
      setIsDownloading(false);
      alert('Erro ao gerar imagem para compartilhar');
    }
  };

  const shareTimelineCard = async (momentIndex: number) => {
    const cardElement = timelineCardRefs.current[momentIndex];
    if (!cardElement) return;

    setIsDownloading(true);
    try {
      // Criar um container temporário com o card + marca d'água
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '600px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '40px';
      tempContainer.style.borderRadius = '24px';
      document.body.appendChild(tempContainer);

      // Clonar o card
      const clonedCard = cardElement.cloneNode(true) as HTMLElement;
      clonedCard.style.width = '100%';
      tempContainer.appendChild(clonedCard);

      // Adicionar marca d'água
      const watermark = document.createElement('div');
      watermark.style.marginTop = '24px';
      watermark.style.paddingTop = '24px';
      watermark.style.borderTop = '2px solid #e5e7eb';
      watermark.style.display = 'flex';
      watermark.style.justifyContent = 'center';
      watermark.style.alignItems = 'center';
      watermark.style.gap = '12px';
      
      watermark.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span style="
          color: #6b7280; 
          font-size: 16px; 
          font-weight: 600; 
          font-family: 'Inter', sans-serif;
        ">
          nossa-timeline.com
        </span>
      `;
      
      tempContainer.appendChild(watermark);

      // Gerar imagem do container temporário
      const dataUrl = await toPng(tempContainer, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: 'white'
      });

      // Remover container temporário
      document.body.removeChild(tempContainer);

      // Converter dataUrl para Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const moment = resultMoments?.[momentIndex];
      const file = new File([blob], `timeline-${moment?.title.replace(/\s+/g, '-')}.png`, { type: 'image/png' });

      // Tentar usar Web Share API (funciona em mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Nosso Timeline',
          text: `${moment?.title} - ${formData.person1Name} e ${formData.person2Name}`
        });
      } else {
        // Fallback: fazer download
        const link = document.createElement('a');
        link.download = `timeline-${moment?.title.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      }

      setIsDownloading(false);
    } catch (error) {
      console.error('Erro ao compartilhar card da timeline:', error);
      setIsDownloading(false);
      alert('Erro ao gerar imagem para compartilhar');
    }
  };

  const handleDownloadCard = async (cardId: string) => {
    const cardElement = cardRefs.current[cardId];
    if (!cardElement) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardElement, {
        quality: 1,
        pixelRatio: 2,
        width: 1080,
        height: 1920
      });

      // Converter dataUrl para Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `nosso-timeline-${cardId}.png`, { type: 'image/png' });

      // Tentar usar Web Share API (funciona em mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Nosso Timeline',
          text: `Resultado da análise: ${resultCards?.find(c => c.id === cardId)?.title} - ${formData.person1Name} vs ${formData.person2Name}`
        });
      } else {
        // Fallback: download direto (desktop)
        const link = document.createElement('a');
        link.download = `nosso-timeline-${cardId}.png`;
        link.href = dataUrl;
        link.click();
        
        // Mostrar mensagem com instrução
        alert('✅ Imagem salva!\n\n📱 Abra o Instagram e poste no Stories para compartilhar com seus amigos!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar card:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const nextCard = () => {
    if (resultCards && currentCardIndex < resultCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Participant Confirmation Modal */}
      {showParticipantModal && participants && participants.length >= 2 && (
        <ParticipantConfirmationModal
          participants={participants}
          onConfirm={handleParticipantConfirmation}
          onClose={() => setShowParticipantModal(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
          <Link href="/" className="flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="object-contain hover:scale-105 transition-transform"
            />
          </Link>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Título da página */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Crie sua história
            </h2>
            <p className="text-lg text-gray-600">
              Preencha os dados abaixo para criar uma linha do tempo inesquecível
            </p>
          </div>

          {/* Como exportar do WhatsApp */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border-2 border-green-200">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  📱 Como exportar sua conversa do WhatsApp
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <p className="leading-relaxed"><strong>Abra a conversa</strong> no WhatsApp</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <p className="leading-relaxed">Toque nos <strong>3 pontinhos</strong> (menu) no canto superior direito</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <p className="leading-relaxed">Selecione <strong>"Mais"</strong> → <strong>"Exportar conversa"</strong></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <p className="leading-relaxed">Escolha <strong>"Sem mídia"</strong> (apenas o arquivo .txt)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                    <p className="leading-relaxed">Envie o arquivo para você mesmo por e-mail ou salve no dispositivo</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">
                    💡 <strong>Dica:</strong> O arquivo virá como .txt ou .zip. Aceitos os dois formatos!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Upload do arquivo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-5 h-5 inline mr-2" />
                Conversa do WhatsApp (.txt ou .zip) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".txt,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    loading
                      ? 'border-blue-400 bg-blue-50 cursor-wait'
                      : formData.file 
                      ? 'border-green-400 bg-green-50' 
                      : errors.file 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {loading ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
                      <p className="text-sm font-medium text-gray-700">Extraindo arquivo...</p>
                    </div>
                  ) : formData.file ? (
                    <div className="text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">{formData.file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(formData.file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Clique para fazer upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Arquivo .txt ou .zip do WhatsApp
                      </p>
                    </div>
                  )}
                </label>
              </div>
              {errors.file && (
                <p className="text-red-500 text-sm mt-2">{errors.file}</p>
              )}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">
                  💡 <strong>Como exportar:</strong> WhatsApp → Conversa → ⋮ → Mais → Exportar conversa → Sem mídia
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  ✅ Aceita .txt (Android) e .zip (iPhone)
                </p>
              </div>
            </div>

            {/* Tipo de relação - Switch */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de relação *
              </label>
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1 max-w-md">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, relationType: 'casal' })}
                  className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    formData.relationType === 'casal'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg mr-2">💕</span>
                  Casal
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, relationType: 'amizade' })}
                  className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    formData.relationType === 'amizade'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg mr-2">🤝</span>
                  Amigos
                </button>
              </div>
            </div>

            {/* Nomes das pessoas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Primeiro nome *
                  {participants && formData.person1Name && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-normal">
                      <CheckCircle2 size={14} />
                      Detectado
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.person1Name}
                  onChange={(e) => setFormData({ ...formData, person1Name: e.target.value })}
                  placeholder="Ex: Ana"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.person1Name ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.person1Name && (
                  <p className="text-red-500 text-sm mt-1">{errors.person1Name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Segundo nome *
                  {participants && formData.person2Name && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-normal">
                      <CheckCircle2 size={14} />
                      Detectado
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.person2Name}
                  onChange={(e) => setFormData({ ...formData, person2Name: e.target.value })}
                  placeholder="Ex: Bruno"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.person2Name ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.person2Name && (
                  <p className="text-red-500 text-sm mt-1">{errors.person2Name}</p>
                )}
              </div>
            </div>

            {/* Erro de submissão */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando sua história...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Criar minha Timeline
                </>
              )}
            </button>

            {/* Disclaimer privacidade */}
            <p className="text-xs text-gray-500 text-center">
              🔒 Suas conversas são privadas e seguras. Não armazenamos suas mensagens após a criação da história.
            </p>
          </form>

          {/* Seção de Resultados */}
          {showResults && resultCards && (
            <div ref={resultsRef} className="mt-12 space-y-8 animate-fade-in">
              {/* Header com nomes */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
                  <span className="text-2xl font-bold text-pink-500">{formData.person1Name}</span>
                  <span className="text-2xl">{formData.relationType === 'casal' ? '💕' : 'e'}</span>
                  <span className="text-2xl font-bold text-blue-500">{formData.person2Name}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                  <Sparkles className="w-10 h-10 text-purple-500" />
                  Resultados da Análise
                </h2>
                <p className="text-lg text-gray-600">
                  {formData.relationType === 'casal' ? 'Relacionamento analisado com IA!' : 'Amizade analisada com IA!'}
                </p>
              </div>

              {/* Carrossel de Cards */}
              <div className="relative max-w-md mx-auto">
                {/* Card atual */}
                <div className="flex flex-col items-center gap-4">
                  {resultCards[currentCardIndex] && (() => {
                    const card = resultCards[currentCardIndex];
                    return (
                      <>
                        {/* Card no formato Stories (escala 0.25: 1080px → 270px, 1920px → 480px) */}
                        <div 
                          ref={(el) => { cardRefs.current[card.id] = el; }}
                          className="relative overflow-hidden rounded-3xl shadow-2xl" 
                          style={{ width: '270px', height: '480px' }}
                        >
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
                          <div
                            style={{
                              width: '1080px',
                              height: '1920px',
                              backgroundImage: `url(/cards/${card.id}.png)`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
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
                          {/* Campo Superior: NOME DO VENCEDOR */}
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
                                fontSize: card.winner.length > 8 ? '90px' : card.winner.length > 6 ? '110px' : '140px',
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
                              {card.winner.toUpperCase()}
                            </p>
                          </div>

                          {/* Campo Inferior: RESULTADO (stat) */}
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
                              {card.stat}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botões de ação do card */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => shareCardToInstagram(card.id)}
                          disabled={isDownloading}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Instagram className="w-5 h-5" />
                              Compartilhar no Instagram
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  );
                })()}
                </div>

                {/* Navegação do carrossel */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={prevCard}
                    disabled={currentCardIndex === 0}
                    className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>

                  <div className="flex gap-2">
                    {resultCards.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentCardIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          index === currentCardIndex 
                            ? 'bg-purple-500 w-8' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextCard}
                    disabled={currentCardIndex === resultCards.length - 1}
                    className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                {/* Contador de cards */}
                <p className="text-center text-gray-600 mt-4 font-medium">
                  Card {currentCardIndex + 1} de {resultCards.length}
                </p>
              </div>

              {/* Preview da Timeline + Paywall */}
              <div className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                      <Sparkles className="w-8 h-8 text-purple-500" />
                      Linha do Tempo Completa
                    </h3>
                    <p className="text-gray-600">
                      Reviva cada momento especial da sua história
                    </p>
                  </div>

                  {/* Timeline com dados reais */}
                  <div className="relative space-y-8 mb-8">
                    {/* Linha vertical */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-transparent -translate-x-1/2"></div>

                    {/* Momentos intrigantes reais da conversa */}
                    {resultMoments && resultMoments.slice(0, 4).map((moment, index) => {
                      const isLeft = index % 2 === 0;
                      const gradientColors = index % 2 === 0 
                        ? 'from-pink-500 to-rose-600' 
                        : 'from-purple-500 to-pink-600';
                      const borderColor = index === 0 ? 'border-pink-200' : 'border-purple-200';
                      
                      return (
                        <div key={index} className={`relative flex items-center justify-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                          <div className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${gradientColors} rounded-xl items-center justify-center text-white shadow-xl z-10 ${isLeft ? '' : '-rotate-3'}`}>
                            <span className="text-2xl">{moment.emoji}</span>
                          </div>

                          <div className={`w-full md:w-[calc(50%-3rem)] px-4 md:px-0 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                            <div 
                              ref={(el) => { timelineCardRefs.current[index] = el; }}
                              className={`bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border ${borderColor}`}
                            >
                              <div className={`flex items-center gap-2 mb-3 ${isLeft ? '' : 'md:justify-end'}`}>
                                {isLeft && <span className="text-2xl">{moment.emoji}</span>}
                                <div className={`bg-gradient-to-br ${gradientColors} px-4 py-1.5 rounded-full shadow-lg`}>
                                  <p className="text-sm font-black text-white tracking-wider">{moment.category}</p>
                                </div>
                                {!isLeft && <span className="text-2xl">{moment.emoji}</span>}
                              </div>
                              
                              <h3 className={`text-xl font-black text-gray-900 mb-3 leading-tight ${isLeft ? '' : 'md:text-right'}`}>
                                {moment.title}
                              </h3>
                              
                              <p className={`text-gray-600 text-sm mb-3 ${isLeft ? '' : 'md:text-right'}`}>
                                {moment.description}
                              </p>

                              {moment.snippet && (
                                <div className={`bg-gray-50 rounded-lg p-3 mb-3 ${isLeft ? '' : 'md:text-right'}`}>
                                  <p className="text-xs text-gray-700 italic line-clamp-2">
                                    "{moment.snippet}"
                                  </p>
                                </div>
                              )}

                              <div className={`mt-3 pt-3 border-t ${isLeft ? 'border-pink-100' : 'border-purple-100'} flex items-center justify-between ${isLeft ? '' : 'md:flex-row-reverse'} text-xs`}>
                                <div className={`flex items-center gap-1.5 text-gray-600 font-medium`}>
                                  <MessageCircle className={`w-3 h-3 ${isLeft ? 'text-pink-500' : 'text-purple-500'}`} />
                                  <span>Momento real</span>
                                </div>
                                <button
                                  onClick={() => shareTimelineCard(index)}
                                  disabled={isDownloading}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${gradientColors} text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-xs`}
                                >
                                  <Share2 className="w-3 h-3" />
                                  Compartilhar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Blur + Cadeado */}
                    <div className="relative">
                      {/* Momentos bloqueados com blur */}
                      <div className="blur-sm opacity-40 pointer-events-none space-y-8">
                        {/* Momento bloqueado 1 */}
                        <div className="relative flex items-center justify-center md:justify-start">
                          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-400 rounded-xl items-center justify-center text-white shadow-xl z-10">
                            <Heart className="w-6 h-6" />
                          </div>
                          <div className="w-full md:w-[calc(50%-3rem)] px-4 md:px-0 md:pr-8">
                            <div className="bg-gray-100 rounded-2xl p-5">
                              <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
                              <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>

                        {/* Momento bloqueado 2 */}
                        <div className="relative flex items-center justify-end">
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center text-white shadow-xl z-10">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div className="w-[calc(50%-3rem)] pl-8">
                            <div className="bg-gray-100 rounded-2xl p-5">
                              <div className="h-4 bg-gray-300 rounded w-1/3 mb-3 ml-auto"></div>
                              <div className="h-6 bg-gray-300 rounded w-2/3 mb-2 ml-auto"></div>
                              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                              <div className="h-4 bg-gray-300 rounded w-3/4 ml-auto"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Overlay com cadeado - MELHORADO */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white via-white/95 to-white/80 pt-12">
                        <div className="text-center p-8 max-w-lg">
                          <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-xl opacity-60 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-2xl p-5 shadow-2xl">
                              <Lock className="w-14 h-14 text-white" />
                            </div>
                          </div>
                          <h4 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
                            +13 momentos marcantes bloqueados
                          </h4>
                          <p className="text-lg text-gray-700 mb-6 font-medium leading-relaxed">
                            As pessoas ficam <span className="text-purple-600 font-bold">chocadas</span> com os acontecimentos que descobrem por aqui... <br/>
                            <span className="text-orange-600 font-bold">Clique e desbloqueie</span> a linha completa com os acontecimentos mais marcantes <span className="text-pink-600 font-bold">(que você nem lembrava!)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Premium - MELHORADO */}
                  <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-2xl p-8 shadow-2xl mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
                    <div className="relative z-10">
                      <h4 className="text-2xl font-black text-white mb-6 text-center flex items-center justify-center gap-2">
                        <Sparkles className="w-7 h-7" />
                        O que você ganha com o Premium
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <CheckCircle2 className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white">Timeline completa</p>
                            <p className="text-sm text-white/90">Todos os momentos marcantes analisados</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <CheckCircle2 className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white">Relatório detalhado</p>
                            <p className="text-sm text-white/90">Estatísticas completas da conversa</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <CheckCircle2 className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white">Página compartilhável</p>
                            <p className="text-sm text-white/90">Link único para mostrar aos amigos</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <CheckCircle2 className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white">Todos os cards desbloqueados</p>
                            <p className="text-sm text-white/90">Compartilhe quantos quiser</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Premium - MELHORADO */}
                  <div className="text-center">
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all inline-flex items-center gap-3 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Trophy className="w-7 h-7 relative z-10 animate-bounce" />
                      <span className="relative z-10">Desbloquear Premium por R$ 9,90</span>
                      <Sparkles className="w-7 h-7 relative z-10 animate-pulse" />
                    </button>
                    <p className="text-sm text-gray-500 mt-3">
                      🔒 Pagamento seguro via PIX
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA para compartilhar */}
              <div className="mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-8 text-white text-center shadow-xl">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Share2 className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Gostou do resultado?</h3>
                </div>
                <p className="text-lg opacity-90 mb-6">
                  Compartilhe com seus amigos e descubra os segredos das conversas deles!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const cardEmojis: Record<string, string> = {
                        brigas: '⚔️',
                        ciume: '😠',
                        demora: '⏰',
                        orgulho: '👑',
                        vacuo: '👻'
                      };
                      const text = `Analisei minha conversa no Nosso Timeline! 💕\n\nResultados:\n${resultCards.map(c => `${cardEmojis[c.id] || '🎯'} ${c.title}: ${c.winner} (${c.stat} ${c.statLabel})`).join('\n')}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Compartilhar no WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setResultCards(null);
                      setResultMoments(null);
                      setFormData({
                        file: null,
                        relationType: 'casal',
                        person1Name: '',
                        person2Name: '',
                        person1Photo: null,
                        person2Photo: null,
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all"
                  >
                    Criar nova análise
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {previewId && (
        <PaymentModal
          isOpen={showPaymentModal}
          previewId={previewId}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={(slug) => router.push(`/pagamento/${slug}`)}
        />
      )}
    </div>
  );
}
