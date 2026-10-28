'use client';

import { useMemo } from 'react';
import katex from 'katex';
import { formatMathExpression, parseExamStatement } from '@/lib/exam-statement';

export function ExamStatement({ statement }: { statement: string }) {
  const presentation = useMemo(() => parseExamStatement(statement), [statement]);
  const formulaMarkup = useMemo(() => {
    if (presentation.kind === 'plain' || presentation.kind === 'sequence') return null;

    const expression = presentation.kind === 'system'
      ? `\\begin{aligned}${presentation.mathLines
          .map((line) => line.replace(/\s*=\s*/u, ' &= '))
          .join('\\\\')}\\end{aligned}`
      : presentation.mathLines[0];

    try {
      return katex.renderToString(expression, {
        displayMode: true,
        output: 'htmlAndMathml',
        strict: 'error',
        throwOnError: false,
        trust: false,
      });
    } catch {
      return null;
    }
  }, [presentation]);

  if (presentation.kind === 'plain') {
    return <p className="whitespace-pre-line text-base leading-8 text-[rgb(var(--text))] sm:text-lg">{presentation.text}</p>;
  }

  if (presentation.kind === 'sequence') {
    return (
      <div className="space-y-5">
        <p className="text-sm font-medium leading-6 text-[rgb(var(--text-2))]">{presentation.prompt}</p>
        <div className="flex flex-wrap items-center gap-2" aria-label={`Последовательность: ${presentation.values.join(', ')}`}>
          {presentation.values.map((value, index) => (
            <span key={`${value}-${index}`} className="inline-flex items-center gap-2">
              <span className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 font-mono text-base font-semibold tabular-nums text-[rgb(var(--text))] sm:px-4 sm:py-3 sm:text-lg">{value}</span>
              {index < presentation.values.length - 1 && <span aria-hidden="true" className="text-sm text-[rgb(var(--text-3))]">→</span>}
            </span>
          ))}
          <span className="px-1 text-lg font-semibold text-primary-700">?</span>
        </div>
      </div>
    );
  }

  const safeMathLines = presentation.mathLines.map(formatMathExpression);
  if (!formulaMarkup || safeMathLines.some((line) => line === null)) {
    return <p className="whitespace-pre-line text-base leading-8 text-[rgb(var(--text))] sm:text-lg">{statement}</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium leading-6 text-[rgb(var(--text-2))]">{presentation.prompt}</p>
      <div className="exam-math-scroll overflow-x-auto rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-5 sm:px-6 sm:py-7">
        <div
          className="exam-math mx-auto w-fit min-w-max text-[rgb(var(--text))]"
          role="img"
          aria-label={`Математическое выражение: ${safeMathLines.join('; ')}`}
          dangerouslySetInnerHTML={{ __html: formulaMarkup }}
        />
      </div>
      {presentation.trailingText && <p className="text-base font-medium leading-7 text-[rgb(var(--text))]">{presentation.trailingText}</p>}
    </div>
  );
}
