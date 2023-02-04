import './Tile.css';
import { DailyVideo } from '@daily-co/daily-react';
import Username from '../Username/Username';

export default function Tile({ id, isScreenShare, isLocal, isAlone, commands }) {
  let containerCssClasses = isScreenShare ? 'tile-screenshare' : 'tile-video';

  if (isLocal) {
    containerCssClasses += ' self-view';
    if (isAlone) {
      containerCssClasses += ' alone';
    }
  }

  // add user movement commands as classes
  containerCssClasses += ` ${commands.join(' ')}`;

  return (
    <div className={containerCssClasses}>
      <DailyVideo automirror sessionId={id} type={isScreenShare ? 'screenVideo' : 'video'} />
      <Username id={id} isLocal={isLocal} />
    </div>
  );
}
