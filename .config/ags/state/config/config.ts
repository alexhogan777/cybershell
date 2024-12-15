// Astal
import GObject, { register, property } from 'astal/gobject';
import {
  monitorFile,
  readFileAsync,
  readFile,
  writeFileAsync,
  writeFile,
} from 'astal/file';
import { App } from 'astal/gtk3';

// Libraries
import Appearance from './appearance/appearance';

@register({ GTypeName: 'Config' })
export default class Config extends GObject.Object {
  static instance: Config;
  static get_default() {
    if (!this.instance) this.instance = new Config();
    return this.instance;
  }

  #appearance = Appearance.get_default();

  @property(GObject.Object)
  get appearance() {
    return this.#appearance;
  }
}
