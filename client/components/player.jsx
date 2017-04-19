import React from 'react';
import AudioPlayer from 'react-responsive-audio-player';

const Player = ({track}) => (
  <div className="audio-player">
  {
    (track.url === null)
    ? <AudioPlayer playlist={[{url: 'https://s3.amazonaws.com/readcastly-user-files/king-now-is-the-perfect-1303-joanna.mp3', displayText: 'KING: Now is the perfect time to discuss how and why Bernie Sanders could\'ve beaten Donald Trump'}, {url: 'https://s3.amazonaws.com/readcastly-user-files/the-white-houses-misleading-statements-1304-salli.mp3', displayText: 'The White House’s misleading statements about Trump’s ‘armada’ heading to North Korea'}]} hideBackSkip={true} style={{ position: 'fixed', bottom: 0 }} />

    : <AudioPlayer playlist={[{url: track.url, displayText: track.title}]} hideBackSkip={true} style={{ position: 'fixed', bottom: 0 }} />
  }
  </div>
);

export default Player;
