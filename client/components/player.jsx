import React from 'react';
import AudioPlayer from 'react-responsive-audio-player';

const Player = ({track,hidePlayer}) => (
  <div className="audio-player">
  {
    (!track)
    ? "Please wait ..."
    : <AudioPlayer autoplay playlist={[{url: track.url, displayText: track.title}]} hideBackSkip={true} style={{ position: 'fixed', bottom: 0 }}  onMediaEvent={{'ended': function(e) {hidePlayer()}}}/>
  }
  </div>
);

export default Player;
