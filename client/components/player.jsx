import React from 'react';
import AudioPlayer from 'react-responsive-audio-player';

const Player = ({track}) => (
  <div className="audio-player">
  {
    (!track)
    ? "Please wait ..."
    : <AudioPlayer autoplay cycle={false} playlist={[{url: track.url, displayText: track.title}]} hideBackSkip={true} style={{ position: 'fixed', bottom: 0 }} />
  }
  </div>
);

export default Player;
