import './Tile.css';
import { useState, useCallback } from 'react';
import { DailyVideo, useAppMessage } from '@daily-co/daily-react';
import Username from '../Username/Username';

export default function Tile({ id, isScreenShare, isLocal, isAlone }) {
  const [newestMessage, setNewestMessage] = useState('');

  useAppMessage({
    onAppMessage: useCallback((ev) => {
      setNewestMessage(ev.data.msg);
    }, []),
  });

  let containerCssClasses = isScreenShare ? 'tile-screenshare' : 'tile-video';

  if (newestMessage === 'spin') {
    containerCssClasses += ' spin';
  }

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
