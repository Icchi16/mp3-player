const songList = [
  {
    src: "./public/songs/song1.mp3",
    name: "Money",
    artist: "Lisa",
    img: "./public/img/song1.png",
  },
  {
    src: "./public/songs/song2.mp3",
    name: "Đông Rồi Tây",
    artist: "The Flob",
    img: "./public/img/song2.jpg",
  },
  {
    src: "./public/songs/song3.mp3",
    name: "Lộn Xộn II",
    artist: "Đen",
    img: "./public/img/song3.jpg",
  },
  {
    src: "./public/songs/song4.mp3",
    name: "As It Was",
    artist: "Suitx ft. Tars. ft. Booty Leak",
    img: "./public/img/song4.jpeg",
  },
];

const App = () => {
  const [songCount, setSongCount] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const audioPlayer = React.useRef();
  const songImg = React.useRef();
  const progressBar = React.useRef();
  const animationRef = React.useRef();

  React.useEffect(() => {
    renderProgressBar();
  }, [audioPlayer?.current?.readyState]);

  const handleChangeTime = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    renderProgressBar();
  };

  const renderProgressBar = () => {
    const duration = Math.floor(audioPlayer.current.duration);
    progressBar.current.max = duration;
    progressBar.current.style.setProperty(
      "--completed-time",
      `${(progressBar.current.value / duration) * 100}%`
    );
  };

  const prev = () => {
    songImg.current.classList.remove("playing");
    songCount == 0
      ? setSongCount(songList.length - 1)
      : setSongCount(songCount - 1);
    setIsPlaying(false);
    audioPlayer.current.onloadedmetadata = () => {
      audioPlayer.current.pause();
    };
  };

  const next = () => {
    songImg.current.classList.remove("playing");
    songCount == songList.length - 1
      ? setSongCount(0)
      : setSongCount(songCount + 1);
    setIsPlaying(false);
    audioPlayer.current.onloadedmetadata = () => {
      audioPlayer.current.pause();
    };
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }

    songImg.current.classList.toggle("playing");
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    renderProgressBar();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const playNext = () => {
    songCount == songList.length - 1
      ? setSongCount(0)
      : setSongCount(songCount + 1);
    audioPlayer.current.onloadedmetadata = () => {
      audioPlayer.current.play();
    };
  };

  const nowPlaying = songList[songCount];

  return (
    <div className="music-container">
      <audio
        ref={audioPlayer}
        src={nowPlaying.src}
        controls
        onEnded={playNext}
      ></audio>
      <div className="song-meta">
        <div className="song-img" ref={songImg}>
          <img src={nowPlaying.img} />
        </div>
        <div className="song-info">
          <div className="song-name">{nowPlaying.name}</div>
          <div className="song-artist">{nowPlaying.artist}</div>
        </div>
      </div>
      <div className="song-control">
        <div className="song-prev" onClick={prev}>
          <i className="bi bi-skip-start-btn-fill"></i>
        </div>
        <div className="song-playpause" onClick={togglePlayPause}>
          {isPlaying ? (
            <i className="bi bi-pause-btn-fill"></i>
          ) : (
            <i className="bi bi-play-btn-fill"></i>
          )}
        </div>
        <div className="song-next" onClick={next}>
          <i className="bi bi-skip-end-btn-fill"></i>
        </div>
      </div>
      <div className="song-progress">
        <input
          type="range"
          className="progress-bar"
          defaultValue="0"
          ref={progressBar}
          onChange={handleChangeTime}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);
