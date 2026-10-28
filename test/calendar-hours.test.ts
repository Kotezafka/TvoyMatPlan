import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getCalendarSlotLabels, getCalendarTimeRange } from '../frontend/src/lib/lesson.ts';

describe('calendar visible time range', () => {
  it('shows the core workday from noon to 21:00 by default', () => {
    assert.deepEqual(getCalendarTimeRange(false), {
      min: '12:00:00',
      max: '21:00:00',
    });
  });

  it('expands the end of the day when late hours are requested', () => {
    assert.deepEqual(getCalendarTimeRange(true), {
      min: '12:00:00',
      max: '24:00:00',
    });
  });

  it('offers only one-hour starts that fit inside the selected work window', () => {
    const coreSlots = getCalendarSlotLabels(false);
    const expandedSlots = getCalendarSlotLabels(true);
    assert.equal(coreSlots[0], '12:00');
    assert.equal(coreSlots.at(-1), '20:00');
    assert.equal(expandedSlots.at(-1), '23:00');
    assert.equal(coreSlots.length, 17);
    assert.equal(expandedSlots.length, 23);
  });
});
