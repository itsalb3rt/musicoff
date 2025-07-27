import { Filesystem, Directory } from 'app/src-capacitor/node_modules/@capacitor/filesystem';

export const saveMusic = async ({ uuid, file }) => {
  try {
    // Ensure the music directory exists
    await Filesystem.mkdir({
      path: 'music',
      directory: Directory.Documents,
      recursive: true // Ensures parent directories are created if needed
    })

    // Write the file
    const { uri } = await Filesystem.writeFile({
      path: `music/${uuid}.txt`,
      data: file,
      directory: Directory.Documents
    });

    return uri;
  } catch (error) {
    console.error('Unable to write file', error);

    console.log('retrying without directory creation');
    // Retry without directory creation
    const { uri } = await Filesystem.writeFile({
      path: `music/${uuid}.txt`,
      data: file,
      directory: Directory.Documents
    });
    return uri;
  }
};


export const readMusic = async (uuid) => {
  try {
    const { data } = await Filesystem.readFile({ path: 'music/' + uuid + '.txt', directory: Directory.Documents });
    return data;
  }
  catch (error) {
    console.error('Unable to read file', error);
  }
}

export const deleteMusic = async (uuid) => {
  try {
    await Filesystem.deleteFile({ path: 'music/' + uuid + '.txt', directory: Directory.Documents });
  }
  catch (error) {
    console.error('Unable to delete file', error);
  }
}

export const saveThumbnail = async ({ uuid, file }) => {
  try {
    // Ensure the thumbnail directory exists
    await Filesystem.mkdir({
      path: 'thumbnails',
      directory: Directory.Documents,
      recursive: true // Ensures parent directories are created if needed
    })

    // Write the file
    const { uri } = await Filesystem.writeFile({
      path: `thumbnails/${uuid}.txt`,
      data: file,
      directory: Directory.Documents
    });

    return uri;
  }
  catch (error) {
    console.error('Unable to write file', error);

    console.log('retrying without directory creation');
    // Retry without directory creation
    const { uri } = await Filesystem.writeFile({
      path: `thumbnails/${uuid}.txt`,
      data: file,
      directory: Directory.Documents
    });
    return uri;
  }
}

export const readThumbnail = async (uuid) => {
  try {
    const { data } = await Filesystem.readFile({ path: 'thumbnails/' + uuid + '.txt', directory: Directory.Documents });
    return data;
  }
  catch (error) {
    console.error('Unable to read file', error);
  }
}

export const deleteThumbnail = async (uuid) => {
  try {
    await Filesystem.deleteFile({ path: 'thumbnails/' + uuid + '.txt', directory: Directory.Documents });
  }
  catch (error) {
    console.error('Unable to delete file', error);
  }
}
