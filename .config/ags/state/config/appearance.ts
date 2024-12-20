// Astal
import GObject, { register, property, signal } from 'astal/gobject';
import { monitorFile, readFileAsync, readFile, writeFile } from 'astal/file';
import { App } from 'astal/gtk3';
import { exec, execAsync } from 'astal/process';

// Config
import { HOME } from '../../config/user_config';
const OPTIONS = `${HOME}/.config/cybershell/appearance.json`;
const GRADIENCE = `${HOME}/.config/presets/user/cybershell.json`;

function getFromOptions(key: string) {
  return JSON.parse(readFile(OPTIONS))[key];
}

@register({ GTypeName: 'ConfigAppearance' })
export default class Appearance extends GObject.Object {
  static instance: Appearance;
  static get_default() {
    if (!this.instance) this.instance = new Appearance();
    return this.instance;
  }

  updateOption(key: string, value: any) {
    let _options = JSON.parse(readFile(OPTIONS));
    _options[key] = value;

    writeFile(OPTIONS, JSON.stringify(_options));
  }

  syncAppearance() {
    // Apply GTK
    const gtkSettings = `@define-color theme_fg_color #AEE5FA;
@define-color theme_text_color rgb(${this.#text});
@define-color theme_bg_color rgba(${this.#bg},${this.#transparency});
@define-color theme_base_color rgba(${this.#bg},${this.#transparency});
@define-color theme_selected_bg_color rbga(${this.#hover},${this.#transparency});
@define-color theme_selected_fg_color rbga(${this.#hover},${this.#transparency});
@define-color insensitive_bg_color #1a1b26;
@define-color insensitive_fg_color rgba(192, 202, 245, 0.5);
@define-color insensitive_base_color #24283b;
@define-color theme_unfocused_fg_color #AEE5FA;
@define-color theme_unfocused_text_color #c0caf5;
@define-color theme_unfocused_bg_color rgba(${this.#bg},${this.#transparency});
@define-color theme_unfocused_base_color rgba(${this.#bg},${this.#transparency});
@define-color theme_unfocused_selected_bg_color #a9b1d6;
@define-color theme_unfocused_selected_fg_color rgba(0, 0, 0, 0.87);
@define-color unfocused_insensitive_color rgba(192, 202, 245, 0.5);
@define-color borders rgba(192, 202, 245, 0.12);
@define-color unfocused_borders rgba(192, 202, 245, 0.12);
@define-color warning_color #FDD633;
@define-color error_color #BA1B1B;
@define-color success_color #81C995;
@define-color wm_title #AEE5FA;
@define-color wm_unfocused_title rgba(192, 202, 245, 0.7);
@define-color wm_highlight rbga(${this.#hover},${this.#transparency});
@define-color wm_bg #1a1b26;
@define-color wm_unfocused_bg #1a1b26;
@define-color wm_button_close_icon #1a1b26;
@define-color wm_button_close_hover_bg #a9b1d6;
@define-color wm_button_close_active_bg #c7c7c7;
@define-color content_view_bg #1a1b26;
@define-color placeholder_text_color silver;
@define-color text_view_bg #1d1d1d;
@define-color budgie_tasklist_indicator_color #90D1F6;
@define-color budgie_tasklist_indicator_color_active #90D1F6;
@define-color budgie_tasklist_indicator_color_active_window #999999;
@define-color budgie_tasklist_indicator_color_attention #FDD633;
@define-color STRAWBERRY_100 #FF9262;
@define-color STRAWBERRY_300 #FF793E;
@define-color STRAWBERRY_500 #F15D22;
@define-color STRAWBERRY_700 #CF3B00;
@define-color STRAWBERRY_900 #AC1800;
@define-color ORANGE_100 #FFDB91;
@define-color ORANGE_300 #FFCA40;
@define-color ORANGE_500 #FAA41A;
@define-color ORANGE_700 #DE8800;
@define-color ORANGE_900 #C26C00;
@define-color BANANA_100 #FFFFA8;
@define-color BANANA_300 #FFFA7D;
@define-color BANANA_500 #FFCE51;
@define-color BANANA_700 #D1A023;
@define-color BANANA_900 #A27100;
@define-color LIME_100 #A2F3BE;
@define-color LIME_300 #8ADBA6;
@define-color LIME_500 #73C48F;
@define-color LIME_700 #479863;
@define-color LIME_900 #1C6D38;
@define-color BLUEBERRY_100 #94A6FF;
@define-color BLUEBERRY_300 #6A7CE0;
@define-color BLUEBERRY_500 #3F51B5;
@define-color BLUEBERRY_700 #213397;
@define-color BLUEBERRY_900 #031579;
@define-color GRAPE_100 #D25DE6;
@define-color GRAPE_300 #B84ACB;
@define-color GRAPE_500 #9C27B0;
@define-color GRAPE_700 #830E97;
@define-color GRAPE_900 #6A007E;
@define-color COCOA_100 #9F9792;
@define-color COCOA_300 #7B736E;
@define-color COCOA_500 #574F4A;
@define-color COCOA_700 #463E39;
@define-color COCOA_900 #342C27;
@define-color SILVER_100 #EEE;
@define-color SILVER_300 #CCC;
@define-color SILVER_500 #AAA;
@define-color SILVER_700 #888;
@define-color SILVER_900 #666;
@define-color SLATE_100 #888;
@define-color SLATE_300 #666;
@define-color SLATE_500 #444;
@define-color SLATE_700 #222;
@define-color SLATE_900 #111;
@define-color BLACK_100 #474341;
@define-color BLACK_300 #403C3A;
@define-color BLACK_500 #393634;
@define-color BLACK_700 #33302F;
@define-color BLACK_900 #2B2928;
@define-color accent_bg_color rgba(${this.#bg},${this.#transparency});
@define-color accent_fg_color rbg(${this.#text});
@define-color accent_color rgba(${this.#surface},${this.#transparency});
@define-color destructive_bg_color #FFB4AB;
@define-color destructive_fg_color #690005;
@define-color destructive_color #FFB4AB;
@define-color success_bg_color #81C995;
@define-color success_fg_color rgba(0, 0, 0, 0.87);
@define-color warning_bg_color #FDD633;
@define-color warning_fg_color rgba(0, 0, 0, 0.87);
@define-color error_bg_color #FFB4AB;
@define-color error_fg_color #690005;
@define-color window_bg_color rgba(${this.#bg},${this.#transparency});
@define-color window_fg_color rbga(${this.#hover},${this.#transparency});
@define-color view_bg_color #1D0F18;
@define-color view_fg_color #F6DBE9;
@define-color headerbar_bg_color #440044;
@define-color headerbar_fg_color #ffffff;
@define-color headerbar_border_color #220022;
@define-color headerbar_backdrop_color @headerbar_bg_color;
@define-color headerbar_shade_color rgba(0, 0, 0, 0.09);
@define-color card_bg_color rgba(${this.#surface_dark},${this.#transparency});
@define-color card_fg_color #ffffff;
@define-color card_shade_color rgba(0, 0, 0, 0.09);
@define-color dialog_bg_color #440044;
@define-color dialog_fg_color #fff;
@define-color popover_bg_color #6D3850;
@define-color popover_fg_color #FFDBE7;
@define-color thumbnail_bg_color #1a1b26;
@define-color thumbnail_fg_color #AEE5FA;
@define-color shade_color rbga(${this.#hover},${this.#transparency});
@define-color scrollbar_outline_color rgba(0, 0, 0, 0.5);
@define-color sidebar_bg_color @window_bg_color;
@define-color sidebar_fg_color @window_fg_color;
@define-color sidebar_border_color @sidebar_bg_color;
@define-color sidebar_backdrop_color @sidebar_bg_color;`;
    writeFile(`${HOME}/.config/gtk-3.0/gtk.css`, gtkSettings);
    writeFile(`${HOME}/.config/gtk-4.0/gtk.css`, gtkSettings);

    // Apply Styles
    writeFile(
      `${HOME}/.config/ags/style/astal.scss`,
      `// This file is automatically generated by Astal.
// If you want to change the colors, do so in ~/.config/ags/config/styles.json
// Run "ags quit" then "ags run" to apply new colors.

$transparency: ${this.#transparency};
$bg: rgb(${this.#bg});
$bg_trans: rgba($bg, $transparency);
$surfaceDark: rgb(${this.#surface_dark});
$surfaceDark_trans: rgba($surfaceDark, $transparency);
$surface: rgb(${this.#surface});
$surface_trans: rgba($surface, $transparency);
$fg: rgb(${this.#fg});
$fg_trans: rgba($fg, $transparency);
$hover: rgb(${this.#hover});
$hover_trans: rgba($hover, $transparency);
$text: rgb(${this.#text});
$error: rgb(${this.#error});

$paddingBase: ${this.#paddingBase}px;
$borderWidth: ${this.#borderWidth}px;
$brv: ${this.#cornerRounding}px;
$buttonSize: ${this.#buttonSize}px;
        `
    );

    // Apply Hyprland
    let hyprlandConf = readFile(`${HOME}/.config/hypr/hyprland/astal.conf`);
    const hyprlandConfAfter = hyprlandConf.slice(hyprlandConf.indexOf('# APPS') - 1);
    writeFile(
      `${HOME}/.config/hypr/hyprland/astal.conf`,
      `# ASTAL
# Run "ags quit" then "ags run" to apply new colors.
# If you want to change the colors, do so in ~/.config/ags/config/styles.json

# APPEARANCE
general {
  col.active_border = rgb(${this.#surface})
  col.inactive_border = rgb(${this.#bg})
  
  gaps_in = ${this.#paddingBase / 2}
  gaps_out = ${this.#paddingBase}
  gaps_workspaces = 50
  border_size = ${this.#borderWidth}
}
  
decoration {
  rounding = ${this.#cornerRounding / 2}
  
  shadow {
    color = rgba(${this.#surface},1)
    color_inactive = rgba(${this.#bg},1)
    }
  }
  
  plugin {
    overview {
      panelColor = rgba(${this.#bg},${this.#transparency})
      panelBorderColor = rgb(${this.#bg})
      workspaceActiveBorder = rgb(${this.#surface})
      workspaceInactiveBorder = rgb(${this.#bg})
    }
  }
${hyprlandConfAfter}
`
    );

    // Apply Kitty
    let kittyConf = readFile(`${HOME}/.config/kitty/kitty.conf`);
    kittyConf = kittyConf.slice(0, kittyConf.indexOf('# ASTAL') - 1);

    function convertToHex(input: any) {
      return input
        .split(',')
        .map((v: any) => {
          let int = parseInt(v);
          if (int < 16) return `0${int.toString(16)}`;
          return int.toString(16);
        })
        .join('');
    }

    kittyConf = `${kittyConf}
# ASTAL
foreground #${convertToHex(this.#text)}
background #${convertToHex(this.#bg)}

background_opacity ${this.#transparency}`;

    writeFile(`${HOME}/.config/kitty/kitty.conf`, kittyConf);

    exec(['sass', './style.scss', '/tmp/style.css']);
    App.apply_css('/tmp/style.css');
  }

  #transparency = getFromOptions('transparency');
  #bg = getFromOptions('bg');
  #surface_dark = getFromOptions('surface_dark');
  #surface = getFromOptions('surface');
  #fg = getFromOptions('fg');
  #hover = getFromOptions('hover');
  #text = getFromOptions('text');
  #error = getFromOptions('error');
  #borderWidth = getFromOptions('borderWidth');
  #cornerRounding = getFromOptions('cornerRounding');
  #paddingBase = getFromOptions('paddingBase');
  #buttonSize = getFromOptions('buttonSize');
  #wallpaperPath = getFromOptions('wallpaperPath');

  @property(Number)
  get transparency() {
    return this.#transparency;
  }
  set transparency(value) {
    this.updateOption('transparency', value);
  }

  @property(String)
  get bg() {
    return this.#bg;
  }
  set bg(value) {
    this.updateOption('bg', value);
  }

  @property(String)
  get surface_dark() {
    return this.#surface_dark;
  }
  set surface_dark(value) {
    this.updateOption('surface_dark', value);
  }

  @property(String)
  get surface() {
    return this.#surface;
  }
  set surface(value) {
    this.updateOption('surface', value);
  }

  @property(String)
  get fg() {
    return this.#fg;
  }
  set fg(value) {
    this.updateOption('fg', value);
  }

  @property(String)
  get hover() {
    return this.#hover;
  }
  set hover(value) {
    this.updateOption('hover', value);
  }

  @property(String)
  get text() {
    return this.#text;
  }
  set text(value) {
    this.updateOption('text', value);
  }

  @property(String)
  get error() {
    return this.#error;
  }
  set error(value) {
    this.updateOption('error', value);
  }

  @property(Number)
  get borderWidth() {
    return this.#borderWidth;
  }
  set borderWidth(value) {
    this.updateOption('borderWidth', value);
  }

  @property(Number)
  get cornerRounding() {
    return this.#cornerRounding;
  }
  set cornerRounding(value) {
    this.updateOption('cornerRounding', value);
  }

  @property(Number)
  get paddingBase() {
    return this.#paddingBase;
  }
  set paddingBase(value) {
    this.updateOption('paddingBase', value);
  }

  @property(Number)
  get buttonSize() {
    return this.#buttonSize;
  }
  set buttonSize(value) {
    this.updateOption('buttonSize', value);
  }

  @property(String)
  get wallpaperPath() {
    return this.#wallpaperPath;
  }
  set wallpaperPath(value) {
    this.updateOption('wallpaperPath', value);
  }

  constructor() {
    super();

    monitorFile(OPTIONS, async (f) => {
      const v = await readFileAsync(f).then((value) => JSON.parse(value));
      if (v.transparency !== this.#transparency) {
        this.#transparency = Number(v.transparency);
        this.notify('transparency');
      }
      if (v.bg !== this.#bg) {
        this.#bg = String(v.bg);
        this.notify('bg');
      }
      if (v.surface_dark !== this.#surface_dark) {
        this.#surface_dark = String(v.surface_dark);
        this.notify('surface_dark');
      }
      if (v.surface !== this.#surface) {
        this.#surface = String(v.surface);
        this.notify('surface');
      }
      if (v.fg !== this.#fg) {
        this.#fg = String(v.fg);
        this.notify('fg');
      }
      if (v.hover !== this.#hover) {
        this.#hover = String(v.hover);
        this.notify('hover');
      }
      if (v.text !== this.#text) {
        this.#text = String(v.text);
        this.notify('text');
      }
      if (v.error !== this.#error) {
        this.#error = String(v.error);
        this.notify('error');
      }
      if (v.borderWidth !== this.#borderWidth) {
        this.#borderWidth = Number(v.borderWidth);
        this.notify('borderWidth');
      }
      if (v.cornerRounding !== this.#cornerRounding) {
        this.#cornerRounding = Number(v.cornerRounding);
        this.notify('cornerRounding');
      }
      if (v.paddingBase !== this.#paddingBase) {
        this.#paddingBase = Number(v.paddingBase);
        this.notify('paddingBase');
      }
      if (v.buttonSize !== this.#buttonSize) {
        this.#buttonSize = Number(v.buttonSize);
        this.notify('buttonSize');
      }
      this.syncAppearance();

      if (v.wallpaperPath !== this.#wallpaperPath) {
        this.#wallpaperPath = String(v.wallpaperPath);
        execAsync(['bash', '-c', `swww img ${this.#wallpaperPath}`]);
        this.notify('wallpaperPath');
      }
    });
  }
}
