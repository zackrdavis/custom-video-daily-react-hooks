import './Tile.css';
import { useState, useCallback } from 'react';
import { DailyVideo, useAppMessage } from '@daily-co/daily-react';
import Username from '../Username/Username';

export default function Tile({ id, isScreenShare, isLocal, isAlone }) {
  const [newestMessage, setNewestMessage] = useState({ name: '', msg: '' });

  useAppMessage({
    onAppMessage: useCallback((ev) => {
      console.log(ev.data);
      setNewestMessage({ name: ev.data.name, msg: ev.data.msg });
    }, []),
  });

  let moveCommand = '';

  if (newestMessage.msg === 'stop') {
    moveCommand = '';
  } else {
    moveCommand = newestMessage.msg;
  }

  let containerCssClasses = isScreenShare ? 'tile-screenshare' : 'tile-video';

  containerCssClasses += ` ${moveCommand}`;

  if (isLocal) {
    containerCssClasses += ' self-view';
    if (isAlone) {
      containerCssClasses += ' alone';
    }
  }
  return (
    <div className={containerCssClasses}>
      <DailyVideo automirror sessionId={id} type={isScreenShare ? 'screenVideo' : 'video'} />
      <Username id={id} isLocal={isLocal} />
    </div>
  );
}
