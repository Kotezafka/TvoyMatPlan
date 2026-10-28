import { mockExamQuestionCount, selectMockExamTasks } from './mock-exam-blueprint';

describe('mock exam blueprint', () => {
  it('counts the current exam question families and ignores legacy families', () => {
    const tasks = Array.from({ length: 21 }, (_, index) => ({
      metadata: { examQuestionNumber: index + 1, ...(index === 20 ? { isLegacy: true } : {}) },
    }));

    expect(mockExamQuestionCount(tasks)).toBe(20);
    expect(mockExamQuestionCount(
      Array.from({ length: 21 }, (_, index) => ({ metadata: { examQuestionNumber: index + 1 } })),
    )).toBe(21);
    expect(mockExamQuestionCount([{ metadata: {} }, { metadata: {} }])).toBe(2);
  });

  it('reserves a second part for advanced tasks while keeping the requested size', () => {
    const tasks = [
      ...Array.from({ length: 24 }, (_, index) => ({ id: `regular-${index}`, difficulty: 'standard' })),
      ...Array.from({ length: 8 }, (_, index) => ({ id: `advanced-${index}`, difficulty: 'advanced' })),
    ];

    const selected = selectMockExamTasks(tasks, 20);

    expect(selected).toHaveLength(20);
    expect(selected.filter((item) => item.part === 1)).toHaveLength(13);
    expect(selected.filter((item) => item.part === 2)).toHaveLength(7);
    expect(selected.filter((item) => item.part === 2).every((item) => item.task.difficulty === 'advanced')).toBe(true);
    expect(new Set(selected.map((item) => item.task.id)).size).toBe(20);
  });

  it('uses all available advanced tasks when the bank has fewer than the target', () => {
    const tasks = [
      ...Array.from({ length: 10 }, (_, index) => ({ id: `regular-${index}`, difficulty: 'standard' })),
      { id: 'advanced-1', difficulty: 'advanced' },
    ];

    const selected = selectMockExamTasks(tasks, 10);

    expect(selected).toHaveLength(10);
    expect(selected.filter((item) => item.part === 2)).toHaveLength(1);
  });

  it('does not label a second part for tracks without a formal second exam section', () => {
    const tasks = [
      ...Array.from({ length: 16 }, (_, index) => ({ id: `regular-${index}`, difficulty: 'standard' })),
      ...Array.from({ length: 4 }, (_, index) => ({ id: `advanced-${index}`, difficulty: 'advanced' })),
    ];

    const selected = selectMockExamTasks(tasks, 20, false);

    expect(selected).toHaveLength(20);
    expect(selected.every((item) => item.part === 1)).toBe(true);
  });

  it('selects one random source variant per exam question number and keeps exam order', () => {
    const tasks = Array.from({ length: 12 }, (_, index) => {
      const questionNumber = Math.floor(index / 2) + 1;
      return {
        id: `question-${questionNumber}-variant-${index % 2}`,
        difficulty: questionNumber > 3 ? 'advanced' : 'standard',
        metadata: { examQuestionNumber: questionNumber, examPart: questionNumber > 3 ? 2 : 1 },
      };
    });

    const selected = selectMockExamTasks(tasks, 6);

    expect(selected).toHaveLength(6);
    expect(selected.map(({ task }) => task.metadata.examQuestionNumber)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(selected.map(({ task }) => task.metadata.examQuestionNumber)).size).toBe(6);
    expect(selected.map(({ part }) => part)).toEqual([1, 1, 1, 2, 2, 2]);
  });

  it('omits legacy question families from an imported profile exam blueprint', () => {
    const tasks = Array.from({ length: 21 }, (_, index) => ({
      id: `question-${index + 1}`,
      difficulty: index >= 13 ? 'advanced' : 'standard',
      metadata: {
        examQuestionNumber: index + 1,
        examPart: index >= 13 ? 2 : 1,
        ...(index === 20 ? { isLegacy: true } : {}),
      },
    }));

    const selected = selectMockExamTasks(tasks, 20);

    expect(selected).toHaveLength(20);
    expect(selected.map(({ task }) => task.metadata.examQuestionNumber)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
    expect(selected.some(({ task }) => task.metadata.isLegacy === true)).toBe(false);
    expect(selected.filter(({ part }) => part === 2)).toHaveLength(7);
  });
});
