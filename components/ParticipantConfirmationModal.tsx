'use client';

import { useState } from 'react';
import { ParticipantInfo } from '@/lib/whatsapp-parser';
import { User, X } from 'lucide-react';

interface ParticipantConfirmationModalProps {
  participants: ParticipantInfo[];
  onConfirm: (mapping: { participant1: string; participant2: string }) => void;
  onClose: () => void;
}

export default function ParticipantConfirmationModal({
  participants,
  onConfirm,
  onClose
}: ParticipantConfirmationModalProps) {
  const [selectedAsUser, setSelectedAsUser] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedAsUser) return;
    
    const otherParticipant = participants.find(p => p.name !== selectedAsUser);
    if (!otherParticipant) return;

    onConfirm({
      participant1: selectedAsUser,
      participant2: otherParticipant.name
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quem é você?
          </h2>
          <p className="text-gray-600">
            Encontramos {participants.length} participantes nesta conversa. Confirme qual é você:
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {participants.map((participant) => (
            <button
              key={participant.name}
              onClick={() => setSelectedAsUser(participant.name)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedAsUser === participant.name
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold text-gray-800">
                    {participant.isPhoneNumber ? '📱' : '👤'} {participant.displayName}
                  </div>
                  {participant.isPhoneNumber && (
                    <div className="text-sm text-gray-500 mt-1">
                      Contato sem nome salvo
                    </div>
                  )}
                </div>
                {selectedAsUser === participant.name && (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedAsUser}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            selectedAsUser
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirmar e Continuar
        </button>
      </div>
    </div>
  );
}
