import { formatDateDMYSlashFromStringDate } from '@/utils/dateTimeUtil';

describe('formatDateDMYSlashFromStringDate', () => {
  it('should convert YYYY-MM-DD to DD / MM / YYYY', () => {
    expect(formatDateDMYSlashFromStringDate('2024-01-10')).toBe('10 / 01 / 2024');
  });

  it('should handle various valid dates', () => {
    expect(formatDateDMYSlashFromStringDate('1920-03-15')).toBe('15 / 03 / 1920');
    expect(formatDateDMYSlashFromStringDate('2025-12-31')).toBe('31 / 12 / 2025');
  });

  it('should return empty string as-is', () => {
    expect(formatDateDMYSlashFromStringDate('')).toBe('');
  });

  it('should return dash as-is', () => {
    expect(formatDateDMYSlashFromStringDate('-')).toBe('-');
  });

  it('should return string without 3 parts as-is', () => {
    expect(formatDateDMYSlashFromStringDate('2024-01')).toBe('2024-01');
    expect(formatDateDMYSlashFromStringDate('nodash')).toBe('nodash');
  });
});
