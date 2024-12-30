import {
  exec,
  execAsync,
  GObject,
  interval,
  monitorFile,
  property,
  readFile,
  readFileAsync,
  register,
} from 'astal';
import { HOME } from '../config/user_config';

export interface DesktopFile {
  name: string;
  fileName: string;
  path: string;
  fileType: string;
  icon?: string;
}

function formatOutput(input: string) {
  function getName(fileName: string, fileType: string, path: string) {
    const fallback = fileName.slice(
      0,
      fileName.lastIndexOf('.') !== -1 ? fileName.lastIndexOf('.') : fileName.length
    );
    if (fileType === 'app') {
      let _output = readFile(path);

      if (_output.includes('Icon=')) {
        _output = _output.slice(_output.indexOf('Name=') + 5);
        _output = _output.slice(0, _output.indexOf('\n'));
        return _output;
      } else return fallback;
    }

    return fallback;
  }

  function getFileType(fileName: string, path: string) {
    if (!readFile(path)) return 'directory';
    if (fileName.includes('.desktop')) return 'app';
    return 'file';
  }

  function getIcon(fileType: string, path: string) {
    if (fileType === 'app') {
      let _output = readFile(path);

      if (_output.includes('Icon=')) {
        _output = _output.slice(_output.indexOf('Icon=') + 5);
        _output = _output.slice(0, _output.indexOf('\n'));
        return _output;
      } else {
        return 'file';
      }
    } else return 'folder';
  }

  let fileNames = input.split('\n');

  const formatted = fileNames.map((fileName) => {
    const path = `${HOME}/Desktop/${fileName}`;
    const fileType = getFileType(fileName, path);
    const name = getName(fileName, fileType, path);
    const icon = getIcon(fileType, path);

    return {
      name: name,
      fileName: fileName,
      path: path,
      fileType: fileType,
      icon: icon,
    };
  });

  const sorted = () => {
    const folders = formatted.filter((v) => v.fileType === 'directory');
    const apps = formatted.filter((v) => v.fileType === 'app');
    const other = formatted.filter((v) => v.fileType === 'file');

    return [...folders, ...apps, ...other];
  };

  return sorted();
}

@register({ GTypeName: 'Desktop' })
export default class Desktop extends GObject.Object {
  static instance: Desktop;
  static get_default() {
    if (!this.instance) this.instance = new Desktop();
    return this.instance;
  }

  #output = '';
  #files: DesktopFile[] | null = null;

  @property()
  get output() {
    return this.#output;
  }

  @property()
  get files() {
    return this.#files;
  }

  constructor() {
    super();

    interval(1000, () =>
      execAsync(`ls ${HOME}/Desktop`).then((v) => {
        if (this.#output !== v) {
          this.#output = v;
          this.#files = formatOutput(v);
          this.notify('files');
          this.notify('output');
        }
      })
    );
  }
}
