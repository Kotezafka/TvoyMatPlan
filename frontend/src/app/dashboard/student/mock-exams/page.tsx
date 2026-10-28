'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Flag,
  ListChecks,
  TimerReset,
  Trophy,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExamStatement } from '@/components/learning/exam-statement';
import { ExamTaskImages } from '@/components/learning/exam-task-images';
import type { ExamTrack, LearningProgress } from '@/types/learning';

const tracks: Array<{ value: ExamTrack; label: string }> = [
  { value: 'oge', label: 'ОГЭ по математике' },
  { value: 'ege_base', label: 'ЕГЭ по математике · базовый уровень' },
  { value: 'ege_profile', label: 'ЕГЭ по математике · профильный уровень' },
];

type ExamItem = {
  taskId: string;
  topicTitle: string;
  taskType: string;
  statement: string;
  imageKeys?: string[];
  examPart?: 1 | 2;
  answer?: string | null;
  work?: string | null;
  status: 'pending' | 'correct' | 'incorrect' | 'needs_review';
  solution?: string | null;
};

type Exam = {
  id: string;
  title?: string;
  examTrack?: ExamTrack;
  status?: 'in_progress' | 'completed';
  durationMinutes?: number;
  items: ExamItem[];
  correctCount: number;
  score: number;
};

type ActiveRelease = {
  title: string;
  sourceKind: string;
  metadata?: {
    sourceUrl?: string;
    dataset?: string;
    license?: string;
    disclaimer?: string;
    validationSummary?: { questionFamilyCount?: number };
  };
};

export default function MockExamsPage() {
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [works, setWorks] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [activeRelease, setActiveRelease] = useState<ActiveRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<LearningProgress>('/learning/progress')
      .then(async (value) => {
        setProgress(value);
        const track = value.profile?.examTrack;
        if (!track) return;
        try {
          const catalog = await api.get<{ release: ActiveRelease }>(`/curriculum/active/${track}/topics`);
          setActiveRelease(catalog.release);
        } catch {
          setActiveRelease(null);
        }
      })
      .catch(() => toast.error('Не удалось загрузить профиль подготовки'))
      .finally(() => setLoading(false));
  }, []);

  const profileTrackLabel = useMemo(
    () => tracks.find((track) => track.value === progress?.profile?.examTrack)?.label ?? 'Экзамен не выбран',
    [progress?.profile?.examTrack],
  );
  const canGenerate = Boolean(activeRelease && activeRelease.sourceKind === 'imported');
  const hasSecondPart = ['oge', 'ege_profile'].includes(progress?.profile?.examTrack ?? '');

  const start = async () => {
    try {
      const created = await api.post<Exam>('/mock-exams/start');
      setExam(created);
      setAnswers(Object.fromEntries(created.items.map((item) => [item.taskId, item.answer ?? ''])));
      setWorks(Object.fromEntries(created.items.map((item) => [item.taskId, item.work ?? ''])));
      setActiveIndex(0);
      setFinished(false);
      setStarted(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Не удалось начать пробник');
    }
  };

  const submit = async () => {
    if (!exam || submitting) return;
    setSubmitting(true);
    try {
      const result = await api.post<Exam>(`/mock-exams/${exam.id}/submit`, {
        answers: exam.items.map((item) => ({ taskId: item.taskId, answer: answers[item.taskId] ?? '', work: works[item.taskId] ?? '' })),
      });
      setExam(result);
      setFinished(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Не удалось отправить ответы');
    } finally {
      setSubmitting(false);
    }
  };

  if (started && exam) {
    return (
      <ExamWorkspace
        exam={exam}
        answers={answers}
        works={works}
        activeIndex={activeIndex}
        finished={finished}
        submitting={submitting}
        trackLabel={profileTrackLabel}
        onSelect={setActiveIndex}
        onAnswer={(taskId, value) => setAnswers((current) => ({ ...current, [taskId]: value }))}
        onWork={(taskId, value) => setWorks((current) => ({ ...current, [taskId]: value }))}
        onSubmit={submit}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Подготовка к экзамену</p>
        <h1 className="text-2xl font-semibold tracking-tight text-[rgb(var(--text))]">Тренировочный вариант</h1>
        <p className="max-w-2xl text-sm leading-6 text-[rgb(var(--text-2))]">Решайте задания по одному, переключайтесь по номерам и возвращайтесь к пропущенным вопросам перед отправкой.</p>
      </header>

      <Card className="overflow-hidden border-primary-500/20">
        <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[rgb(var(--text))]">Вариант внутри EasyPhys</h2>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-2))]">{profileTrackLabel}. Вопросы берутся из локального учебного каталога, а ответы сохраняются по каждому номеру.</p>
            </div>
            {loading ? <div className="skeleton h-12 rounded-xl" /> : canGenerate ? (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoTile icon={<ListChecks className="h-4 w-4" />} label="Заданий" value={String(activeRelease?.metadata?.validationSummary?.questionFamilyCount ?? 20)} />
                  <InfoTile icon={<TimerReset className="h-4 w-4" />} label="Время" value="60 мин" />
                  <InfoTile icon={<Flag className="h-4 w-4" />} label="Части" value={hasSecondPart ? '1 и 2' : '1'} />
                </div>
                <Button size="lg" onClick={start}>Сгенерировать вариант <ArrowRight className="h-4 w-4" /></Button>
              </>
            ) : (
              <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900">
                <p>Активный каталог заданий ещё не загружен, поэтому вариант пока нельзя собрать.</p>
                <Link href="/dashboard/student/progress"><Button variant="outline" size="sm">Открыть настройки подготовки</Button></Link>
              </div>
            )}
          </CardContent>
          <div className="flex flex-col justify-end bg-primary-950 p-6 text-primary-50 md:p-8">
            <Trophy className="mb-8 h-8 w-8 text-primary-200" />
            <p className="text-sm font-medium text-primary-100">Как это работает</p>
            <ol className="mt-4 space-y-4 text-sm text-primary-100/80">
              <li className="flex gap-3"><StepNumber value="1" />Откройте один вопрос на экране.</li>
              <li className="flex gap-3"><StepNumber value="2" />Переключайтесь между номерами без потери ответа.</li>
              <li className="flex gap-3"><StepNumber value="3" />Проверьте пропуски и отправьте вариант.</li>
            </ol>
          </div>
        </div>
      </Card>

      {(activeRelease?.metadata?.disclaimer || activeRelease?.metadata?.sourceUrl) && <div className="space-y-1 text-xs leading-5 text-[rgb(var(--text-3))]">{activeRelease.metadata.disclaimer && <p>{activeRelease.metadata.disclaimer}</p>}{activeRelease.metadata.sourceUrl && <p>Источник: <a className="underline underline-offset-2 hover:text-primary-700" href={activeRelease.metadata.sourceUrl} target="_blank" rel="noreferrer">{activeRelease.metadata.dataset || activeRelease.metadata.sourceUrl}</a>{activeRelease.metadata.license ? ` · лицензия ${activeRelease.metadata.license}` : ''}</p>}</div>}
    </div>
  );
}

function ExamWorkspace({
  exam, answers, works, activeIndex, finished, submitting, trackLabel, onSelect, onAnswer, onWork, onSubmit,
}: {
  exam: Exam; answers: Record<string, string>; works: Record<string, string>; activeIndex: number; finished: boolean; submitting: boolean; trackLabel: string;
  onSelect: (index: number) => void; onAnswer: (taskId: string, value: string) => void; onWork: (taskId: string, value: string) => void; onSubmit: () => void;
}) {
  const activeItem = exam.items[activeIndex];
  const answeredCount = exam.items.filter((item) => (answers[item.taskId] ?? '').trim()).length;
  const partOneCount = exam.items.filter((item) => (item.examPart ?? 1) === 1).length;
  const partTwoCount = exam.items.filter((item) => item.examPart === 2).length;
  const reviewCount = exam.items.filter((item) => item.status === 'needs_review').length;
  const isLast = activeIndex === exam.items.length - 1;
  const isPartTwo = ['oge', 'ege_profile'].includes(exam.examTrack ?? '') && activeItem.examPart === 2;

  if (finished) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Результат</p><h1 className="text-2xl font-semibold tracking-tight text-[rgb(var(--text))]">Пробник завершён</h1><p className="text-sm text-[rgb(var(--text-2))]">{reviewCount ? `${trackLabel} · ${reviewCount} ${pluralize(reviewCount, 'задание', 'задания', 'заданий')} передано преподавателю на проверку.` : `${trackLabel} · ответы проверены и сохранены в прогрессе.`}</p></header>
        <Card className="border-primary-500/20"><CardContent className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><p className="text-sm text-[rgb(var(--text-2))]">Итоговый результат</p><p className="mt-1 text-4xl font-semibold text-primary-700">{exam.correctCount} <span className="text-xl font-normal text-[rgb(var(--text-3))]">из {exam.items.length}</span></p></div><div className="rounded-2xl bg-primary-100 px-5 py-4 text-center"><p className="text-2xl font-semibold text-primary-800">{exam.score}%</p><p className="text-xs text-primary-700">автоматическая проверка</p></div></CardContent></Card>
        <Card><CardContent className="space-y-5 p-5 sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--text-3))]">Перейти к заданию</p><div className="mt-3 flex flex-wrap gap-2">{exam.items.map((item, index) => <button key={item.taskId} type="button" aria-label={`Разбор задания ${index + 1}`} onClick={() => onSelect(index)} className={numberClass(index === activeIndex, false, item.status)}>{index + 1}</button>)}</div></div><div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5 sm:p-7"><div className="flex flex-wrap items-center gap-2"><Badge variant={activeItem.examPart === 2 ? 'violet' : 'default'}>{activeItem.examPart === 2 ? 'Часть 2' : 'Часть 1'}</Badge><Badge variant={activeItem.status === 'correct' ? 'success' : activeItem.status === 'needs_review' ? 'warning' : 'danger'}>{resultLabel(activeItem.status)}</Badge><span className="text-xs text-[rgb(var(--text-3))]">Задание {activeIndex + 1} · {activeItem.topicTitle}</span></div><div className="mt-5"><ExamTaskImages examId={exam.id} taskId={activeItem.taskId} imageKeys={activeItem.imageKeys} fallback={<ExamStatement statement={activeItem.statement} />} /></div><div className="mt-5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-3))]">Ваш ответ</p><p className="mt-2 whitespace-pre-line text-sm leading-6">{answers[activeItem.taskId] || activeItem.answer || 'Нет ответа'}</p></div>{(works[activeItem.taskId] || activeItem.work) && <details className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4"><summary className="cursor-pointer text-sm font-medium">Моё решение</summary><p className="mt-3 whitespace-pre-line text-sm leading-6">{works[activeItem.taskId] || activeItem.work}</p></details>}{activeItem.solution && <details className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4"><summary className="cursor-pointer text-sm font-medium">Показать разбор</summary><p className="mt-3 whitespace-pre-line text-sm leading-6">{activeItem.solution}</p></details>}</div><div className="flex justify-between gap-3"><Button variant="outline" onClick={() => onSelect(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0}><ArrowLeft className="h-4 w-4" />Предыдущее</Button><Button variant="outline" onClick={() => onSelect(Math.min(exam.items.length - 1, activeIndex + 1))} disabled={activeIndex === exam.items.length - 1}>Следующее <ArrowRight className="h-4 w-4" /></Button></div></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">{trackLabel}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-[rgb(var(--text))]">Тренировочный вариант</h1></div><div className="text-left sm:text-right"><p className="text-sm font-medium text-[rgb(var(--text))]">{answeredCount} из {exam.items.length} отвечено</p><p className="mt-1 text-xs text-[rgb(var(--text-3))]">{exam.durationMinutes ?? 60} минут на вариант</p></div></header>
      <div className="h-2 overflow-hidden rounded-full bg-primary-100"><div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${Math.round((answeredCount / exam.items.length) * 100)}%` }} /></div>

      <Card className="overflow-visible">
        <CardContent className="space-y-5 p-4 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[rgb(var(--border))] pb-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--text-3))]">Навигация по заданиям</p><div className="mt-3 flex max-w-full flex-wrap gap-2">{exam.items.map((item, index) => <button key={item.taskId} type="button" aria-label={`Задание ${index + 1}`} onClick={() => onSelect(index)} className={numberClass(index === activeIndex, !!(answers[item.taskId] ?? '').trim(), item.status)}>{index + 1}{item.status === 'correct' && <Check className="h-3 w-3" />}</button>)}</div></div><div className="flex flex-wrap gap-2 text-xs text-[rgb(var(--text-2))]"><span className="rounded-full bg-primary-50 px-3 py-1.5">Часть 1 · {partOneCount}</span><span className="rounded-full bg-primary-100 px-3 py-1.5">Часть 2 · {partTwoCount}</span></div></div>
          <div className="flex flex-wrap items-center gap-2"><Badge variant={isPartTwo ? 'violet' : 'default'}>{isPartTwo ? 'Часть 2' : 'Часть 1'}</Badge><Badge variant="secondary">{activeIndex + 1} / {exam.items.length}</Badge><span className="text-xs text-[rgb(var(--text-3))]">{activeItem.topicTitle}</span></div>
          <div className="min-h-[300px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5 sm:p-8"><ExamTaskImages examId={exam.id} taskId={activeItem.taskId} imageKeys={activeItem.imageKeys} fallback={<ExamStatement statement={activeItem.statement} />} />{isPartTwo && <label className="mt-8 block max-w-3xl"><span className="mb-2 block text-sm font-semibold text-[rgb(var(--text))]">Ход решения</span><textarea value={works[activeItem.taskId] ?? ''} onChange={(event) => onWork(activeItem.taskId, event.target.value)} rows={5} placeholder="Запишите основные шаги решения" className="w-full resize-y rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" /></label>}<label className="mt-5 block max-w-xl"><span className="mb-2 block text-sm font-semibold text-[rgb(var(--text))]">{isPartTwo ? 'Итоговый ответ' : 'Ваш ответ'}</span><input value={answers[activeItem.taskId] ?? ''} onChange={(event) => onAnswer(activeItem.taskId, event.target.value)} placeholder="Введите ответ" className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" /></label></div>
          <div className="flex flex-col gap-3 border-t border-[rgb(var(--border))] pt-4 sm:flex-row sm:items-center sm:justify-between"><Button variant="outline" onClick={() => onSelect(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0}><ArrowLeft className="h-4 w-4" />Назад</Button>{isLast ? <Button onClick={onSubmit} isLoading={submitting}><Flag className="h-4 w-4" />Завершить вариант</Button> : <Button onClick={() => onSelect(activeIndex + 1)}>Следующее <ArrowRight className="h-4 w-4" /></Button>}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function numberClass(active: boolean, answered: boolean, status: ExamItem['status']) {
  if (active) return 'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-xl bg-primary-700 px-2 text-xs font-semibold text-primary-50 ring-2 ring-primary-300';
  if (status === 'correct') return 'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-xl bg-emerald-100 px-2 text-xs font-semibold text-emerald-800';
  if (status === 'incorrect') return 'inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-rose-100 px-2 text-xs font-semibold text-rose-700';
  if (status === 'needs_review') return 'inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-amber-100 px-2 text-xs font-semibold text-amber-800';
  if (answered) return 'inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-primary-400 bg-primary-50 px-2 text-xs font-semibold text-primary-700';
  return 'inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-2 text-xs font-semibold text-[rgb(var(--text-2))] transition hover:border-primary-400 hover:bg-primary-50';
}

function resultLabel(status: ExamItem['status']) {
  return status === 'correct' ? 'верно' : status === 'needs_review' ? 'нужна проверка' : status === 'incorrect' ? 'есть ошибка' : 'без ответа';
}

function pluralize(count: number, one: string, few: string, many: string) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3"><div className="flex items-center gap-2 text-primary-700">{icon}<span className="text-xs text-[rgb(var(--text-2))]">{label}</span></div><p className="mt-1 text-sm font-semibold text-[rgb(var(--text))]">{value}</p></div>;
}

function StepNumber({ value }: { value: string }) {
  return <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-800 text-xs font-semibold text-primary-100">{value}</span>;
}
