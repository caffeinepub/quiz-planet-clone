import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetPlayerScore, useGetHighScores } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, RotateCcw, Medal } from 'lucide-react';
import QuizBanner from '../components/QuizBanner';

const TOTAL_QUESTIONS = 20;

function getPerformanceMessage(percentage: number): { emoji: string; title: string; subtitle: string } {
  if (percentage >= 90) return { emoji: '🏆', title: 'Legendary Team!', subtitle: 'You two are unstoppable quiz champions!' };
  if (percentage >= 75) return { emoji: '🌟', title: 'Amazing Teamwork!', subtitle: 'Outstanding performance — you crushed it!' };
  if (percentage >= 60) return { emoji: '🎉', title: 'Great Job!', subtitle: 'Solid teamwork! Keep practicing together.' };
  if (percentage >= 40) return { emoji: '👍', title: 'Good Effort!', subtitle: 'Not bad! Try again to beat your score.' };
  return { emoji: '💪', title: 'Keep Practicing!', subtitle: 'Every quiz makes you smarter. Try again!' };
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/results' });
  const p1 = (search as { p1: string; p2: string }).p1;
  const p2 = (search as { p1: string; p2: string }).p2;

  const p1ScoreQuery = useGetPlayerScore(p1);
  const p2ScoreQuery = useGetPlayerScore(p2);
  const highScoresQuery = useGetHighScores();

  const p1Score = Number(p1ScoreQuery.data ?? 0);
  const p2Score = Number(p2ScoreQuery.data ?? 0);
  const teamScore = p1Score + p2Score;
  const maxTeamScore = TOTAL_QUESTIONS * 2;
  const percentage = Math.round((teamScore / maxTeamScore) * 100);

  const perf = getPerformanceMessage(percentage);

  const isLoading = p1ScoreQuery.isLoading || p2ScoreQuery.isLoading;

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {/* Header */}
      <header className="py-5 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-gold" />
          <span className="text-gold font-black text-xl tracking-widest uppercase">Quiz Planet</span>
          <Trophy className="w-6 h-6 text-gold" />
        </div>
      </header>

      {/* Banner */}
      <div className="px-4 max-w-3xl mx-auto w-full">
        <QuizBanner />
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-2xl space-y-5">

          {/* Performance Card */}
          <div className="game-card rounded-2xl p-8 border border-gold/30 shadow-game text-center">
            <div className="text-6xl mb-3">{perf.emoji}</div>
            <h1 className="text-3xl font-black text-gold mb-1">{perf.title}</h1>
            <p className="text-game-muted text-sm">{perf.subtitle}</p>

            {/* Team Score */}
            <div className="mt-6 mb-4">
              <div className="text-game-muted text-xs font-bold uppercase tracking-wider mb-2">Team Score</div>
              <div className="text-5xl font-black text-game-text">
                {isLoading ? '...' : teamScore}
                <span className="text-game-muted text-2xl font-bold">/{maxTeamScore}</span>
              </div>
              <div className="text-gold font-bold text-lg mt-1">{percentage}% correct</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-game-surface rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-amber-400 transition-all duration-1000 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Individual Scores */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="game-card border-player1/30">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-player1/20 border border-player1/40 flex items-center justify-center mx-auto mb-3">
                  <span className="text-player1 font-black text-lg">1</span>
                </div>
                <p className="text-game-text font-bold text-sm truncate mb-1">{p1}</p>
                <p className="text-3xl font-black text-gold">{isLoading ? '...' : p1Score}</p>
                <p className="text-game-muted text-xs mt-1">out of {TOTAL_QUESTIONS}</p>
              </CardContent>
            </Card>

            <Card className="game-card border-player2/30">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-player2/20 border border-player2/40 flex items-center justify-center mx-auto mb-3">
                  <span className="text-player2 font-black text-lg">2</span>
                </div>
                <p className="text-game-text font-bold text-sm truncate mb-1">{p2}</p>
                <p className="text-3xl font-black text-gold">{isLoading ? '...' : p2Score}</p>
                <p className="text-game-muted text-xs mt-1">out of {TOTAL_QUESTIONS}</p>
              </CardContent>
            </Card>
          </div>

          {/* High Scores */}
          {highScoresQuery.data && highScoresQuery.data.length > 0 && (
            <div className="game-card rounded-2xl p-5 border border-game-border">
              <div className="flex items-center gap-2 mb-4">
                <Medal className="w-4 h-4 text-gold" />
                <h3 className="text-game-text font-black text-sm uppercase tracking-wider">Top Scores</h3>
              </div>
              <div className="space-y-2">
                {highScoresQuery.data.slice(0, 5).map(([name, score], i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-game-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black w-5 ${i === 0 ? 'text-gold' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-game-muted'}`}>
                        #{i + 1}
                      </span>
                      <span className="text-game-text text-sm font-semibold">{name}</span>
                    </div>
                    <span className="text-gold font-black text-sm">{Number(score)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stars decoration */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.ceil(percentage / 20) ? 'text-gold fill-gold' : 'text-game-muted'}`}
              />
            ))}
          </div>

          {/* Play Again */}
          <Button
            onClick={() => navigate({ to: '/' })}
            className="w-full game-btn-primary h-12 text-base font-black"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again!
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-game-muted text-xs">
        <p>© {new Date().getFullYear()} Quiz Planet Co-op &nbsp;·&nbsp; Built with <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'quiz-planet-coop')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
