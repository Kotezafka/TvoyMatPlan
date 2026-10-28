'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { BookOpen, CalendarDays, CircleDollarSign, Download, FileText, Plus, Printer, Settings2, Trash2, TrendingUp, WalletCards } from 'lucide-react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRose } from '@/components/learning/progress-rose';
import { SectionReadiness } from '@/components/learning/section-readiness';
import { ProgressHistory, ProgressPeriodFilter } from '@/components/learning/progress-history';
import { FamilyChat } from '@/components/family/family-chat';
import type { TopicProgress } from '@/types/learning';

type FamilyData = {
  student: { id: string; name: string; parentName: string | null };
  teacher: { name: string; subjects?: string; bio?: string } | null;
  progress: {
    profile: any;
    topics: TopicProgress[];
    assessedTopics: number;
    forecast?: { min: number; expected: number; max: number } | null;
    sectionForecasts?: Array<{
      section: string;
      min: number | null;
      expected: number | null;
      max: number | null;
      assessedTopics: number;
      topicCount: number;
    }>;
    history?: Array<{
      period: string;
      expected: number | null;
      assessedTopics: number;
      topicCount: number;
    }>;
  };
  lessons: Array<{
    id: string;
    lessonId: string | null;
    date: string;
    bookingStatus: string;
    lessonStatus: string | null;
    attendanceStatus: 'attended' | 'scheduled' | 'not_attended';
    note: string;
    report: {
      summary: string;
      topics: string[];
      achievements: string[];
      difficulties: string[];
      homework: string[];
      recommendations: string[];
      parentAnswers?: Array<{ question: string; answer: string }>;
    } | null;
  }>;
  homework: Array<{ id: string; status: string; dueAt: string; title: string; total: number; completed: number }>;
  payments: Array<{ id: string; amount: number; currency: string; dueAt: string; paidAt: string | null; status: string; description: string | null }>;
  accessExpiresAt: string | null;
  parentReportQuestions?: string[];
};

type FamilyTab = 'statistics' | 'reports' | 'homework' | 'payments';

const familyTabs: Array<{ id: FamilyTab; label: string; icon: typeof TrendingUp }> = [
  { id: 'statistics', label: 'Статистика', icon: TrendingUp },
  { id: 'reports', label: 'Отчёты', icon: FileText },
  { id: 'homework', label: 'Домашние задания', icon: BookOpen },
  { id: 'payments', label: 'Оплаты', icon: WalletCards },
];

export default function FamilyDashboard() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<FamilyData | null>(null);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('365');
  const [activeTab, setActiveTab] = useState<FamilyTab>('statistics');
  const [parentReportQuestions, setParentReportQuestions] = useState<string[]>([]);
  const [questionDraft, setQuestionDraft] = useState('');
  const [savingReportSettings, setSavingReportSettings] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const reportSettingsToken = useRef<string | null>(null);

  useEffect(() => {
    const query = period === 'all'
      ? ''
      : `?from=${encodeURIComponent(new Date(Date.now() - Number(period) * 86400_000).toISOString())}&to=${encodeURIComponent(new Date().toISOString())}`;
    api
      .get<FamilyData>(`/family/${token}${query}`)
      .then((value) => {
        setData(value);
        if (reportSettingsToken.current !== token) {
          setParentReportQuestions(value.parentReportQuestions ?? []);
          reportSettingsToken.current = token;
        }
        setError('');
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || 'Ссылка недействительна',
        ),
      );
  }, [period, token]);

  if (error) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="text-xl font-semibold">Доступ закрыт</h1>
            <p className="mt-2 text-sm text-[rgb(var(--text-2))]">
              {error}. Попросите ученика проверить ссылку в личном кабинете.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="skeleton h-48 rounded-2xl" />
      </main>
    );
  }

  const exportReport = () => {
    setActiveTab('reports');
    window.setTimeout(() => window.print(), 100);
  };
  const addQuestion = (event: FormEvent) => {
    event.preventDefault();
    const question = questionDraft.trim();
    if (!question || parentReportQuestions.length >= 5) return;
    if (parentReportQuestions.some((existing) => existing.toLocaleLowerCase('ru-RU') === question.toLocaleLowerCase('ru-RU'))) {
      setQuestionDraft('');
      return;
    }
    setParentReportQuestions((current) => [...current, question]);
    setSettingsSaved(false);
    setSettingsError('');
    setQuestionDraft('');
  };
  const saveReportSettings = async () => {
    setSavingReportSettings(true);
    try {
      const result = await api.patch<{ parentReportQuestions: string[] }>(
        `/family/${token}/report-settings`,
        { parentReportQuestions },
      );
      setParentReportQuestions(result.parentReportQuestions ?? []);
      setSettingsError('');
      setSettingsSaved(true);
    } catch (err: any) {
      setSettingsError(err.response?.data?.message || 'Не удалось сохранить настройки отчётов');
    } finally {
      setSavingReportSettings(false);
    }
  };
  const pastLessons = data.lessons.filter(
    (lesson) => new Date(lesson.date).getTime() <= Date.now(),
  );
  const attendedLessons = pastLessons.filter(
    (lesson) => lesson.attendanceStatus === 'attended',
  ).length;

  return (
    <main className="family-report mx-auto max-w-5xl space-y-5 p-5 md:p-8">
      <header className="rounded-2xl bg-[rgb(var(--surface))] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[rgb(var(--text-3))]">ТвойМатПлан · кабинет семьи</p>
            <h1 className="mt-2 text-2xl font-bold text-[rgb(var(--text))]">
              Прогресс {data.student.name}
            </h1>
            <p className="mt-1 text-sm text-[rgb(var(--text-2))]">
              Преподаватель: {data.teacher?.name || 'не привязан'}
              {data.teacher?.subjects ? ` · ${data.teacher.subjects}` : ''}
            </p>
          </div>
          <div className="family-report-actions flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={exportReport}>
              <Printer className="h-4 w-4" />
              Сохранить в PDF
            </Button>
            <div className="hidden sm:block">
              <Button type="button" size="sm" variant="ghost" onClick={() => setActiveTab('reports')}>
                <Download className="h-4 w-4" />
                К отчётам
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Разделы семейного кабинета" className="family-report-nav -mx-1 overflow-x-auto px-1">
        <div role="tablist" className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-1 shadow-card sm:flex sm:min-w-max">
          {familyTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`family-tab-${id}`}
              aria-controls={`family-panel-${id}`}
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex min-h-10 items-center justify-start gap-2 whitespace-normal rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors sm:whitespace-nowrap ${activeTab === id ? 'bg-[#3F1116] text-[#FFF1E9]' : 'text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]'}`}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === 'statistics' && <section id="family-panel-statistics" aria-labelledby="family-tab-statistics" role="tabpanel" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[rgb(var(--text-2))]">Прогресс ученика и занятия</p>
          <ProgressPeriodFilter period={period} onChange={setPeriod} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={TrendingUp} label="Тем оценено" value={`${data.progress.assessedTopics} из ${data.progress.topics.length}`} />
          <Metric icon={CalendarDays} label="Посещено прошедших занятий" value={pastLessons.length ? `${attendedLessons} из ${pastLessons.length}` : 'Нет прошедших'} />
          <Metric icon={BookOpen} label="Домашних заданий" value={String(data.homework.length)} />
          <Metric icon={CircleDollarSign} label="Оплачено" value={`${data.payments.filter((p) => p.status === 'paid').reduce((n, p) => n + p.amount, 0).toLocaleString('ru-RU')} ₽`} />
        </div>
        {data.progress.forecast && <Card><CardHeader><CardTitle>Ориентир по текущему прогрессу</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[rgb(var(--text))]">{data.progress.forecast.min}–{data.progress.forecast.max}%</p><p className="mt-1 text-xs text-[rgb(var(--text-3))]">Оценка освоения изученных тем, не официальный балл экзамена.</p></CardContent></Card>}
        <ProgressRose topics={data.progress.topics} />
        <SectionReadiness sections={data.progress.sectionForecasts} />
        <ProgressHistory history={data.progress.history} />
        {data.teacher && <FamilyChat token={token} />}
      </section>}

      {activeTab === 'reports' && <section id="family-panel-reports" aria-labelledby="family-tab-reports" role="tabpanel" className="space-y-5">
        <Card className="family-report-settings print:hidden">
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings2 className="h-4 w-4" />Настройка отчётов</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">О чём ИИ должен рассказать родителю?</p>
              <p className="mt-1 text-xs leading-5 text-[rgb(var(--text-3))]">Базовые разделы отчёта остаются всегда. Добавленные вопросы будут применяться к следующим урокам, когда ИИ формирует отчёт.</p>
            </div>
            {parentReportQuestions.length > 0 && <ul className="space-y-2">
              {parentReportQuestions.map((question, index) => <li key={`${index}-${question}`} className="flex items-start gap-3 rounded-xl border border-[rgb(var(--border))] px-3 py-2.5">
                <span className="min-w-0 flex-1 pt-1 text-sm">{question}</span>
                <Button type="button" size="icon" variant="ghost" aria-label={`Удалить вопрос: ${question}`} onClick={() => { setParentReportQuestions((current) => current.filter((_, itemIndex) => itemIndex !== index)); setSettingsSaved(false); setSettingsError(''); }}><Trash2 className="h-4 w-4" /></Button>
              </li>)}
            </ul>}
            <form onSubmit={addQuestion} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1"><Input label="Свой вопрос" placeholder="Например: что стоит повторить перед следующим занятием?" value={questionDraft} maxLength={160} onChange={(event) => setQuestionDraft(event.target.value)} disabled={parentReportQuestions.length >= 5} /></div>
              <Button type="submit" variant="outline" disabled={!questionDraft.trim() || parentReportQuestions.length >= 5}><Plus className="h-4 w-4" />Добавить</Button>
            </form>
            <p className="text-xs text-[rgb(var(--text-3))]">{parentReportQuestions.length} из 5 дополнительных вопросов</p>
            {settingsError && <p role="alert" className="text-sm text-red-700">{settingsError}</p>}
            {settingsSaved && <p role="status" className="text-sm text-emerald-700">Настройки сохранены. Они будут учтены в следующих отчётах.</p>}
            <Button type="button" onClick={saveReportSettings} isLoading={savingReportSettings}>Сохранить настройки</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" />Занятия и отчёты</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {data.lessons.length ? data.lessons.map((lesson) => <article key={lesson.id} className="rounded-xl border border-[rgb(var(--border))] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-[rgb(var(--text-3))]">{lesson.date ? new Date(lesson.date).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : ''} · {lesson.note || 'Занятие'}</p><span className={`rounded-full px-2 py-1 text-[0.7rem] font-medium ${attendanceClass(lesson.attendanceStatus)}`}>{attendanceLabel(lesson.attendanceStatus)}</span></div>
              {lesson.report ? <>
                <p className="mt-2 text-sm font-medium">{lesson.report.summary}</p>
                <Detail label="Темы" items={lesson.report.topics} /><Detail label="Что получилось" items={lesson.report.achievements} /><Detail label="Сложности" items={lesson.report.difficulties} /><Detail label="Домашнее задание" items={lesson.report.homework} /><Detail label="Рекомендации" items={lesson.report.recommendations} />
                {lesson.report.parentAnswers?.map((item) => <p key={item.question} className="mt-2 text-xs leading-5 text-[rgb(var(--text-2))]"><strong>{item.question}</strong><br />{item.answer}</p>)}
              </> : <p className="mt-2 text-sm text-[rgb(var(--text-2))]">{familyReportMessage(lesson)}</p>}
            </article>) : <p className="text-sm text-[rgb(var(--text-2))]">Занятий пока нет.</p>}
          </div></CardContent>
        </Card>
      </section>}

      {activeTab === 'homework' && <section id="family-panel-homework" aria-labelledby="family-tab-homework" role="tabpanel">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Домашние задания</CardTitle></CardHeader><CardContent>
          {data.homework.length ? <div className="space-y-2">{data.homework.map((item) => <div key={item.id} className="rounded-xl border border-[rgb(var(--border))] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{item.title}</p><span className="text-xs text-[rgb(var(--text-2))]">Выполнено {item.completed} из {item.total}</span></div>{item.dueAt && <p className="mt-1 text-xs text-[rgb(var(--text-2))]">Срок {new Date(item.dueAt).toLocaleDateString('ru-RU')}</p>}</div>)}</div> : <p className="text-sm text-[rgb(var(--text-2))]">Нет опубликованных заданий.</p>}
        </CardContent></Card>
      </section>}

      {activeTab === 'payments' && <section id="family-panel-payments" aria-labelledby="family-tab-payments" role="tabpanel">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><WalletCards className="h-4 w-4" />Оплаты</CardTitle></CardHeader><CardContent>
          {data.payments.length ? <div className="space-y-2">{data.payments.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgb(var(--border))] p-4"><div><p className="text-sm font-medium">{item.description || 'Занятие'} · {item.amount.toLocaleString('ru-RU')} ₽</p><p className="mt-1 text-xs text-[rgb(var(--text-2))]">Срок {new Date(item.dueAt).toLocaleDateString('ru-RU')}</p></div><span className="rounded-full bg-[rgb(var(--surface-2))] px-2.5 py-1 text-xs">{paymentStatus(item.status)}</span></div>)}</div> : <p className="text-sm text-[rgb(var(--text-2))]">Начислений нет.</p>}
        </CardContent></Card>
      </section>}

      <p className="text-center text-xs text-[rgb(var(--text-3))] family-report-actions">
        Приватная ссылка на кабинет семьи не истекает.
      </p>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) {
  return <Card><CardContent className="flex items-center gap-3 pt-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl icon-blue"><Icon className="h-5 w-5 text-white" /></span><div><p className="text-lg font-semibold">{value}</p><p className="text-xs text-[rgb(var(--text-2))]">{label}</p></div></CardContent></Card>;
}

function Detail({ label, items }: { label: string; items?: string[] }) {
  return items?.length ? <p className="mt-2 text-xs leading-5 text-[rgb(var(--text-2))]"><strong>{label}:</strong> {items.join(' · ')}</p> : null;
}

function paymentStatus(status: string) {
  return ({ paid: 'Оплачено', overdue: 'Просрочено', pending: 'Ожидается', cancelled: 'Отменено' } as Record<string, string>)[status] || status;
}

function attendanceLabel(status: FamilyData['lessons'][number]['attendanceStatus']) {
  return ({ attended: 'Посещено', scheduled: 'Запланировано', not_attended: 'Не посещено' })[status];
}

function attendanceClass(status: FamilyData['lessons'][number]['attendanceStatus']) {
  return ({
    attended: 'bg-emerald-500/15 text-emerald-700',
    scheduled: 'bg-amber-500/15 text-amber-700',
    not_attended: 'bg-[rgb(var(--surface-2))] text-[rgb(var(--text-2))]',
  })[status];
}

function familyReportMessage(lesson: FamilyData['lessons'][number]) {
  if (lesson.attendanceStatus === 'scheduled') return 'Занятие запланировано.';
  if (lesson.attendanceStatus === 'not_attended') return 'Захода в урок не было.';
  if (lesson.lessonStatus === 'failed') {
    return 'Не удалось сформировать отчёт. Преподаватель уведомлён.';
  }
  if (lesson.lessonStatus === 'processing') return 'Отчёт формируется.';
  return 'Отчёт пока недоступен.';
}
