import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const VideoPlayer = forwardRef(function VideoPlayer(
  { videoId, playing, currentTime },
  ref,
) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Track which video is currently loaded
  const loadedVideoIdRef = useRef("");

  // Prevent old playback state from being applied
  // immediately after changing video
  const videoChangingRef = useRef(false);

  useImperativeHandle(ref, () => ({
    getCurrentTime() {
      try {
        const player = playerRef.current;

        if (player && typeof player.getCurrentTime === "function") {
          return player.getCurrentTime();
        }
      } catch (error) {
        console.error("Could not get YouTube time:", error);
      }

      return 0;
    },
  }));

  /*
   * Create YouTube player
   */
  useEffect(() => {
    if (!videoId) return;

    function createPlayer() {
      if (!window.YT || !window.YT.Player) return;
      if (!containerRef.current) return;

      /*
       * Player already exists.
       * Load the NEW video.
       */
      if (playerRef.current) {
        try {
          videoChangingRef.current = true;

          loadedVideoIdRef.current = videoId;

          playerRef.current.loadVideoById({
            videoId: videoId,
            startSeconds: 0,
          });

          console.log("NEW VIDEO LOADED:", videoId);

          /*
           * Give YouTube a little time to load
           * before allowing normal playback sync.
           */
          setTimeout(() => {
            videoChangingRef.current = false;
          }, 500);
        } catch (error) {
          console.error("Video load error:", error);
        }

        return;
      }

      /*
       * Create player for the first time
       */
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,

        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
        },

        events: {
          onReady: () => {
            loadedVideoIdRef.current = videoId;

            console.log("YouTube player ready:", videoId);
          },

          onError: (event) => {
            console.error("YouTube error:", event.data);
          },
        },
      });
    }

    /*
     * YouTube API already loaded
     */
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    /*
     * YouTube API not loaded yet
     */
    const oldCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      oldCallback?.();
      createPlayer();
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");

      script.src = "https://www.youtube.com/iframe_api";

      document.body.appendChild(script);
    }
  }, [videoId]);

  /*
   * Playback synchronization
   */
  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    if (
      typeof player.getCurrentTime !== "function" ||
      typeof player.seekTo !== "function"
    ) {
      return;
    }

    /*
     * IMPORTANT:
     * Don't apply old playback state while
     * a completely new video is loading.
     */
    if (videoChangingRef.current) {
      return;
    }

    /*
     * Don't sync until the correct video is loaded.
     */
    if (
      videoId &&
      loadedVideoIdRef.current &&
      loadedVideoIdRef.current !== videoId
    ) {
      return;
    }

    try {
      const actualTime = player.getCurrentTime();

      /*
       * Only seek when there is a meaningful
       * difference.
       */
      if (
        Number.isFinite(currentTime) &&
        Math.abs(actualTime - currentTime) > 2
      ) {
        console.log("SYNC SEEK:", actualTime, "→", currentTime);

        player.seekTo(currentTime, true);
      }

      /*
       * Play / Pause
       */
      if (playing) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    } catch (error) {
      console.error("Playback sync error:", error);
    }
  }, [playing, currentTime, videoId]);

  return (
    <div className="video-wrap">
      {videoId ? (
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <div className="video-placeholder">
          Paste a YouTube video ID or URL to start the room.
        </div>
      )}
    </div>
  );
});

export default VideoPlayer;
