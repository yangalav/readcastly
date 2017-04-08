const AudioPlayer = require('react-responsive-audio-player');

const player = ({track}) => (
  !track ? <div className="audio-player">Please wait...</div> :
  <div className='audio-player'>
    <AudioPlayer playlist={[{url: track.url, displayText: track.title}]} hideBackSkip={true} style={{ position: 'fixed', bottom: 0 }} />
  </div>
);

window.player = player;