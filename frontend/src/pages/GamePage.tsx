import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetQuestion, useGetPlayerScore, useAnswerQuestion, useIsGameFinished } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ChevronRight, Trophy, Star } from 'lucide-react';

const TOTAL_QUESTIONS = 20;

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

type AnswerState = {
  selectedIndex: number | null;
  isCorrect: boolean | null;
  correctIndex: number | null;
};

type PlayerTurn = 1 | 2;

export default function GamePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/game' });
  const p1 = (search as { p1: string; p2: string }).p1;
  const p2 = (search as { p1: string; p2: string }).p2;

  const [currentPlayer, setCurrentPlayer] = useState<PlayerTurn>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>({
    selectedIndex: null,
    isCorrect: null,
    correctIndex: null,
  });
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const activePlayer = currentPlayer === 1 ? p1 : p2;

  const questionQuery = useGetQuestion(activePlayer);
  const p1ScoreQuery = useGetPlayerScore(p1);
  const p2ScoreQuery = useGetPlayerScore(p2);
  const p1FinishedQuery = useIsGameFinished(p1);
  const p2FinishedQuery = useIsGameFinished(p2);
  const answerMutation = useAnswerQuestion();

  // Sync scores from backend
  useEffect(() => {
    if (p1ScoreQuery.data !== undefined) setP1Score(Number(p1ScoreQuery.data));
  }, [p1ScoreQuery.data]);

  useEffect(() => {
    if (p2ScoreQuery.data !== undefined) setP2Score(Number(p2ScoreQuery.data));
  }, [p2ScoreQuery.data]);

  // Check if both players finished
  useEffect(() => {
    if (p1FinishedQuery.data && p2FinishedQuery.data) {
      navigate({ to: '/results', search: { p1, p2 } });
    }
  }, [p1FinishedQuery.data, p2FinishedQuery.data, navigate, p1, p2]);

  const question = questionQuery.data;
  const isAnswered = answerState.selectedIndex !== null;

  const handleAnswer = async (optionIndex: number) => {
    if (isAnswered || !question) return;

    try {
      const isCorrect = await answerMutation.mutateAsync({
        playerName: activePlayer,
        answerIndex: BigInt(optionIndex),
      });

      setAnswerState({
        selectedIndex: optionIndex,
        isCorrect,
        correctIndex: Number(question.correctOption),
      });

      // Update score immediately
      if (isCorrect) {
        if (currentPlayer === 1) setP1Score((s) => s + 1);
        else setP2Score((s) => s + 1);
      }
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    setAnswerState({ selectedIndex: null, isCorrect: null, correctIndex: null });

    // Alternate players
    if (currentPlayer === 1) {
      setCurrentPlayer(2);
    } else {
      setCurrentPlayer(1);
      setQuestionIndex((i) => i + 1);
    }

    // Refetch question for next player
    questionQuery.refetch();
  };

  const getButtonClass = (index: number): string => {
    if (!isAnswered) return 'answer-btn answer-btn-default';
    if (index === answerState.correctIndex) return 'answer-btn answer-btn-correct';
    if (index === answerState.selectedIndex && !answerState.isCorrect) return 'answer-btn answer-btn-wrong';
    return 'answer-btn answer-btn-neutral';
  };

  const progressPercent = (questionIndex / TOTAL_QUESTIONS) * 100;

  if (questionQuery.isLoading) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mx-auto" />
          <p className="text-game-muted">Loading question...</p>
        </div>
      </div>
    );
  }

  if (questionQuery.isError || !question) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">Failed to load question. Please try again.</p>
          <Button onClick={() => navigate({ to: '/' })} className="game-btn-primary">
            Back to Lobby
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {/* Top Bar */}
      <header className="px-4 py-3 border-b border-game-border bg-game-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-gold font-black text-sm tracking-wider uppercase hidden sm:block">Quiz Planet</span>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-3">
            <div className={`score-chip ${currentPlayer === 1 ? 'score-chip-active' : 'score-chip-inactive'}`}>
              <span className="score-chip-dot bg-player1" />
              <span className="font-bold text-sm truncate max-w-[80px]">{p1}</span>
              <span className="font-black text-gold text-sm">{p1Score}</span>
            </div>
            <div className="text-game-muted text-xs font-bold">VS</div>
            <div className={`score-chip ${currentPlayer === 2 ? 'score-chip-active' : 'score-chip-inactive'}`}>
              <span className="score-chip-dot bg-player2" />
              <span className="font-bold text-sm truncate max-w-[80px]">{p2}</span>
              <span className="font-black text-gold text-sm">{p2Score}</span>
            </div>
          </div>

          <div className="text-game-muted text-xs font-bold">
            {questionIndex + 1}<span className="text-game-muted/50">/{TOTAL_QUESTIONS}</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-game-surface">
        <div
          className="h-full bg-gradient-to-r from-gold to-amber-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl space-y-5">

          {/* Current Player Indicator */}
          <div className="flex items-center justify-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${currentPlayer === 1 ? 'border-player1/50 bg-player1/10' : 'border-player2/50 bg-player2/10'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${currentPlayer === 1 ? 'bg-player1' : 'bg-player2'}`} />
              <span className="text-game-text font-bold text-sm">
                {activePlayer}'s turn
              </span>
              <Star className="w-3 h-3 text-gold" />
            </div>
          </div>

          {/* Question Card */}
          <div className="game-card rounded-2xl p-6 border border-game-border shadow-game">
            {/* Category & Question Number */}
            <div className="flex items-center justify-between mb-4">
              <Badge className="category-badge">{question.category}</Badge>
              <span className="text-game-muted text-xs font-bold">
                Question {questionIndex + 1} of {TOTAL_QUESTIONS}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-game-text text-xl font-black leading-snug mb-6">
              {question.text}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered || answerMutation.isPending}
                  className={getButtonClass(index)}
                >
                  <span className="answer-label">{OPTION_LABELS[index]}</span>
                  <span className="flex-1 text-left text-sm font-semibold">{option}</span>
                  {isAnswered && index === answerState.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  )}
                  {isAnswered && index === answerState.selectedIndex && !answerState.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Next */}
          {isAnswered && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className={`rounded-xl p-4 border text-center ${answerState.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <p className={`font-black text-lg ${answerState.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {answerState.isCorrect ? '🎉 Correct! +1 point' : '❌ Wrong answer!'}
                </p>
                {!answerState.isCorrect && (
                  <p className="text-game-muted text-sm mt-1">
                    Correct answer: <span className="text-green-400 font-bold">{question.options[answerState.correctIndex!]}</span>
                  </p>
                )}
              </div>

              <Button
                onClick={handleNext}
                className="w-full game-btn-primary h-12 text-base font-black"
              >
                <span className="flex items-center gap-2">
                  {questionIndex + 1 >= TOTAL_QUESTIONS && currentPlayer === 2
                    ? '🏆 See Results!'
                    : `Next: ${currentPlayer === 1 ? p2 : p1}'s Turn`}
                  <ChevronRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          )}

          {answerMutation.isPending && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gold border-t-transparent mx-auto" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
