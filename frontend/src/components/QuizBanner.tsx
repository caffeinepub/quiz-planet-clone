export default function QuizBanner() {
  return (
    <div className="w-full rounded-xl overflow-hidden mb-2 border border-gold/20 shadow-game">
      <img
        src="/assets/generated/quiz-banner.dim_1200x300.png"
        alt="Quiz Planet Co-op Banner"
        className="w-full h-auto object-cover"
        style={{ maxHeight: '150px', objectPosition: 'center' }}
      />
    </div>
  );
}
