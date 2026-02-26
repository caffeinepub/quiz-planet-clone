import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useStartNewGame } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Zap, AlertCircle, Trophy } from 'lucide-react';
import QuizBanner from '../components/QuizBanner';

export default function LobbyPage() {
  const navigate = useNavigate();
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [error, setError] = useState('');

  const startGame1 = useStartNewGame();
  const startGame2 = useStartNewGame();

  const isLoading = startGame1.isPending || startGame2.isPending;
  const canStart = player1.trim().length > 0 && player2.trim().length > 0 && player1.trim() !== player2.trim();

  const handleStartGame = async () => {
    setError('');
    const p1 = player1.trim();
    const p2 = player2.trim();

    if (p1 === p2) {
      setError('Players must have different names!');
      return;
    }

    try {
      await startGame1.mutateAsync(p1);
      await startGame2.mutateAsync(p2);
      navigate({ to: '/game', search: { p1, p2 } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Username already exists')) {
        setError('One or both player names are already in use. Please choose different names.');
      } else {
        setError('Failed to start game. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Trophy className="w-7 h-7 text-gold" />
          <span className="text-gold font-black text-2xl tracking-widest uppercase">Quiz Planet</span>
          <Trophy className="w-7 h-7 text-gold" />
        </div>
        <p className="text-game-muted text-sm tracking-wider uppercase">Co-op Edition</p>
      </header>

      {/* Banner */}
      <div className="px-4 max-w-3xl mx-auto w-full">
        <QuizBanner />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <Card className="game-card border-game-border shadow-game">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-3">
                <div className="bg-gold/10 rounded-full p-3 border border-gold/30">
                  <Users className="w-8 h-8 text-gold" />
                </div>
              </div>
              <CardTitle className="text-2xl font-black text-game-text">Team Up & Play!</CardTitle>
              <CardDescription className="text-game-muted text-sm">
                Enter both player names to start your cooperative quiz adventure
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
              {/* Player 1 */}
              <div className="space-y-2">
                <Label htmlFor="player1" className="text-game-text font-bold flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-player1 text-white text-xs font-black">1</span>
                  Player 1
                </Label>
                <Input
                  id="player1"
                  placeholder="Enter Player 1 name..."
                  value={player1}
                  onChange={(e) => { setPlayer1(e.target.value); setError(''); }}
                  className="game-input"
                  maxLength={20}
                  onKeyDown={(e) => e.key === 'Enter' && canStart && handleStartGame()}
                />
              </div>

              {/* Player 2 */}
              <div className="space-y-2">
                <Label htmlFor="player2" className="text-game-text font-bold flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-player2 text-white text-xs font-black">2</span>
                  Player 2
                </Label>
                <Input
                  id="player2"
                  placeholder="Enter Player 2 name..."
                  value={player2}
                  onChange={(e) => { setPlayer2(e.target.value); setError(''); }}
                  className="game-input"
                  maxLength={20}
                  onKeyDown={(e) => e.key === 'Enter' && canStart && handleStartGame()}
                />
              </div>

              {/* Same name warning */}
              {player1.trim() && player2.trim() && player1.trim() === player2.trim() && (
                <p className="text-amber-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Players must have different names
                </p>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Start Button */}
              <Button
                onClick={handleStartGame}
                disabled={!canStart || isLoading}
                className="w-full game-btn-primary h-12 text-base font-black tracking-wider"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Starting Game...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Start Game!
                  </span>
                )}
              </Button>

              {/* How to play */}
              <div className="bg-game-surface/50 rounded-lg p-4 border border-game-border/50">
                <p className="text-game-muted text-xs font-bold uppercase tracking-wider mb-2">How to Play</p>
                <ul className="text-game-muted text-xs space-y-1">
                  <li>• Both players take turns answering questions</li>
                  <li>• 20 questions across Science, History, Sports & more</li>
                  <li>• Work together to get the highest team score!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
