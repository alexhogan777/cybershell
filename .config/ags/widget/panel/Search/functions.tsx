// Astal
import { Variable, execAsync } from 'astal';

// Libraries
import Apps from 'gi://AstalApps';
const apps = new Apps.Apps({
  nameMultiplier: 2,
  entryMultiplier: 0,
  executableMultiplier: 2,
});
import Panel from '../../../state/panel/panel';
const panel = Panel.get_default();

// Config
import { userConfig } from '../../../config/user_config';

export interface SearchItem {
  type: 'pinned-app' | 'app' | 'command' | 'web';
  app?: Apps.Application;
}

export const query = Variable<string>('');

export const searchItems = Variable<SearchItem[]>([]);
export const visibleSearchItems = Variable<SearchItem[]>([]);

const allApps = apps.get_list();

export function updateSearchItems(q: string) {
  if (q === query.get()) {
    const _apps = apps
      .fuzzy_query(q)
      .slice(0, userConfig.panel.search.resultsShown)
      .map((app) => {
        const item: SearchItem = { type: 'app', app: app };
        return item;
      });
    const pinnedApps = allApps
      .filter((app) => {
        const _app: any = app.app;
        const _pinnedApps = userConfig.panel.search.pinned;
        let filename = _app.filename.slice(_app.filename.lastIndexOf('/') + 1);
        if (_pinnedApps.includes(filename)) return true;
        if (_pinnedApps.includes(_app.filename)) return true;
        return false;
      })
      .map((app) => {
        const item: SearchItem = { type: 'pinned-app', app: app };
        return item;
      });

    const web: SearchItem = { type: 'web' };
    const command: SearchItem = { type: 'command' };

    searchItems.set([...pinnedApps, ..._apps, command, web]);

    let pinned_apps_shown = false;
    if (!q) pinned_apps_shown = true;
    if (_apps.length === 0) pinned_apps_shown = true;
    const apps_shown = !pinned_apps_shown;
    const actions_shown = q;

    if (pinned_apps_shown) visibleSearchItems.set([...pinnedApps]);
    if (apps_shown) visibleSearchItems.set([..._apps]);
    if (actions_shown) visibleSearchItems.set([...visibleSearchItems.get(), command, web]);
  }
}

export const selectedSearchItem = Variable<SearchItem | null>(null);
export function changeSearchItemSelection(delta: number) {
  const _visibleSearchItems = visibleSearchItems.get();
  const _selectedSearchItem = selectedSearchItem.get();
  let newIndex = _visibleSearchItems.findIndex((vsi) => {
    if (_selectedSearchItem?.app) {
      return vsi.app === _selectedSearchItem.app;
    }
    return vsi.type === _selectedSearchItem?.type;
  });

  if (delta > 0) {
    newIndex++;
    if (newIndex > _visibleSearchItems.length - 1) newIndex = 0;
  }
  if (delta < 0) {
    newIndex--;
    if (newIndex < 0) newIndex = _visibleSearchItems.length - 1;
  }

  selectedSearchItem.set(_visibleSearchItems[newIndex]);
}

export function executeSelectedSearchItem() {
  const item = selectedSearchItem.get();
  if (item) {
    if (item.app) item.app.launch();
    if (item.type === 'command')
      execAsync(['bash', '-c', `${userConfig.panel.search.terminal} ${query.get()}`]).catch(print);

    if (item.type === 'web')
      execAsync([
        'bash',
        '-c',
        `xdg-open "${userConfig.panel.search.searchEngine.replace('%s', query.get())}"`,
      ]).catch(print);
  }
  panel.togglePanel(panel.monitor, 'keybind');
}
