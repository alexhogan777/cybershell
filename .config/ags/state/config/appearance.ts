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

function lighten(input: string) {
  return input
    .split(',')
    .map((v: any) => {
      let int = parseInt(v);
      return int + 25;
    })
    .join(',');
}
function darken(input: string) {
  return input
    .split(',')
    .map((v: any) => {
      let int = parseInt(v);
      return int - int / 10;
    })
    .join(',');
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

    // Apply GTK
    const bg = `rgba(${this.#bg},${this.#transparency})`;
    const bgHex = `#${convertToHex(this.#bg)}${convertToHex(String(this.#transparency * 255))}`;
    const surface = `rgba(${this.#surface},${this.#transparency})`;
    const surfaceHex = `#${convertToHex(this.#surface)}${convertToHex(
      String(this.#transparency * 255)
    )}`;
    const hoverHex = `#${convertToHex(lighten(this.#surface))}${convertToHex(
      String(this.#transparency * 255)
    )}`;
    const view = `rgba(${this.#view},${this.#transparency})`;
    const viewHex = `#${convertToHex(this.#view)}${convertToHex(String(this.#transparency * 255))}`;
    const accent = `#${convertToHex(this.#accent)}`;
    const text = `#${convertToHex(this.#text)}`;

    const gtkSettings = `@define-color theme_fg_color ${accent};
@define-color theme_bg_color ${bg};
@define-color theme_base_color #${convertToHex(this.#bg)};
@define-color theme_unfocused_bg_color ${bg};
@define-color theme_unfocused_base_color ${bg};

@define-color accent_color ${accent};
@define-color accent_bg_color ${accent};
@define-color accent_fg_color ${text};
@define-color destructive_color #ff7b63;
@define-color destructive_bg_color #c01c28;
@define-color destructive_fg_color ${text};
@define-color success_color #8ff0a4;
@define-color success_bg_color #26a269;
@define-color success_fg_color ${text};
@define-color warning_color #f8e45c;
@define-color warning_bg_color #cd9309;
@define-color warning_fg_color rgba(0, 0, 0, 0.8);
@define-color error_color #ff7b63;
@define-color error_bg_color #c01c28;
@define-color error_fg_color ${text};
@define-color window_bg_color ${bg};
@define-color window_fg_color ${text};
@define-color view_bg_color ${view};
@define-color view_fg_color ${text};
@define-color headerbar_bg_color #${convertToHex(this.#surface)};
@define-color headerbar_fg_color ${text};
@define-color headerbar_border_color ${text};
@define-color headerbar_backdrop_color @window_bg_color;
@define-color headerbar_shade_color rgba(0, 0, 0, 0.36);
@define-color card_bg_color ${surface};
@define-color card_fg_color ${text};
@define-color card_shade_color rgba(0, 0, 0, 0.36);
@define-color dialog_bg_color ${bg};
@define-color dialog_fg_color ${text};
@define-color popover_bg_color ${bg};
@define-color popover_fg_color ${text};
@define-color shade_color rgba(0, 0, 0, 0.36);
@define-color scrollbar_color ${accent};
@define-color scrollbar_outline_color ${accent};
@define-color sidebar_bg_color @headerbar_bg_color;
@define-color sidebar_fg_color @headerbar_fg_color;
@define-color sidebar_border_color @window_bg_color;
@define-color sidebar_backdrop_color @headerbar_backdrop_color;
@define-color blue_1 #99c1f1;
@define-color blue_2 #62a0ea;
@define-color blue_3 #3584e4;
@define-color blue_4 #1c71d8;
@define-color blue_5 #1a5fb4;
@define-color green_1 #8ff0a4;
@define-color green_2 #57e389;
@define-color green_3 #33d17a;
@define-color green_4 #2ec27e;
@define-color green_5 #26a269;
@define-color yellow_1 #f9f06b;
@define-color yellow_2 #f8e45c;
@define-color yellow_3 #f6d32d;
@define-color yellow_4 #f5c211;
@define-color yellow_5 #e5a50a;
@define-color orange_1 #ffbe6f;
@define-color orange_2 #ffa348;
@define-color orange_3 #ff7800;
@define-color orange_4 #e66100;
@define-color orange_5 #c64600;
@define-color red_1 #f66151;
@define-color red_2 #ed333b;
@define-color red_3 #e01b24;
@define-color red_4 #c01c28;
@define-color red_5 #a51d2d;
@define-color purple_1 #dc8add;
@define-color purple_2 #c061cb;
@define-color purple_3 #9141ac;
@define-color purple_4 #813d9c;
@define-color purple_5 #613583;
@define-color brown_1 #cdab8f;
@define-color brown_2 #b5835a;
@define-color brown_3 #986a44;
@define-color brown_4 #865e3c;
@define-color brown_5 #63452c;
@define-color light_1 #ffffff;
@define-color light_2 #f6f5f4;
@define-color light_3 #deddda;
@define-color light_4 #c0bfbc;
@define-color light_5 #9a9996;
@define-color dark_1 #77767b;
@define-color dark_2 #5e5c64;
@define-color dark_3 #3d3846;
@define-color dark_4 #241f31;
@define-color dark_5 #000000;`;
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
$bg_hover: lighten($bg, 10%);
$bg_trans: rgba($bg, $transparency);
$bg_trans_hover: lighten($bg_trans, 10%);

$surface: rgb(${this.#surface});
$surface_hover: lighten($surface, 10%);
$surface_trans: rgba($surface, $transparency);
$surface_trans_hover: lighten($surface_trans, 10%);

$hover: $surface_hover;
$hover_trans: rgba($hover, $transparency);

$accent: rgb(${this.#accent});
$accent_hover: lighten($accent, 10%);
$accent_trans: rgba($accent, $transparency);
$accent_trans_hover: lighten($accent_trans, 10%);

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

layerrule = ignorealpha ${this.#transparency - 0.01}, gtk-layer-shell
  
decoration {
  rounding = ${this.#cornerRounding}
  
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
    hyprbars {
        bar_height = 24
        bar_padding = 10
        bar_button_padding = 5
        bar_precedence_over_border = false
        bar_part_of_window = false

        bar_color = rgb(${this.#bg})

        windowrulev2 = plugin:hyprbars:bar_color rgb(${convertToHex(this.#surface)}), focus:1
    }
  }
${hyprlandConfAfter}
`
    );

    // Apply Kitty
    let kittyConf = readFile(`${HOME}/.config/kitty/kitty.conf`);
    kittyConf = kittyConf.slice(0, kittyConf.indexOf('# ASTAL') - 1);

    kittyConf = `${kittyConf}
# ASTAL
foreground #${convertToHex(this.#text)}
background #${convertToHex(this.#bg)}

background_opacity ${this.#transparency}`;

    writeFile(`${HOME}/.config/kitty/kitty.conf`, kittyConf);

    exec(['sass', './style.scss', '/tmp/style.css']);
    App.apply_css('/tmp/style.css');

    // Apply VSCode
    let codeConf = JSON.parse(readFile(`${HOME}/.config/Code/User/settings.json`));
    let wbColors = codeConf['workbench.colorCustomizations'];
    wbColors['selection.background'] = accent;
    wbColors['input.background'] = surfaceHex;
    wbColors['dropdown.background'] = surfaceHex;
    wbColors['list.dropBackground'] = surfaceHex;
    wbColors['button.foreground'] = text;
    wbColors['button.background'] = accent;
    wbColors['badge.foreground'] = text;
    wbColors['badge.background'] = accent;
    wbColors['scrollbarSlider.background'] = surfaceHex;
    wbColors['scrollbarSlider.hoverBackground'] = hoverHex;
    wbColors['scrollbarSlider.activeBackground'] = accent;
    wbColors['editor.background'] = `#141414`;
    wbColors['editor.foreground'] = text;

    wbColors['editorCursor.foreground'] = accent;

    wbColors['sideBar.background'] = bgHex;
    wbColors['sideBar.foreground'] = text;
    wbColors['sideBarSectionHeader.background'] = surfaceHex;
    wbColors['activityBar.background'] = surfaceHex;
    wbColors['activityBar.foreground'] = text;
    wbColors['activtyBarBadge.background'] = accent;
    wbColors['activityBarBadge.foreground'] = text;

    codeConf['workbench.colorCustomizations'] = wbColors;
    writeFile(`${HOME}/.config/Code/User/settings.json`, JSON.stringify(codeConf));
  }

  #transparency = getFromOptions('transparency');
  #bg = getFromOptions('bg');
  #view = darken(this.#bg);
  #accent = getFromOptions('accent');
  #surface = lighten(this.#bg);
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
  get view() {
    return this.#view;
  }
  @property(String)
  get surface() {
    return this.#surface;
  }
  @property(String)
  get accent() {
    return this.#accent;
  }
  set accent(value) {
    this.updateOption('accent', value);
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

  @signal(Appearance)
  updated(value: Appearance) {
    return value;
  }

  constructor() {
    super();

    monitorFile(OPTIONS, async (f) => {
      const v = await readFileAsync(f).then((value) => JSON.parse(value));
      if (v.transparency !== this.#transparency) {
        this.#transparency = Number(v.transparency);
        this.notify('transparency');
        this.emit('updated', this);
      }
      if (v.bg !== this.#bg) {
        this.#bg = String(v.bg);
        this.#view = String(darken(v.bg));
        this.#surface = String(lighten(v.bg));
        this.notify('bg');
        this.notify('surface');
        this.notify('view');
        this.emit('updated', this);
      }
      if (v.accent !== this.#accent) {
        this.#accent = String(v.accent);
        this.notify('accent');
        this.emit('updated', this);
      }
      if (v.hover !== this.#hover) {
        this.#hover = String(v.hover);
        this.notify('hover');
        this.emit('updated', this);
      }
      if (v.text !== this.#text) {
        this.#text = String(v.text);
        this.notify('text');
        this.emit('updated', this);
      }
      if (v.error !== this.#error) {
        this.#error = String(v.error);
        this.notify('error');
        this.emit('updated', this);
      }
      if (v.borderWidth !== this.#borderWidth) {
        this.#borderWidth = Number(v.borderWidth);
        this.notify('borderWidth');
        this.emit('updated', this);
      }
      if (v.cornerRounding !== this.#cornerRounding) {
        this.#cornerRounding = Number(v.cornerRounding);
        this.notify('cornerRounding');
        this.emit('updated', this);
      }
      if (v.paddingBase !== this.#paddingBase) {
        this.#paddingBase = Number(v.paddingBase);
        this.notify('paddingBase');
        this.emit('updated', this);
      }
      if (v.buttonSize !== this.#buttonSize) {
        this.#buttonSize = Number(v.buttonSize);
        this.notify('buttonSize');
        this.emit('updated', this);
      }
      this.syncAppearance();

      if (v.wallpaperPath !== this.#wallpaperPath) {
        this.#wallpaperPath = String(v.wallpaperPath);
        execAsync(['bash', '-c', `swww img ${this.#wallpaperPath}`]);
        this.notify('wallpaperPath');
        this.emit('updated', this);
      }
    });
  }
}
