'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Calendar, BookOpen, Copy, Check, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Teacher, Booking } from '@/types';
import { formatDateTime, fullName } from '@/lib/utils';
import { canJoinLesson, isUpcomingOrLive } from '@/lib/lesson';
import { useNow } from '@/lib/use-now';
import { LessonJoinLinks } from '@/components/lesson/lesson-join-links';

function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export default function TeacherDashboard() {
  const now = useNow();
  const [teacher, setTeacher]       = useState<Teacher | null>(null);
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [copied, setCopied]         = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Teacher>('/teachers/me'),
      api.get<Booking[]>('/bookings/teacher'),
    ]).then(([t, b]) => { setTeacher(t); setBookings(b); })
      .catch(() => toast.error('Не удалось загрузить кабинет'))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings
    .filter(
      (b) =>
        b.status === 'confirmed' &&
        isUpcomingOrLive(
          b.slot.startTime,
          b.slot.endTime,
          now,
          b.slot.lesson?.status,
        ),
    )
    .sort(
      (a, b) =>
        new Date(a.slot.startTime).getTime() -
        new Date(b.slot.startTime).getTime(),
    );

  const generateCode = async () => {
    setGenerating(true);
    try {
      const data = await api.post<{ inviteCode: string }>('/teachers/invite-code');
      setTeacher((p) => p ? { ...p, inviteCode: data.inviteCode } : p);
      toast.success('Новый код сгенерирован');
    } finally { setGenerating(false); }
  };

  const copyCode = () => {
    if (!teacher?.inviteCode) return;
    navigator.clipboard.writeText(teacher.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Код скопирован');
  };

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-60 rounded-2xl" />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 animate-fade-in sm:space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[rgb(var(--text-3))]">Рабочее пространство</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[rgb(var(--text))] sm:text-3xl">Кабинет преподавателя</h1>
          <p className="mt-1 text-sm text-[rgb(var(--text-2))]">Ученики, ближайшие уроки и управление расписанием.</p>
        </div>
        <Link href="/dashboard/teacher/calendar" className="dashboard-focus rounded-xl">
          <Button size="sm"><Calendar className="h-4 w-4" />Расписание</Button>
        </Link>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          { icon: Users, label: 'Учеников', value: teacher?.students?.length ?? 0 },
          { icon: Calendar, label: 'Ближайших занятий', value: upcoming.length },
          { icon: BookOpen, label: 'Всего записей', value: bookings.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="dashboard-metric min-w-0 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[rgb(var(--text-2))]">{label}</p>
                <p className="mt-2 text-3xl font-semibold leading-none tracking-[-0.04em] text-[rgb(var(--text))]">{value}</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3F1116] text-[#FFF1E9]">
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:items-start">
        <Card className="min-w-0">
          <CardHeader>
            <p className="text-xs font-medium text-[rgb(var(--text-3))]">Связь с учениками</p>
            <CardTitle className="mt-1 text-lg">Код приглашения</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm leading-6 text-[rgb(var(--text-2))]">
              Поделитесь кодом: ученик введёт его в разделе «Преподаватель» после регистрации.
            </p>
            {teacher?.inviteCode ? (
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                <div className="premium-grid flex min-h-12 min-w-0 flex-1 items-center justify-center break-all rounded-xl border border-[rgb(var(--border))] px-3 py-3 text-center font-mono text-base font-bold tracking-[0.16em] text-[rgb(var(--text))] sm:text-lg">
                  {teacher.inviteCode}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="icon" variant="outline" onClick={copyCode} title="Скопировать" aria-label="Скопировать код приглашения" className="dashboard-focus">
                    {copied ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={generateCode} isLoading={generating} title="Обновить код" aria-label="Обновить код приглашения" className="dashboard-focus">
                    {!generating && <RefreshCw className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={generateCode} isLoading={generating}>
                Сгенерировать код
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[rgb(var(--text-3))]">Расписание</p>
                <CardTitle className="mt-1 text-lg">Ближайшие занятия</CardTitle>
              </div>
              <Link href="/dashboard/teacher/calendar" className="dashboard-focus rounded-md text-sm font-medium text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]">
                Управлять
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[rgb(var(--border))] px-5 py-8 text-center">
                <Calendar className="mx-auto h-6 w-6 text-[rgb(var(--text-3))]" />
                <p className="mt-3 text-sm text-[rgb(var(--text-2))]">Нет предстоящих занятий</p>
                <Link href="/dashboard/teacher/calendar" className="mt-4 inline-flex rounded-lg">
                  <Button size="sm">Создать слот</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[rgb(var(--border-sub))]">
                {upcoming.slice(0, 5).map((booking) => {
                  const join = canJoinLesson(
                    booking.slot.startTime,
                    booking.slot.endTime,
                    now,
                    booking.slot.lesson?.status,
                  );
                  return (
                    <div key={booking.id} className="flex min-w-0 flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3F1116] text-[#FFF1E9]">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-[rgb(var(--text))]">{formatDateTime(booking.slot.startTime)}</p>
                          <p className="mt-0.5 break-words text-xs text-[rgb(var(--text-2))]">{fullName(booking.student?.user) || 'Ученик'}</p>
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-wrap items-center justify-start gap-2 sm:justify-end">
                        {join ? (
                          <LessonJoinLinks
                            role="teacher"
                            slotId={booking.slotId}
                            startTime={booking.slot.startTime}
                            endTime={booking.slot.endTime}
                            now={now}
                            lessonStatus={booking.slot.lesson?.status}
                          />
                        ) : (
                          <Badge variant="success" dot>Подтверждено</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
