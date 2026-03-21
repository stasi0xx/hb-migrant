'use client';

export default function SocialProof() {
  return (
    <section className="bg-[#FDF6EC] px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Quote mark */}
        <div className="text-[72px] leading-none text-[#E8927C] opacity-40 mb-2 font-heading font-black">
          &ldquo;
        </div>

        {/* Quote */}
        <blockquote className="font-heading font-black text-3xl leading-tight tracking-tight text-[#1B4332] mb-6">
          Lunch przestał być smutną kanapką z marketu. W końcu.
        </blockquote>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-[#D4A017] text-xl">★</span>
          ))}
        </div>

        {/* Attribution */}
        <p className="font-heading font-bold text-[#1B4332] text-base">
          Marta K.,{' '}
          <span className="font-normal text-[#1B4332]/50">Senior Designer, Warszawa</span>
        </p>
      </div>
    </section>
  );
}
