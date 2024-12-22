// Astal
import { bind, Variable } from 'astal';

// Libraries
import Mpris from 'gi://AstalMpris';
const mpris = Mpris.get_default();

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

// Widgets
import { MaterialIcon } from '../common/MaterialIcon';
import { PanelSection } from './PanelSection';
import { XButton } from '../common/XButton';

export const Media = (monitorInt: number) => {
  function lengthStr(length: number) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? '0' : '';
    return `${min}:${sec0}${sec}`;
  }

  const Player = (player: Mpris.Player) => {
    const CoverArt = () => {
      return (
        <box
          className='cover-art'
          css={`
            background-image: url('${player.artUrl}');
          `}
        />
      );
    };

    const Metadata = () => {
      const Identity = (identity: string) => {
        return (
          <box spacing={spacing}>
            <icon
              icon={player.busName.slice(23, player.busName.lastIndexOf('.'))}
              css='font-size: 1.5em;'
            />
            <label className='metadata-label' label={identity} truncate />
          </box>
        );
      };
      const TrackTitle = (trackTitle: string) => {
        return (
          <box spacing={spacing}>
            <MaterialIcon size={1.5} icon='music_note' />
            <label className='metadata-label' label={trackTitle} truncate />
          </box>
        );
      };
      const Artist = (artist: string) => {
        return (
          <box spacing={spacing}>
            <MaterialIcon size={1.5} icon='artist' />
            <label className='metadata-label' label={artist} truncate />
          </box>
        );
      };
      const Album = (album: string) => {
        return (
          <box spacing={spacing}>
            <MaterialIcon size={1.5} icon='album' />
            <label className='metadata-label' label={album} truncate />
          </box>
        );
      };

      return (
        <box vertical>
          {Identity(player.identity)}
          {player.title && TrackTitle(player.title)}
          {player.album && Album(player.album)}
          {player.artist && Artist(player.artist)}
        </box>
      );
    };

    const Controls = () => {
      const Position = () => {
        const Current = (position: number) => {
          return <label label={lengthStr(position)} />;
        };
        const Bar = (position: number) => {
          return (
            <slider
              hexpand
              className='position-slider'
              value={position}
              onDragged={({ value }) => (player.position = value * player.length)}
            />
          );
        };
        const Length = (length: number) => {
          return <label label={lengthStr(length)} />;
        };
        return (
          <box spacing={spacing.as((v) => v * 2)}>
            {bind(player, 'position').as((v) => [
              Current(player.length > 0 ? v / player.length : 0),
              Bar(v),
            ])}
            {Length(player.length)}
          </box>
        );
      };

      const PlayPause = () => {
        return (
          <XButton
            className='player-control'
            iconObj={{
              icon: bind(player, 'playbackStatus').as((pbs) => {
                if (pbs === Mpris.PlaybackStatus.PLAYING) return 'pause';
                return 'play_arrow';
              }),
              size: 1.25,
            }}
            onClick={() => player.play_pause()}
          />
        );
      };
      const Previous = () => {
        return (
          <XButton
            className='player-control'
            iconObj={{
              icon: 'skip_previous',
              size: 1.25,
            }}
            onClick={() => player.previous()}
          />
        );
      };
      const Next = () => {
        return (
          <XButton
            className='player-control'
            iconObj={{
              icon: 'skip_next',
              size: 1.25,
            }}
            onClick={() => player.next()}
          />
        );
      };
      const Shuffle = () => {
        return (
          <XButton
            className={bind(player, 'shuffleStatus').as((v) => `player-control ${v && 'active'}`)}
            iconObj={{
              icon: 'shuffle',
              size: 1.25,
            }}
            onClick={() => player.shuffle()}
          />
        );
      };
      const Loop = () => {
        return (
          <XButton
            className={bind(player, 'loopStatus').as(
              (v) => `player-control ${(v === Mpris.Loop.TRACK || Mpris.Loop.PLAYLIST) && 'active'}`
            )}
            iconObj={{
              icon: bind(player, 'loopStatus').as((v) => {
                if (v === Mpris.Loop.TRACK) return 'repeat_one';
                return 'repeat';
              }),
              size: 1.25,
            }}
            onClick={() => player.loop()}
          />
        );
      };

      return (
        <box vertical spacing={spacing}>
          <Position />
          <box spacing={spacing}>
            {player.shuffleStatus && Shuffle()}
            <box hexpand />
            {player.canGoPrevious && Previous()}
            <PlayPause />
            {player.canGoNext && Next()}
            <box hexpand />
            {player.loopStatus && Loop()}
          </box>
        </box>
      );
    };

    return (
      <box
        className='media-player'
        css={`
          background-image: url('${player.artUrl}');
        `}
        spacing={spacing}
        vertical
      >
        <box spacing={spacing}>
          {player.artUrl && <CoverArt />}
          <Metadata />
        </box>
        <Controls />
      </box>
    );
  };

  const title = () => {
    return <label label='Media' className='title' />;
  };
  return (
    <PanelSection monitorInt={monitorInt} section='Media' icon='music_note' title={title()}>
      <box vertical className='section-content' spacing={spacing}>
        {bind(mpris, 'players').as((v) => v.map(Player))}
      </box>
    </PanelSection>
  );
};
