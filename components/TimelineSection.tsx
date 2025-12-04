import { TimelineChapter } from '@/types/story';
import { Calendar, Heart, Sparkles, Star } from 'lucide-react';

interface TimelineSectionProps {
  chapters: TimelineChapter[];
  isPreview?: boolean;
}

export function TimelineSection({ chapters, isPreview = false }: TimelineSectionProps) {
  const getCategoryColor = (category: TimelineChapter['category']) => {
    const colors = {
      inicio: 'bg-blue-100 text-blue-700 border-blue-300',
      milestone: 'bg-purple-100 text-purple-700 border-purple-300',
      conflito: 'bg-red-100 text-red-700 border-red-300',
      reconciliacao: 'bg-green-100 text-green-700 border-green-300',
      memoria: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      especial: 'bg-pink-100 text-pink-700 border-pink-300',
    };
    return colors[category] || colors.especial;
  };

  const getCategoryIcon = (category: TimelineChapter['category']) => {
    const icons = {
      inicio: <Sparkles className="w-4 h-4" />,
      milestone: <Star className="w-4 h-4" />,
      conflito: <span className="text-base">⚡</span>,
      reconciliacao: <span className="text-base">🤝</span>,
      memoria: <span className="text-base">🎭</span>,
      especial: <Heart className="w-4 h-4" />,
    };
    return icons[category] || icons.especial;
  };

  return (
    <div className="space-y-6">
      {chapters.map((chapter, index) => (
        <div
          key={chapter.id}
          className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0 group hover:border-purple-300 transition-colors"
        >
          {/* Timeline dot */}
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white border-4 border-purple-500 group-hover:scale-110 transition-transform shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center text-xs">
              {chapter.emoji}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{chapter.emoji}</span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {chapter.title}
                  </h3>
                </div>
                {chapter.subtitle && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{chapter.subtitle}</span>
                  </div>
                )}
              </div>
              
              {/* Category badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(chapter.category)} flex items-center gap-1`}>
                {getCategoryIcon(chapter.category)}
                {chapter.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {chapter.description}
            </p>

            {/* Preview indicator */}
            {isPreview && index === chapters.length - 1 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700 font-medium text-center">
                  ✨ Essa é só uma prévia! Desbloqueie para ver toda a história...
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
