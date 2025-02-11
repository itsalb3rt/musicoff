export const formatYouTubeDuration = (duration) => {
  if (!duration) return '0 seconds';

  // check if the duration is a valid ISO 8601 duration
  if (!/^PT(\d+H)?(\d+M)?(\d+S)?$/.test(duration)) {
    return '0 seconds';
  }

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

export const getCurrentMusicStructured = (music) => {
  return {
    id: {
      originId: music.originId,
      videoId: music.uuid,
    },
    snippet: {
      title: music.title,
      thumbnails: {
        default: {
          url: music.thumbnail,
        },
      },
    },
    contentDetails: {
      duration: music.duration,
    },
  }
}
