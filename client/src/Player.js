import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
      styles={{
        activeColor: "none",
        trackArtistColor: "none",
        trackNameColor: "none",
        bgColor: "none",
        color: "transparent",
        height: "0px",
        altColor: "transparent",
        sliderHeight: "10px",
        sliderColor: "rgb(26, 91, 150)",
        errorColor: "transparent",
        sliderTrackBorderRadius: "10px",
      }}
    />
  );
}
