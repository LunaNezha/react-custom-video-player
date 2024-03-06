import VideoPlayer from '@components/VideoPlayer';
import SampleVideo from '@assets/videos/sample-video.mp4';

function App() {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <VideoPlayer
        videoSrc={SampleVideo}
        className="mx-auto w-full xs:w-10/12 sm:w-9/12 md:w-10/12 lg:w-9/12 xl:w-8/12"
      />
    </div>
  );
}

export default App;
