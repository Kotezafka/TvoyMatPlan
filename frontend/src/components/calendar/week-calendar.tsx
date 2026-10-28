'use client';

import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type {
  DateSelectArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import { getCalendarTimeRange } from '@/lib/lesson';
import { Segmented } from '@/components/ui/segmented';
import { cn } from '@/lib/utils';

export type CalendarView = 'timeGridWeek' | 'timeGridDay';

type Props = {
  events: EventInput[];
  onEventClick?: (info: EventClickArg) => void;
  onDateSelect?: (info: DateSelectArg) => void;
  selectable?: boolean;
  className?: string;
  initialView?: CalendarView;
};

function dayHeaderContent(args: { date: Date; isToday: boolean }) {
  const wd = args.date
    .toLocaleDateString('ru', { weekday: 'short' })
    .toUpperCase();
  return {
    html: `<div class="cal-day-header"><span class="cal-weekday">${wd}</span><span class="cal-daynum${args.isToday ? ' cal-today' : ''}">${args.date.getDate()}</span></div>`,
  };
}

export function WeekCalendar({
  events,
  onEventClick,
  onDateSelect,
  selectable = false,
  className,
  initialView = 'timeGridWeek',
}: Props) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [view, setView] = useState<CalendarView>(initialView);
  const [narrow, setNarrow] = useState(false);
  const [showLateHours, setShowLateHours] = useState(false);
  const timeRange = getCalendarTimeRange(showLateHours);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => {
      const isNarrow = mq.matches;
      setNarrow(isNarrow);
      const next: CalendarView = isNarrow ? 'timeGridDay' : 'timeGridWeek';
      setView(next);
      calendarRef.current?.getApi().changeView(next);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const changeView = (next: CalendarView) => {
    setView(next);
    calendarRef.current?.getApi().changeView(next);
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 shadow-card sm:p-4',
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="md:hidden">
          <Segmented
            size="sm"
            value={view}
            onChange={changeView}
            options={[
              { value: 'timeGridDay', label: 'День' },
              { value: 'timeGridWeek', label: 'Неделя' },
            ]}
          />
        </div>
        <button
          type="button"
          aria-expanded={showLateHours}
          onClick={() => setShowLateHours((shown) => !shown)}
          className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[rgb(var(--border))] px-3 text-xs font-medium text-[rgb(var(--text-2))] transition-colors hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-warm))]"
        >
          {showLateHours ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {showLateHours ? 'Скрыть время после 21:00' : 'Показать время после 21:00'}
        </button>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={narrow ? 'timeGridDay' : initialView}
        locale={ruLocale}
        firstDay={1}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: narrow ? '' : 'timeGridDay,timeGridWeek',
        }}
        buttonText={{
          today: 'Сегодня',
          week: 'Неделя',
          day: 'День',
        }}
        dayHeaderContent={dayHeaderContent}
        events={events}
        eventClick={onEventClick}
        selectable={selectable}
        selectMirror={selectable}
        select={onDateSelect}
        height="auto"
        slotMinTime={timeRange.min}
        slotMaxTime={timeRange.max}
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        allDaySlot={false}
        nowIndicator
        longPressDelay={200}
        eventDisplay="block"
      />
    </div>
  );
}
