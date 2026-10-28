/** Shared lesson/booking rules. */

// Kept as exported compatibility constants for callers that display the old
// booking window. Joining a lesson itself is no longer limited by this window.
export const LESSON_JOIN_EARLY_MS = 30 * 60_000;
export const LESSON_JOIN_LATE_MS = 120 * 60_000;
export const BOOKING_CANCEL_MIN_HOURS = 24;
export const SLOT_DURATION_MS = 60 * 60_000;
export const RECURRING_WEEKS = 4;
export const CAL_SLOT_MIN = '12:00:00';
export const CAL_SLOT_MAX = '24:00:00';
export const CAL_HOURS_START = 0;
export const CAL_HOURS_END = 24;

export function getCalendarTimeRange(showLateHours: boolean) {
  return {
    min: CAL_SLOT_MIN,
    max: showLateHours ? CAL_SLOT_MAX : '21:00:00',
  };
}

export function getCalendarSlotLabels(showLateHours: boolean) {
  const endMinutes = (showLateHours ? CAL_HOURS_END : 21) * 60;
  const durationMinutes = SLOT_DURATION_MS / 60_000;
  const labels: string[] = [];
  for (let minutes = 12 * 60; minutes + durationMinutes <= endMinutes; minutes += 30) {
    labels.push(
      `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
    );
  }
  return labels;
}

export type LessonViewMode = 'video' | 'split' | 'board';

const JOINABLE_LESSON_STATUSES = new Set(['waiting', 'starting', 'active']);

export function canJoinLesson(
  _startTime: string | Date,
  _endTime: string | Date,
  _now?: number,
  lessonStatus?: string | null,
) {
  return !lessonStatus || JOINABLE_LESSON_STATUSES.has(lessonStatus);
}

/** A confirmed slot remains visible until its lesson reaches a terminal status. */
export function isUpcomingOrLive(
  _startTime: string | Date,
  _endTime: string | Date,
  _now?: number,
  lessonStatus?: string | null,
) {
  return !lessonStatus || JOINABLE_LESSON_STATUSES.has(lessonStatus);
}

export function parseLessonViewMode(
  value: string | null | undefined,
): LessonViewMode {
  if (value === 'video' || value === 'board') return value;
  return 'split';
}

export function canCancelBooking(startTime: string | Date, now = Date.now()) {
  return (new Date(startTime).getTime() - now) / 3_600_000 >= BOOKING_CANCEL_MIN_HOURS;
}

export function lessonTypeLabel(type: string) {
  return type === 'individual' ? 'Индивидуальное' : 'Групповое';
}

export function slotStatusLabel(status: string) {
  switch (status) {
    case 'available':
      return 'Свободно';
    case 'booked':
      return 'Заполнено';
    case 'cancelled':
      return 'Отменено';
    default:
      return status;
  }
}
