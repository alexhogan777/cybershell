// Astal
import { Astal } from 'astal/gtk3';
import { bind } from 'astal';

// Libraries
import Mpris from 'gi://AstalMpris';
const mpris = Mpris.get_default();

// Widgets
import { BarButton } from './BarButton';

function getIcon(player: Mpris.Player) {
  if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING) return 'pause';
  if (player.playbackStatus === Mpris.PlaybackStatus.PAUSED)
    return 'play_arrow';
  return 'music_note';
}
function getArtistsTitle(player: Mpris.Player) {
  return `${player.identity}\n${player.artist}\n${player.title}`;
}
export const Media = ({ monitorInt }: { monitorInt: number }) => {
  const MediaButton = (player: Mpris.Player | undefined) => {
    if (player)
      return (
        <BarButton
          icon={bind(player, 'playbackStatus').as((v) => {
            return getIcon(player);
          })}
          tooltipText={bind(player, 'playbackStatus').as((v) => {
            return getArtistsTitle(player);
          })}
          section='Media'
          monitorInt={monitorInt}
          onClickRelease={(_: any, event: Astal.ClickEvent) => {
            if (event.button === Astal.MouseButton.MIDDLE) player.play_pause();
          }}
        />
      );
    return (
      <BarButton
        icon='music_note'
        section='Media'
        monitorInt={monitorInt}
        tooltipText='Nothing playing'
      />
    );
  };

  return bind(mpris, 'players').as((ps) => MediaButton(ps[0]));
};
