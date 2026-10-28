import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  formatMathExpression,
  parseExamStatement,
} from '../frontend/src/lib/exam-statement.ts';

describe('exam statement presentation', () => {
  it('separates an equation from the instruction to find its variable', () => {
    assert.deepEqual(
      parseExamStatement('Решите уравнение: -261 - 379 = -80×l. Найдите l.'),
      {
        kind: 'equation',
        prompt: 'Решите уравнение',
        mathLines: ['-261 - 379 = -80 \\times l'],
        trailingText: 'Найдите l.',
      },
    );
  });

  it('keeps simultaneous equations as separate lines of one system', () => {
    assert.deepEqual(
      parseExamStatement(
        'Решите систему уравнений: 4×q - 7×r = -41; -5085×r + 5090×r - 19 = 2×q. Найдите q.',
      ),
      {
        kind: 'system',
        prompt: 'Решите систему уравнений',
        mathLines: ['4 \\times q - 7 \\times r = -41', '-5085 \\times r + 5090 \\times r - 19 = 2 \\times q'],
        trailingText: 'Найдите q.',
      },
    );
  });

  it('turns a generated sequence into individual readable values', () => {
    assert.deepEqual(
      parseExamStatement(
        'Найдите следующий член последовательности: 6574, 6510, 6404, 6256, 6066.',
      ),
      {
        kind: 'sequence',
        prompt: 'Найдите следующий член последовательности',
        values: ['6574', '6510', '6404', '6256', '6066'],
        trailingText: '',
      },
    );
  });

  it('leaves prose that is not a safely recognized formula unchanged', () => {
    assert.deepEqual(parseExamStatement('Назовите цифру десятков в числе 16934.'), {
      kind: 'plain',
      text: 'Назовите цифру десятков в числе 16934.',
    });
  });

  it('formats decimal commas and multiplication without accepting TeX commands', () => {
    assert.equal(formatMathExpression('1×1,61'), '1 \\times 1{,}61');
    assert.equal(formatMathExpression('x+\\input{secret}'), null);
  });

  it('converts roots, powers, and fractions into readable math layout', () => {
    assert.equal(
      formatMathExpression('2^3 + √(16) + 1/2'),
      '2^{3} + \\sqrt{16} + \\frac{1}{2}',
    );
  });

  it('renders a calculation as a formula card and accepts the Russian minus sign', () => {
    assert.deepEqual(parseExamStatement('Вычислите: -4350,88 − (-155049).'), {
      kind: 'formula',
      prompt: 'Вычислите',
      mathLines: ['-4350{,}88 - (-155049)'],
      trailingText: '',
    });
  });
});
