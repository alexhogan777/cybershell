// Astal
import GObject, { register, property } from 'astal/gobject';

// Libraries
import Apps from './apps';
import Appearance from './appearance';
import Localization from './localization';

@register({ GTypeName: 'Config' })
export default class Config extends GObject.Object {
  static instance: Config;
  static get_default() {
    if (!this.instance) this.instance = new Config();
    return this.instance;
  }

  #appearance = Appearance.get_default();
  #apps = Apps.get_default();
  #localization = Localization.get_default();

  syncConfig() {
    this.#appearance.syncAppearance();
    this.#apps.syncApps();
  }

  @property(GObject.Object)
  get appearance() {
    return this.#appearance;
  }

  @property(GObject.Object)
  get apps() {
    return this.#apps;
  }

  @property(GObject.Object)
  get localization() {
    return this.#localization;
  }
}
