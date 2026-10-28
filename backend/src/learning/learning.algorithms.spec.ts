import { isHomeworkPublishable, normalizeHomeworkCount, normalizeHomeworkWeakRatio, selectHomeworkTasks } from './learning.algorithms';

describe('homework configuration', () => {
  it('defaults to 20 tasks and accepts configured counts from 5 through 30', () => {
    expect(normalizeHomeworkCount()).toBe(20);
    expect(normalizeHomeworkCount(5)).toBe(5);
    expect(normalizeHomeworkCount(30)).toBe(30);
  });

  it.each([4, 31, 5.5])('rejects an invalid task count: %s', (count) => {
    expect(() => normalizeHomeworkCount(count)).toThrow();
  });

  it('accepts only a weak-topic focus ratio from 0 through 1', () => {
    expect(normalizeHomeworkWeakRatio(0)).toBe(0);
    expect(normalizeHomeworkWeakRatio(1)).toBe(1);
    expect(() => normalizeHomeworkWeakRatio(-0.1)).toThrow();
    expect(() => normalizeHomeworkWeakRatio(1.1)).toThrow();
  });

  it('allows a configured assignment with at least five tasks from two types', () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ taskType: 'equation' })),
      ...Array.from({ length: 2 }, () => ({ taskType: 'geometry' })),
    ];

    expect(isHomeworkPublishable(items.map((item) => item.taskType))).toBe(true);
  });

  it('requires enough tasks and variety before publication', () => {
    expect(isHomeworkPublishable(Array.from({ length: 4 }, () => 'equation'))).toBe(false);
    expect(isHomeworkPublishable(Array.from({ length: 5 }, () => 'equation'))).toBe(false);
  });

  it('prioritizes lesson topics when the selected focus reduces weak-topic emphasis', () => {
    const tasks = [
      ...Array.from({ length: 12 }, (_, index) => ({ id: `weak-${index}`, externalId: `weak-${index}`, topicId: 'weak', taskType: `type-${index % 3}`, difficulty: 'standard' as any })),
      ...Array.from({ length: 12 }, (_, index) => ({ id: `lesson-${index}`, externalId: `lesson-${index}`, topicId: 'lesson', taskType: `type-${index % 3}`, difficulty: 'standard' as any })),
    ];
    const selection = selectHomeworkTasks({
      tasks: tasks as any,
      weakTopicIds: ['weak'],
      currentTopicIds: ['lesson'],
      masteryByTopic: new Map(),
      count: 10,
      weakRatio: 0.3,
    });

    expect(selection.items.filter((item) => item.task.topicId === 'weak').length).toBeLessThanOrEqual(3);
    expect(selection.items.filter((item) => item.task.topicId === 'lesson').length).toBeGreaterThanOrEqual(7);
  });

  it('keeps weak-topic emphasis when requested', () => {
    const tasks = [
      ...Array.from({ length: 12 }, (_, index) => ({ id: `weak-${index}`, externalId: `weak-${index}`, topicId: 'weak', taskType: `type-${index % 3}`, difficulty: 'standard' as any })),
      ...Array.from({ length: 12 }, (_, index) => ({ id: `lesson-${index}`, externalId: `lesson-${index}`, topicId: 'lesson', taskType: `type-${index % 3}`, difficulty: 'standard' as any })),
    ];
    const selection = selectHomeworkTasks({
      tasks: tasks as any,
      weakTopicIds: ['weak'],
      currentTopicIds: ['lesson'],
      masteryByTopic: new Map(),
      count: 10,
      weakRatio: 0.8,
    });

    expect(selection.items.filter((item) => item.task.topicId === 'weak').length).toBeGreaterThanOrEqual(8);
  });
});
