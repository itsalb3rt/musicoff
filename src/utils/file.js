import { Filesystem, Directory } from 'app/src-capacitor/node_modules/@capacitor/filesystem';

export const saveMusic = async ({ uuidName, file }) => {
  try {

    // check if music dir exists
    const musicDir = await Filesystem.readdir({ path: 'music', directory: Directory.Documents });

    if (!musicDir.files.length) {
      await Filesystem.mkdir({ path: 'music', directory: Directory.Documents, recursive: false });
    }

    const { uri } = await Filesystem.writeFile({ path: 'music/' + uuidName + '.txt', data: file, directory: Directory.Documents });
    return uri;
  }
  catch (error) {
    console.error('Unable to write file', error);
  }
}

export const readMusic = async (uuidName) => {
  try {
    const { data } = await Filesystem.readFile({ path: 'music/' + uuidName + '.txt', directory: Directory.Documents });
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
