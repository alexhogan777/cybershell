// Astal
import { Astal, Gtk } from 'astal/gtk3';
import { Variable, bind } from 'astal';

// Config
import Config from '../../state/config/config';
const config = Config.get_default();
const spacing = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
);

// Functions
import { playSound } from '../../utils/play_sound';

// Widgets
import { MaterialIcon } from './MaterialIcon';

export interface Option {
  name: string;
  icon?: string;
}

export const Dropdown = ({
  reveal,
  options,
  selected,
  onChange,
  onRealize,
}: {
  reveal: Variable<boolean>;
  options: Option[];
  selected: Variable<number>;
  onChange?: (self: Gtk.Button, index?: number) => void;
  onRealize?: (self: Astal.Box) => void;
}) => {
  const SelectedOption = ({
    name,
    icon,
    index,
  }: {
    name: string;
    icon?: string;
    index: number;
  }) => {
    return (
      <button
        className='dropdown-option selected'
        cursor='pointer'
        onClick={(self, event) => {
          if (event.button === Astal.MouseButton.PRIMARY) {
            reveal.set(!reveal.get());
            playSound('button');
          }
        }}
      >
        <box spacing={spacing}>
          {icon && <MaterialIcon icon={icon} size={1.5} css='font-weight: normal;' />}
          <label label={name} wrap xalign={0} />
          <box hexpand />
          <MaterialIcon
            css='font-weight: normal;'
            icon={bind(reveal).as((v) => `${v ? 'arrow_drop_down' : 'arrow_drop_up'}`)}
            size={1.5}
          />
        </box>
      </button>
    );
  };

  const Option = ({ name, icon, index }: { name: string; icon?: string; index: number }) => {
    return (
      <button
        className='dropdown-option'
        cursor='pointer'
        visible={bind(selected).as((s) => {
          return s !== index;
        })}
        onClick={(self, event) => {
          if (event.button === Astal.MouseButton.PRIMARY) {
            playSound('button');
            selected.set(index);
            reveal.set(false);
            onChange && onChange(self, index);
          }
        }}
      >
        <box spacing={spacing}>
          {icon && <MaterialIcon icon={icon} size={1.5} css='font-weight: normal;' />}
          <label label={name} wrap xalign={0} />
        </box>
      </button>
    );
  };

  return (
    <box
      vertical
      className={bind(reveal).as((v) => `dropdown ${v && 'expanded'}`)}
      onRealize={onRealize && onRealize}
      setup={(self) => {
        function mapped() {}
        function unmapped() {
          reveal.set(false);
        }
        self.connect('map', mapped);
        self.connect('unmap', unmapped);
      }}
    >
      {bind(selected).as((s) => {
        return SelectedOption({
          name: options[s].name,
          icon: options[s].icon,
          index: s,
        });
      })}
      <revealer transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN} revealChild={bind(reveal)}>
        <box vertical spacing={spacing}>
          {bind(selected).as((s) => {
            return options.map(({ name, icon }, i) => Option({ name: name, icon: icon, index: i }));
          })}
        </box>
      </revealer>
    </box>
  );
};
