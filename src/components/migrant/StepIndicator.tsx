import { Fragment } from 'react';

type Props = { active: 1 | 2 | 3 };

export default function StepIndicator({ active }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {([1, 2, 3] as const).map((step, i) => (
        <Fragment key={step}>
          <span
            className={`h-8 w-8 rounded-full font-black text-sm flex items-center justify-center ${
              active === step
                ? 'bg-[#E8927C] text-white'
                : 'bg-[#1B4332]/10 text-[#1B4332]/30'
            }`}
          >
            {step}
          </span>
          {i < 2 && <span className="h-px w-10 bg-[#1B4332]/20" />}
        </Fragment>
      ))}
    </div>
  );
}
