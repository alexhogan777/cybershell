import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';
import { userConfig } from '../../../config/user_config';
import { PanelSection } from '../PanelSection';
import { XButton } from '../../common/XButton';
import { QuickSettings } from './QuickSettings';
import { Session, showConfirm } from './Session';
import { Audio } from './Audio';
import { Network } from './Network';
import { Bluetooth } from './Bluetooth';

export const selectedSubsection = Variable<string>('Audio');
export function changeSubsection(subsection: string) {
  selectedSubsection.set(subsection);
}

export const Subsection = ({
  subsection,
  child,
}: {
  subsection: string;
  child?: Gtk.Widget;
}) => {
  return (
    <box name={subsection} className='subsection'>
      {child ? child : `hello ${subsection}`}
    </box>
  );
};

export const Settings = (monitorInt: number) => {
  const SubsectionButton = ({
    subsection,
    icon,
  }: {
    subsection: string;
    icon: string;
  }) => {
    return (
      <XButton
        hexpand
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        className={bind(selectedSubsection).as(
          (sss) => `subsection-button ${sss === subsection && 'active'}`
        )}
        iconObj={{ icon: icon, size: 2 }}
        tooltipText={subsection}
        onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
          if (event.button === Astal.MouseButton.PRIMARY) {
            changeSubsection(subsection);
            showConfirm.set(false);
          }
        }}
      />
    );
  };

  const SubsectionSelector = () => {
    return (
      <box
        className='subsection-selector corners-top'
        spacing={userConfig.appearance.spacing}
        hexpand
        // halign={Gtk.Align.CENTER}
        setup={(self) => {
          function mapped() {}
          function unmapped() {
            selectedSubsection.set('Audio');
          }
          self.connect('map', mapped);
          self.connect('unmap', unmapped);
        }}
      >
        <SubsectionButton subsection='Audio' icon='volume_up' />
        <SubsectionButton subsection='Network' icon='bigtop_updates' />
        <SubsectionButton subsection='Bluetooth' icon='bluetooth' />
        <SubsectionButton subsection='Display' icon='display_settings' />
        <SubsectionButton subsection='Session' icon='power_settings_new' />
      </box>
    );
  };

  const title = () => {
    return <label label='Settings' className='title' />;
  };

  return (
    <PanelSection
      monitorInt={monitorInt}
      section='Settings'
      icon='settings'
      title={title()}
    >
      <box
        vertical
        spacing={userConfig.appearance.spacing}
        className='section-content'
      >
        <QuickSettings />
        <box css='min-height: 1em;' />
        <SubsectionSelector />
        <stack
          transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
          visibleChildName={bind(selectedSubsection)}
          vhomogeneous={false}
          interpolateSize
        >
          <Audio />
          <Network />
          <Bluetooth />
          <Subsection subsection='Display' />
          <Session />
        </stack>
      </box>
    </PanelSection>
  );
};