import React, { useState, useCallback, useEffect } from 'react';
import {
  useParticipantIds,
  useScreenShare,
  useDailyEvent,
  DailyAudio,
  useDaily,
} from '@daily-co/daily-react';

import './Call.css';
import Tile from '../Tile/Tile';
import UserMediaError from '../UserMediaError/UserMediaError';

export default function Call({ newestMessage }) {
  const callObject = useDaily();

  const [commands, setCommands] = useState(undefined);

  useEffect(() => {
    const participants = {};
    Object.entries(callObject.participants()).forEach((e) => {
      participants[e[1].user_name] = e[1].session_id;
    });

    const newCommands = { ...commands };

    // loop through all participants
    Object.entries(participants).forEach(([name, id]) => {
      // initialize a Set of commands for each user ID
      if (!newCommands[id]) {
        newCommands[id] = new Set();
      }

      // if the new message addresses them by name
      if (newestMessage.msg.startsWith(name)) {
        const possibleCommand = newestMessage.msg.replace(name, '').trim();

        if (possibleCommand === 'stop') {
          newCommands[id] = new Set();
        }

        if (possibleCommand === 'spin') {
          newCommands[id].add('spin');
        }

        if (possibleCommand === 'bounce') {
          newCommands[id].add('bounce');
        }
      }
    });

    setCommands(newCommands);
  }, [newestMessage]);

  /* If a participant runs into a getUserMedia() error, we need to warn them. */
  const [getUserMediaError, setGetUserMediaError] = useState(false);

  /* We can use the useDailyEvent() hook to listen for daily-js events. Here's a full list
   * of all events: https://docs.daily.co/reference/daily-js/events */
  useDailyEvent(
    'camera-error',
    useCallback(() => {
      setGetUserMediaError(true);
    }, []),
  );

  /* This is for displaying remote participants: this includes other humans, but also screen shares. */
  const { screens } = useScreenShare();
  const participantIds = useParticipantIds({ sort: 'joined_at' });

  const renderCallScreen = () => (
    <div className={`${screens.length > 0 ? 'is-screenshare' : 'call'}`}>
      {/* Videos of participants and screen shares */}
      {participantIds.map((id) => (
        <Tile
          key={id}
          id={id}
          commands={commands && commands[id] ? Array.from(commands[id]) : []}
        />
      ))}
      {screens.map((screen) => (
        <Tile key={screen.screenId} id={screen.session_id} isScreenShare />
      ))}

      <DailyAudio />
    </div>
  );

  return getUserMediaError ? <UserMediaError /> : renderCallScreen();
}
