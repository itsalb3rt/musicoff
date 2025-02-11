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

export const base64ToAudio = (base64) => {
  console.log('🚀 ~ base64ToAudio ~ base64:', base64)
  // Remove the data prefix if exists (e.g., "data:audio/mp3;base64,")
  const base64String = base64.split(',')[1];

  // Convert Base64 to raw binary data
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Create Uint8Array
  const byteArray = new Uint8Array(byteNumbers);

  // Create Blob from binary data
  const blob = new Blob([byteArray], { type: "audio/mp3" });

  // Create Object URL
  return URL.createObjectURL(blob);
}
