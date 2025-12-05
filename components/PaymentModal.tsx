'use client';

import { useState } from 'react';
import { X, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewId: string;
  onSuccess: (slug: string) => void;
}

export default function PaymentModal({ isOpen, onClose, previewId, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previewId,
          name: formData.name,
          email: formData.email || `${Date.now()}@nossotimeline.com`
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao criar pagamento');
      
      setPaymentData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar');
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (paymentData?.pixCopyPaste) {
      navigator.clipboard.writeText(paymentData.pixCopyPaste);
      alert('✅ Código PIX copiado!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Desbloquear Premium</h2>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full inline-block font-bold">
            R$ 9,90
          </div>
        </div>

        {paymentData ? (
          <div className="space-y-4">
            {paymentData.pixQrCode && (
              <img 
                src={`data:image/png;base64,${paymentData.pixQrCode}`} 
                alt="QR Code PIX" 
                className="w-64 h-64 mx-auto border-4 border-purple-200 rounded-xl" 
              />
            )}
            
            <button onClick={copyPixCode} className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold">
              📋 Copiar código PIX
            </button>

            {/* Email de acesso */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center">
              <p className="font-semibold text-gray-800 mb-1">📧 Seu email de acesso:</p>
              <p className="text-purple-600 font-mono font-bold break-all">{paymentData.email}</p>
              <p className="text-xs text-gray-600 mt-2">⚠️ Anote este email! Você vai precisar dele para acessar a área premium.</p>
            </div>

            {/* Botão de acesso premium */}
            <div className="border-t-2 border-gray-200 pt-4">
              <p className="text-sm text-gray-600 text-center mb-3">
                Após pagar, clique no botão abaixo:
              </p>
              <a 
                href={`/premium?email=${encodeURIComponent(paymentData.email)}`}
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-center shadow-lg"
              >
                ✨ Acessar Área Premium
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Aviso sobre o email */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 mb-4">
              <p className="text-sm text-blue-800 text-center">
                ⚠️ <strong>Importante:</strong> O email será usado para acessar a área premium após o pagamento!
              </p>
            </div>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
              className="w-full px-4 py-3 border rounded-xl"
            />
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email (guarde este email!)"
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 outline-none"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? 'Processando...' : 'Gerar PIX'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
