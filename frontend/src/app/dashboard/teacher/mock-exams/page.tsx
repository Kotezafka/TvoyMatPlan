'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, ClipboardCheck, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExamStatement } from '@/components/learning/exam-statement';
import { ExamTaskImages } from '@/components/learning/exam-task-images';
import { api } from '@/lib/api';
import type { MockExam } from '@/types/learning';

export default function TeacherMockExamReviewsPage() {
  const [exams, setExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<string | null>(null);

  const loadExams = useCallback(async () => {
    setLoading(true);
    try {
      setExams(await api.get<MockExam[]>('/mock-exams'));
    } catch {
      toast.error('Не удалось загрузить пробники');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  const reviewQueue = exams.filter(
    (exam) => exam.status === 'completed' && exam.items.some((item) => item.status === 'needs_review'),
  );

  const gradeItem = async (exam: MockExam, taskId: string, correct: boolean) => {
    const key = `${exam.id}:${taskId}`;
    setGrading(key);
    try {
      const updated = await api.patch<MockExam>(`/mock-exams/${exam.id}/grade`, { taskId, correct });
      setExams((current) => current.map((candidate) => candidate.id === updated.id
        ? { ...updated, student: candidate.student }
        : candidate));
      toast.success(correct ? 'Задание отмечено как верное' : 'Задание отмечено как неверное');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Не удалось сохранить оценку');
    } finally {
      setGrading(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Ученики</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[rgb(var(--text))]">Проверка пробников</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--text-2))]">Здесь собраны задания с развёрнутым ответом, которые система не оценивает автоматически.</p>
        </div>
        <Button variant="outline" onClick={() => void loadExams()} isLoading={loading}>
          {!loading && <RefreshCw className="h-4 w-4" />} Обновить
        </Button>
      </header>

      {loading ? (
        <Card><CardContent className="space-y-4 p-6"><div className="skeleton h-6 w-56 rounded-lg" /><div className="skeleton h-32 rounded-xl" /></CardContent></Card>
      ) : reviewQueue.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700"><ClipboardCheck className="h-6 w-6" /></span>
          <div><h2 className="font-semibold text-[rgb(var(--text))]">Проверка не требуется</h2><p className="mt-1 text-sm text-[rgb(var(--text-2))]">Когда ученик завершит пробник с заданиями второй части, ответы появятся здесь.</p></div>
        </CardContent></Card>
      ) : reviewQueue.map((exam) => {
        const studentName = exam.student?.user
          ? `${exam.student.user.firstName} ${exam.student.user.lastName}`.trim()
          : 'Ученик';
        const pendingItems = exam.items.filter((item) => item.status === 'needs_review');

        return (
          <Card key={exam.id} className="overflow-hidden">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[rgb(var(--text))]">{studentName}</h2>
                  <p className="mt-1 text-sm text-[rgb(var(--text-2))]">{exam.title} · {exam.correctCount} из {exam.items.length} засчитано</p>
                </div>
                <Badge variant="warning">Нужно проверить: {pendingItems.length}</Badge>
              </div>

              {pendingItems.map((item) => {
                const key = `${exam.id}:${item.taskId}`;
                const isGrading = grading === key;
                return (
                  <section key={item.taskId} className="space-y-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="violet">Часть 2</Badge>
                      <span className="text-sm font-medium text-[rgb(var(--text))]">{item.topicTitle}</span>
                      <span className="text-xs text-[rgb(var(--text-3))]">№ {item.externalId}</span>
                    </div>
                    <ExamTaskImages examId={exam.id} taskId={item.taskId} imageKeys={item.imageKeys} fallback={<ExamStatement statement={item.statement} />} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <ReviewAnswer label="Итоговый ответ" value={item.answer || 'Не указан'} />
                      <ReviewAnswer label="Решение ученика" value={item.work || 'Решение не записано'} />
                    </div>
                    <div className="flex flex-wrap gap-2 border-t border-[rgb(var(--border))] pt-4">
                      <Button onClick={() => void gradeItem(exam, item.taskId, true)} isLoading={isGrading} disabled={grading !== null}>
                        {!isGrading && <Check className="h-4 w-4" />} Засчитать
                      </Button>
                      <Button variant="outline" onClick={() => void gradeItem(exam, item.taskId, false)} disabled={grading !== null}>
                        <X className="h-4 w-4" /> Не засчитывать
                      </Button>
                    </div>
                  </section>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ReviewAnswer({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-3))]">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[rgb(var(--text))]">{value}</p>
    </div>
  );
}
