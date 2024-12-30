// Astal
import { Variable, bind, execAsync } from 'astal';

// Libraries
import NightLight from '../../../../state/nightlight/nightlight';

// Widgets
import { QuickSetting } from './main';

export const PopupsToggle = () => {
  return (
    <QuickSetting
      name='Popups'
      icon='notifications'
      tooltipText='Toggle notification popups on/off'
    />
  );
};

export const DoNotDisturbToggle = () => {
  return (
    <QuickSetting
      name='Do Not Disturb'
      icon='do_not_disturb_on'
      tooltipText={`Toggle do not disturb on/off\n(Disables notification popups and sounds)`}
    />
  );
};

export const ScreenIdleToggle = () => {
  const active = Variable(false);
  function checkActive() {
    execAsync(['bash', '-c', 'pidof hypridle'])
      .then(
        () => active.set(true),
        () => active.set(false)
      )
      .catch();
  }
  checkActive();
  return (
    <QuickSetting
      name='Screen Idle'
      icon='snooze'
      tooltipText={`Enable screen idling service,\ndimming the screen and eventually suspending the system.`}
      activeIf={active}
      execute={() => {
        execAsync(['bash', '-c', 'killall hypridle || hypridle']).catch();
        checkActive();
      }}
    />
  );
};

const nightlight = NightLight.get_default();
export const NightLightToggle = () => {
  const active = Variable(nightlight.enabled);

  return (
    <QuickSetting
      name='Night Light'
      icon='bedtime'
      tooltipText='Toggle blue light filter on/off'
      activeIf={active}
      execute={() => (nightlight.enabled = !nightlight.enabled)}
      setup={(self) => {
        function update() {
          active.set(nightlight.enabled);
        }
        //@ts-expect-error
        self.hook(nightlight, 'notify', update);
      }}
    />
  );
};
