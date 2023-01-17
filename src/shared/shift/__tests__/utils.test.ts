import { describe, expect, test } from '@jest/globals';
import moment from 'moment';
import { ShiftType } from '../../types';
import { getTimeRangeShift, isShiftActive } from '../../utils';

describe('Utils tests', () => {
  test('expect getTimeRangeShift toBe', () => {
    const {
      startTime,
      endTime,
      yesterdayStartTime,
      yesterdayEndTime
    } = getTimeRangeShift(
      {
        id: 1,
        name: 'Test shift',
        days: '[\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sun\"]',
        startTimeV2: '08:00',
        endTimeV2: '18:00'
      } as ShiftType,
      moment('01-03-2023 09:15:00', 'MM-DD-YYYY HH:mm:ss')
    );

    expect(startTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-03-2023 08:00:00');
    expect(endTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-03-2023 18:00:00');
    expect(yesterdayStartTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-02-2023 08:00:00');
    expect(yesterdayEndTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-02-2023 18:00:00');
  });
  test('expect getTimeRangeShift second toBe', () => {
    const {
      startTime,
      endTime,
      yesterdayStartTime,
      yesterdayEndTime
    } = getTimeRangeShift(
      {
        id: 1,
        name: 'Test shift',
        days: '[\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sun\"]',
        startTimeV2: '19:00',
        endTimeV2: '07:00'
      } as ShiftType,
      moment('01-03-2023 21:20:00', 'MM-DD-YYYY HH:mm:ss')
    );

    expect(startTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-03-2023 19:00:00');
    expect(endTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-04-2023 07:00:00');
    expect(yesterdayStartTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-02-2023 19:00:00');
    expect(yesterdayEndTime.format('MM-DD-YYYY HH:mm:ss')).toBe('01-03-2023 07:00:00');
  });
  test('expect isShiftActive toBeTruthy', () => {
    const isActive = isShiftActive(
      {
        id: 1,
        name: 'Test shift',
        days: '[\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sun\"]',
        startTimeV2: '08:00',
        endTimeV2: '18:00'
      } as ShiftType,
      moment('01-03-2023 08:00:00', 'MM-DD-YYYY HH:mm:ss'),
      moment('01-03-2023 18:00:00', 'MM-DD-YYYY HH:mm:ss'),
      moment('01-03-2023 12:20:00', 'MM-DD-YYYY HH:mm:ss')
    );

    expect(isActive).toBeTruthy();
  });
  test('expect isShiftActive toBeFalsy', () => {
    const isActive = isShiftActive(
      {
        id: 1,
        name: 'Test shift',
        days: '[\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sun\"]',
        startTimeV2: '08:00',
        endTimeV2: '18:00'
      } as ShiftType,
      moment('01-03-2023 08:00:00', 'MM-DD-YYYY HH:mm:ss'),
      moment('01-03-2023 18:00:00', 'MM-DD-YYYY HH:mm:ss'),
      moment('01-03-2023 21:20:00', 'MM-DD-YYYY HH:mm:ss')
    );

    expect(isActive).toBeFalsy();
  });
  test('expect isShiftActive second toBeFalsy', () => {
    const isActive = isShiftActive(
      {
        id: 1,
        name: 'Test shift',
        days: '[\"Mon\",\"Wed\",\"Thu\",\"Fri\",\"Sun\"]',
        startTimeV2: '08:00',
        endTimeV2: '18:00'
      } as ShiftType,
      moment('01-03-2023 08:00:00', 'MM-DD-YYYY HH:mm:ss'),
      moment('01-03-2023 18:00:00', 'MM-DD-YYYY HH:mm:ss'),
      moment('01-03-2023 10:20:00', 'MM-DD-YYYY HH:mm:ss')
    );

    expect(isActive).toBeFalsy();
  });
});
