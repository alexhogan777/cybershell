// Astal
import { Gtk } from 'astal/gtk3';
import { bind, timeout } from 'astal';

// Libraries
import PanelLib from '../../../state/panel/panel';
const panel = PanelLib.get_default();

// Config
import { userConfig } from '../../../config/user_config';

// Functions
import { query, searchItems, updateSearchItems } from './functions';

// Widget
import { Result } from './Result';
import { PanelSection } from '../PanelSection';

export const Search = (monitorInt: number) => {
  const Results = () => {
    const isQueryEmpty = bind(query).as((v) => v === '');
    const isAppsEmpty = bind(searchItems).as(
      (sis) => sis.find((si) => si.type === 'app') === undefined
    );

    function filter(type: 'pinned-app' | 'app' | 'web' | 'command') {
      return bind(searchItems).as((sis) =>
        sis
          .filter((si) => si.type === type)
          .map((si) => Result(si.type, si.app && si.app))
      );
    }

    const PinnedAppItems = () => {
      const content = filter('pinned-app');
      return (
        <box
          name='pinned-apps'
          vertical
          spacing={userConfig.appearance.spacing}
          className='search-results-section'
        >
          <label className='h3' label='Pinned Apps' xalign={0} />
          <box
            vertical
            spacing={userConfig.appearance.spacing}
            css='padding-left: 2em;'
          >
            {content}
          </box>
        </box>
      );
    };

    const AppItems = () => {
      const content = filter('app');
      return (
        <box
          name='apps'
          vertical
          spacing={userConfig.appearance.spacing}
          className='search-results-section'
        >
          <label className='h3' label='Apps' xalign={0} />
          <box
            vertical
            spacing={userConfig.appearance.spacing}
            css='padding-left: 2em;'
          >
            {content}
          </box>
        </box>
      );
    };

    const Actions = () => {
      return (
        <revealer
          revealChild={isQueryEmpty.as((v) => !v)}
          transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
        >
          <box vertical spacing={userConfig.appearance.spacing}>
            {filter('command')}
            {filter('web')}
          </box>
        </revealer>
      );
    };

    return (
      <box
        vertical
        className='section-content'
        spacing={userConfig.appearance.spacing}
      >
        <stack
          interpolateSize
          vhomogeneous={false}
          transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
          visibleChildName={isAppsEmpty.as((a) => {
            const b = isQueryEmpty.get();

            if (!a && !b) return 'apps';
            return 'pinned-apps';
          })}
        >
          <PinnedAppItems />
          <AppItems />
        </stack>
        <Actions />
      </box>
    );
  };

  const title = () => {
    return (
      <stack
        visibleChildName={bind(panel, 'section').as((v) =>
          v === 'Search' ? 'searchbox' : 'title'
        )}
        transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
      >
        <label className='title' name='title' label='Search' xalign={0} />
        <entry
          name='searchbox'
          placeholderText={'Search apps, the web, or run commands'}
          hexpand
          valign={Gtk.Align.CENTER}
          onChanged={(v) => {
            query.set(v.text);
            timeout(500, () => updateSearchItems(v.text));
          }}
          setup={(self) => {
            function mapped() {
              updateSearchItems('');
              self.grab_focus();
            }
            function unmapped() {
              self.text = '';
              query.set('');
            }
            self.connect('map', mapped);
            self.connect('unmap', unmapped);
          }}
        />
      </stack>
    );
  };

  return (
    <PanelSection
      monitorInt={monitorInt}
      section='Search'
      icon='search'
      title={title()}
    >
      <Results />
    </PanelSection>
  );
};
