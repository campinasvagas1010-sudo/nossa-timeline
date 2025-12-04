import { Battle } from '@/types/story';
import { Trophy, TrendingUp } from 'lucide-react';

interface StatsComparisonProps {
  battles: Battle[];
  person1Name: string;
  person2Name: string;
  overallWinner: string;
}

export function StatsComparison({ battles, person1Name, person2Name, overallWinner }: StatsComparisonProps) {
  return (
    <div className="space-y-6">
      {/* Overall Winner */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white p-6 rounded-2xl text-center shadow-xl">
        <Trophy className="w-12 h-12 mx-auto mb-2" />
        <h3 className="text-2xl font-bold mb-1">Campeão(a) Geral</h3>
        <p className="text-3xl font-black">{overallWinner} 🏆</p>
        <p className="text-sm opacity-90 mt-2">Venceu mais batalhas!</p>
      </div>

      {/* Individual Battles */}
      <div className="grid gap-4">
        {battles.map((battle, index) => {
          const isPerson1Winner = battle.winner === person1Name;
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              {/* Battle header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{battle.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{battle.category}</h4>
                  <p className="text-sm text-gray-600">{battle.metric}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>

              {/* Battle comparison */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Person 1 */}
                <div className={`p-3 rounded-lg ${isPerson1Winner ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-600 mb-1">{person1Name}</p>
                  <p className="text-xl font-bold text-gray-900">{battle.person1Score}</p>
                  {isPerson1Winner && <span className="text-sm">🏆</span>}
                </div>

                {/* Person 2 */}
                <div className={`p-3 rounded-lg ${!isPerson1Winner ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-600 mb-1">{person2Name}</p>
                  <p className="text-xl font-bold text-gray-900">{battle.person2Score}</p>
                  {!isPerson1Winner && <span className="text-sm">🏆</span>}
                </div>
              </div>

              {/* Funny comment */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 text-center font-medium">
                  {battle.funnyComment}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
