export const formatDateDMYSlashFromStringDate = (dateStr: string): string => {
  if (!dateStr || dateStr === '-') return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
  return dateStr;
};