import { cn } from '@utils/classnames';
import { useEffect, useRef, useState } from 'react';

type Props = {
  videoSrc?: string;
  className?: string;
};

const VideoPlayer = (props: Props) => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoSrc, className } = props;

  const handleTogglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);

    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleToggleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }

      setIsFullScreen(!isFullScreen);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      window.requestAnimationFrame(handleTimeUpdate);
    }
  };

  const handleDurationChange = () => {
    videoRef.current && setDuration(videoRef.current.duration);
  };

  const handleProgressChange = (event: any) => {
    console.log(event);

    if (videoRef.current) {
      const newTime = event.target.value;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number = 0) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  useEffect(() => {
    const handleContextMenu = (e: any) => {
      e.preventDefault();
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener('contextmenu', handleContextMenu);

    return () => {
      videoElement?.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div
      className={cn(
        className,
        'group relative z-10 flex overflow-hidden shadow-2xl transition-all duration-200 ease-in rounded-lg'
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* video */}
      <video
        id="videoPlayer"
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        controlsList="nodownload"
      >
        <source src={videoSrc} type="video/mp4" />
        <track
          src="captions_en.vtt"
          kind="captions"
          srcLang="en"
          label="english_captions"
        ></track>
        Your browser does not support the video tag.
      </video>

      {/* overlay - controls */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 top-auto flex w-full flex-nowrap items-end bg-white-50 p-2 transition-all duration-200 ease-in sm:px-4 sm:py-2 md:px-6 md:py-3',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex w-full items-center gap-2 sm:gap-3 md:gap-5">
          <div className="flex flex-1 items-center gap-2 sm:gap-3 md:gap-4">
            {/* play/pause */}
            <button
              className="rounded-full bg-science-blue-800 p-2.5 text-xs text-white-50 transition-all duration-150 ease-in hover:bg-science-blue-900 sm:p-3 sm:text-sm"
              onClick={handleTogglePlayPause}
              title="Play/Pause"
            >
              <i className={isPlaying ? 'fi fi-sr-pause' : 'fi fi-sr-play'}></i>
            </button>

            {/* duration control */}
            <div className="flex flex-1 items-center gap-1 font-montserrat text-xs font-medium text-white-200 sm:gap-2 sm:text-sm md:text-base">
              <span
                slot="start"
                className="font-montserrat text-xs font-medium text-woodsmoke-950 sm:text-sm"
              >
                {formatTime(videoRef.current?.currentTime || 0)}
              </span>

              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                step={0.01}
                onChange={handleProgressChange}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-woodsmoke-950/20 "
              />

              <span
                slot="end"
                className="font-montserrat text-xs font-medium text-woodsmoke-950 sm:text-sm"
              >
                {formatTime(videoRef.current?.duration || 0)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-8">
            {/* mute/unmute */}
            <button
              className="rounded-full text-sm text-science-blue-800 transition-all duration-150 ease-in hover:text-science-blue-900 md:text-base"
              onClick={handleToggleMute}
              title="Mute/Unmute"
            >
              <i
                className={isMuted ? 'fi fi-sr-volume-mute' : 'fi fi-sr-volume'}
              ></i>
            </button>

            {/* fullscreen */}
            <button
              className="rounded-full text-sm text-science-blue-800 transition-all duration-150 ease-in hover:text-science-blue-900 md:text-base"
              onClick={handleToggleFullScreen}
              title="Fullscreen"
            >
              <i className="fi fi-sr-expand"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
