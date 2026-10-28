'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, BookOpen, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Booking, Teacher } from '@/types';
import { formatDateTime, fullName } from '@/lib/utils';
import { canJoinLesson, lessonTypeLabel } from '@/lib/lesson';
import { useNow } from '@/lib/use-now';
import { LessonJoinLinks } from '@/components/lesson/lesson-join-links';
import { toast } from 'sonner';

export default function StudentDashboard() {
  const now = useNow();
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [teacher, setTeacher]   = useState<Teacher | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Booking[]>('/bookings/upcoming'),
      api.get<Teacher | null>('/students/teacher'),
    ])
      .then(([bookings, t]) => {
        setUpcoming(bookings ?? []);
        setTeacher(t);
      })
      .catch(() => {
        toast.error('Не удалось загрузить главную');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="skeleton h-48" />
      </div>
    );
  }

  const firstBooking = upcoming[0];
  const otherBookings = upcoming.slice(1, 5);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 animate-fade-in sm:space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[rgb(var(--text-3))]">Учебный кабинет</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[rgb(var(--text))] sm:text-3xl">Ваш учебный план</h1>
          <p className="mt-1 text-sm text-[rgb(var(--text-2))]">Занятия, преподаватель и подготовка — в одном месте.</p>
        </div>
        {teacher && (
          <Link href="/dashboard/student/calendar" className="dashboard-focus rounded-xl">
            <Button size="sm">
              <Sparkles className="h-3.5 w-3.5" />
              Записаться
            </Button>
          </Link>
        )}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard icon={Calendar} label="Занятий впереди" value={upcoming.length} />
        <StatCard icon={Users} label="Преподаватель" value={teacher ? (fullName(teacher.user ?? undefined) || '—') : 'Не привязан'} />
        <StatCard icon={BookOpen} label="Связь" value={teacher ? 'Активна' : 'Ожидает привязки'} />
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.75fr)] lg:items-start">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[rgb(var(--text-3))]">Расписание</p>
                <CardTitle className="mt-1 text-lg">Ближайшие занятия</CardTitle>
              </div>
              <Link href="/dashboard/student/bookings" className="dashboard-focus inline-flex items-center gap-1 rounded-md text-sm font-medium text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]">
                Все занятия <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {firstBooking ? (
              <>
                <div className="dashboard-feature min-w-0 rounded-2xl border border-[rgb(var(--border-sub))] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3F1116] text-[#FFF1E9]">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[rgb(var(--text-3))]">Следующее занятие</p>
                        <p className="mt-1 break-words text-base font-semibold text-[rgb(var(--text))] sm:text-lg">{formatDateTime(firstBooking.slot.startTime)}</p>
                        <p className="mt-0.5 text-sm text-[rgb(var(--text-2))]">{lessonTypeLabel(firstBooking.slot.lessonType)}</p>
                      </div>
                    </div>
                    {canJoinLesson(firstBooking.slot.startTime, firstBooking.slot.endTime, now, firstBooking.slot.lesson?.status) ? (
                      <LessonJoinLinks
                        role="student"
                        slotId={firstBooking.slotId}
                        startTime={firstBooking.slot.startTime}
                        endTime={firstBooking.slot.endTime}
                        now={now}
                        lessonStatus={firstBooking.slot.lesson?.status}
                        className="sm:shrink-0"
                      />
                    ) : (
                      <Badge variant="success" dot>Подтверждено</Badge>
                    )}
                  </div>
                </div>
                {otherBookings.length > 0 && (
                  <div className="divide-y divide-[rgb(var(--border-sub))]">
                    {otherBookings.map((booking) => (
                      <div key={booking.id} className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-1 py-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--text-3))]" />
                          <div className="min-w-0">
                            <p className="break-words text-sm font-medium text-[rgb(var(--text))]">{formatDateTime(booking.slot.startTime)}</p>
                            <p className="mt-0.5 text-xs text-[rgb(var(--text-2))]">{lessonTypeLabel(booking.slot.lessonType)}</p>
                          </div>
                        </div>
                        {canJoinLesson(booking.slot.startTime, booking.slot.endTime, now, booking.slot.lesson?.status) ? (
                          <LessonJoinLinks
                            role="student"
                            slotId={booking.slotId}
                            startTime={booking.slot.startTime}
                            endTime={booking.slot.endTime}
                            now={now}
                            lessonStatus={booking.slot.lesson?.status}
                            className="shrink-0"
                          />
                        ) : (
                          <Badge variant="success" dot>Подтверждено</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-[rgb(var(--border))] px-5 py-9 text-center">
                <Calendar className="mx-auto h-6 w-6 text-[rgb(var(--text-3))]" />
                <p className="mt-3 text-sm font-medium text-[rgb(var(--text))]">Пока нет запланированных занятий</p>
                {teacher && (
                  <Link href="/dashboard/student/calendar" className="mt-4 inline-flex rounded-lg">
                    <Button size="sm">Выбрать время</Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <p className="text-xs font-medium text-[rgb(var(--text-3))]">Ваша команда</p>
            <CardTitle className="mt-1 text-lg">Преподаватель</CardTitle>
          </CardHeader>
          <CardContent>
            {teacher ? (
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#64343C] text-sm font-semibold text-[#FFF1E9]">
                  {teacher.user?.firstName?.[0]}{teacher.user?.lastName?.[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-[rgb(var(--text))]">{fullName(teacher.user ?? undefined)}</p>
                  <p className="mt-0.5 truncate text-xs text-[rgb(var(--text-2))]">{teacher.subjects || 'Предметы не указаны'}</p>
                </div>
                <Link href="/dashboard/student/teacher" aria-label="Открыть информацию о преподавателе" className="dashboard-focus flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))]">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="rounded-xl bg-[rgb(var(--surface-2))] p-4">
                <p className="text-sm leading-6 text-[rgb(var(--text-2))]">Пока нет привязанного преподавателя. Добавьте код приглашения, чтобы открыть расписание и материалы.</p>
                <Link href="/dashboard/student/teacher" className="mt-4 inline-flex rounded-lg">
                  <Button size="sm" variant="outline">Привязать преподавателя</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: {
  icon: typeof Calendar; label: string; value: string | number;
}) {
  return (
    <div className="dashboard-metric min-w-0 p-4 sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3F1116]">
          <Icon className="h-[1.1rem] w-[1.1rem] text-[#FFF1E9]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-base font-semibold leading-tight text-[rgb(var(--text))] sm:text-lg">{value}</p>
          <p className="mt-1 text-xs text-[rgb(var(--text-2))]">{label}</p>
        </div>
      </div>
    </div>
  );
}
