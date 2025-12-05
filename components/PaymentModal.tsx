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
            <p className="text-sm text-gray-600 text-center">
              Abra seu app de pagamentos e escaneie o QR Code ou copie o código PIX
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
              className="w-full px-4 py-3 border rounded-xl"
            />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-xl"
            />
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
