export const formatYouTubeDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  let formattedDuration = [];
  if (hours > 0) formattedDuration.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) formattedDuration.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) formattedDuration.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

  return formattedDuration.join(' ') || '0 seconds';
}
