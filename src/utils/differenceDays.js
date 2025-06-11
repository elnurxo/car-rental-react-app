function dateDiffInDays(date1, date2) {
  const timeDiff = Math.abs(
    new Date(date2).getTime() - new Date(date1).getTime()
  );
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}

export default dateDiffInDays;
