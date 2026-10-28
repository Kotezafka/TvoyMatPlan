'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalBookings: number;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get<Stats>('/admin/stats')
      .then(setStats)
      .catch(() => {
        setError(true);
        toast.error('Не удалось загрузить статистику');
      });
  }, []);

  if (error) {
    return (
      <div className="w-full max-w-6xl">
        <div
          role="alert"
          className="rounded-2xl border border-[rgb(var(--danger)/0.35)] bg-[rgb(var(--surface))] px-4 py-3 text-sm text-[rgb(var(--danger))] shadow-card sm:px-5"
        >
          Не удалось загрузить статистику
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full max-w-6xl space-y-6 animate-pulse">
        <div className="rounded-3xl border border-[rgb(var(--border-sub))] bg-[rgb(var(--surface-2))] p-5 sm:p-7">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-4 h-9 w-64 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      icon: Users,
      iconClass: 'bg-[#3F1116]',
      label: 'Пользователей',
      value: stats.totalUsers,
      change: 'всего',
    },
    {
      icon: GraduationCap,
      iconClass: 'bg-[#64343C]',
      label: 'Преподавателей',
      value: stats.totalTeachers,
      change: 'зарегистрировано',
    },
    {
      icon: Users,
      iconClass: 'bg-[#9D7960]',
      label: 'Учеников',
      value: stats.totalStudents,
      change: 'активных',
    },
    {
      icon: BookOpen,
      iconClass: 'bg-[#64343C]',
      label: 'Записей',
      value: stats.totalBookings,
      change: 'всего',
    },
  ];

  const activity = [
    {
      label: 'Студентов на преподавателя',
      value: stats.totalTeachers > 0 ? (stats.totalStudents / stats.totalTeachers).toFixed(1) : '—',
    },
    {
      label: 'Записей на студента',
      value: stats.totalStudents > 0 ? (stats.totalBookings / stats.totalStudents).toFixed(1) : '—',
    },
  ];

  const quickActions = [
    { href: '/dashboard/admin/users', label: 'Управление пользователями', note: 'Роли и доступы' },
    { href: '/dashboard/admin/codes', label: 'Создать код регистрации', note: 'Для новых учеников' },
    { href: '/dashboard/admin/teachers', label: 'Список преподавателей', note: 'Профили и статусы' },
  ];

  return (
    <div className="w-full max-w-6xl space-y-6 pb-2">
      <header className="premium-grid relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] p-5 shadow-card sm:p-7">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--primary)/0.25)] bg-[rgb(var(--surface))] px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.08em] text-[rgb(var(--primary))]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Контур администратора
            </div>
            <h1 className="max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.04em] text-[rgb(var(--text))] sm:text-3xl">
              Статистика платформы
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[rgb(var(--text-2))] sm:text-[0.95rem]">
              Общий обзор активности — ключевые показатели собраны в одном рабочем пространстве.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 border-t border-[rgb(var(--border)/0.7)] pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <Activity className="h-4 w-4 text-[rgb(var(--primary))]" aria-hidden="true" />
            <span className="text-xs font-medium text-[rgb(var(--text-2))]">4 показателя</span>
          </div>
        </div>
      </header>

      <section aria-label="Ключевые показатели" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, iconClass, label, value, change }) => (
          <Card key={label} className="h-full border-[rgb(var(--border-sub))] transition-shadow duration-200 hover:shadow-card-hover">
            <CardContent className="flex h-full flex-col justify-between gap-7 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass} ring-1 ring-black/5`}>
                  <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <TrendingUp className="mt-1 h-4 w-4 text-[rgb(var(--text-3))]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-3xl font-semibold leading-none tracking-[-0.045em] text-[rgb(var(--text))]">{value}</p>
                <p className="mt-2 text-sm font-medium text-[rgb(var(--text-2))]">{label}</p>
                <p className="mt-1 text-xs text-[rgb(var(--text-3))]">{change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="h-full border-[rgb(var(--border-sub))]">
          <CardHeader className="border-b border-[rgb(var(--border-sub))] p-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--primary-bg))] text-[rgb(var(--primary))]">
                <Activity className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Активность</CardTitle>
                <p className="mt-1 text-xs leading-5 text-[rgb(var(--text-3))]">Соотношение участников и записей</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="divide-y divide-[rgb(var(--border-sub))]">
              {activity.map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="min-w-0 text-sm leading-5 text-[rgb(var(--text-2))]">{label}</span>
                  <span className="text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text))]">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full border-[rgb(var(--border-sub))]">
          <CardHeader className="border-b border-[rgb(var(--border-sub))] p-5 pb-4 sm:p-6 sm:pb-4">
            <CardTitle>Быстрые действия</CardTitle>
            <p className="mt-1 text-xs leading-5 text-[rgb(var(--text-3))]">Часто используемые разделы кабинета</p>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-1">
              {quickActions.map(({ href, label, note }) => (
                <a
                  key={href}
                  href={href}
                  className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-[rgb(var(--border-sub))] hover:bg-[rgb(var(--surface-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[rgb(var(--text-2))] transition-colors group-hover:text-[rgb(var(--text))]">{label}</span>
                    <span className="mt-0.5 block truncate text-xs text-[rgb(var(--text-3))]">{note}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[rgb(var(--text-3))] transition-colors group-hover:text-[rgb(var(--primary))]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
