import { randomInt } from 'crypto';

export type MockExamPart = 1 | 2;

export function mockExamQuestionCount<T extends { metadata?: Record<string, unknown> }>(tasks: T[]) {
  const groups = groupByQuestionNumber(tasks);
  return groups && groups.size > 0 ? groups.size : Math.min(20, tasks.length);
}

export function selectMockExamTasks<T extends { difficulty?: string; metadata?: Record<string, unknown> }>(
  tasks: T[],
  count: number,
  includePartTwo = true,
  partTwoRatio = 0.35,
): Array<{ task: T; part: MockExamPart }> {
  const byQuestionNumber = groupByQuestionNumber(tasks);
  if (byQuestionNumber) {
    const questionNumbers = shuffle([...byQuestionNumber.keys()]);
    if (questionNumbers.length < count) {
      throw new Error('В каталоге недостаточно разных номеров заданий для пробника');
    }
    return questionNumbers
      .slice(0, count)
      .sort((left, right) => left - right)
      .map((questionNumber) => {
        const task = shuffle(byQuestionNumber.get(questionNumber)!)[0];
        const part = includePartTwo && (task.metadata?.examPart === 2 || task.difficulty === 'advanced') ? 2 : 1;
        return { task, part };
      });
  }

  if (!includePartTwo) {
    return shuffle(tasks).slice(0, count).map((task) => ({ task, part: 1 }));
  }
  const advanced = shuffle(tasks.filter((task) => task.difficulty === 'advanced'));
  const regular = shuffle(tasks.filter((task) => task.difficulty !== 'advanced'));
  const targetPartTwo = Math.ceil(count * partTwoRatio);
  const partTwoCount = Math.min(advanced.length, Math.max(targetPartTwo, count - regular.length));
  const partTwo = advanced.slice(0, partTwoCount);
  const partOne = regular.slice(0, count - partTwo.length);

  if (partOne.length + partTwo.length < count) {
    throw new Error('В каталоге недостаточно заданий для пробника');
  }

  return [
    ...partOne.map((task) => ({ task, part: 1 as const })),
    ...partTwo.map((task) => ({ task, part: 2 as const })),
  ];
}

function groupByQuestionNumber<T extends { metadata?: Record<string, unknown> }>(tasks: T[]) {
  if (!tasks.length || !tasks.every((task) => {
    const value = task.metadata?.examQuestionNumber;
    return Number.isInteger(typeof value === 'number' ? value : Number(value));
  })) return null;

  const groups = new Map<number, T[]>();
  for (const task of tasks) {
    if (task.metadata?.isLegacy === true) continue;
    const value = task.metadata!.examQuestionNumber;
    const questionNumber = typeof value === 'number' ? value : Number(value);
    const group = groups.get(questionNumber) ?? [];
    group.push(task);
    groups.set(questionNumber, group);
  }
  return groups;
}

function shuffle<T>(values: T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
