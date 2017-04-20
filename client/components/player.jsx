import React from 'react';
import AudioPlayer from 'react-responsive-audio-player';

const Player = ({track}) => (
  <div className="audio-player">
  {
    (track.url === null)
    ? <AudioPlayer autoplay cycle={false} playlist={[{url: 'https://s3.amazonaws.com/readcastly-user-files/readcastly-welcome-part01.mp3', displayText: 'Welcome to ReadCast.ly!'}, {url: 'https://s3.amazonaws.com/readcastly-user-files/readcastly-welcome-part02.mp3', displayText: 'Welcome to ReadCast.ly (continued)'}]} hideBackSkip={true} style={{ position: 'fixed', bottom: 0 }} />

    : <AudioPlayer playlist={[{url: track.url, displayText: track.title}]} hideBackSkip={true} cycle={false} style={{ position: 'fixed', bottom: 0 }} />
  }
  </div>
);

export default Player;

// documentation on options: https://www.npmjs.com/package/react-responsive-audio-player
  // autoplay: a boolean value (true/false) that if true will cause the player to begin automatically once mounted. false by default.
  //
  // cycle: a boolean value that if true continues playing from the beginning after the playlist has completed. true by default.
  //
  // stayOnBackSkipThreshold: a number value that represents the number of seconds of progress after which pressing the back button will simply restart the current track. 5 by default.
  //
  // style: a React style object which is applied to the outermost div in the component. undefined by default.
  //
  // onMediaEvent: An object where the keys are media event types and the values are callback functions. undefined by default.
