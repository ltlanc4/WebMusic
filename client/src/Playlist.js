import React from "react"
import './MusicPlayer.css'
export default function Playlist({ track, chooseTrack, applyMusic }) {
  function handlePlay() {
    chooseTrack(track);
  }
  let min = Math.floor((track.duration / 1000 / 60) << 0);
  let sec = Math.floor((track.duration / 1000) % 60);
  return (
    <div onClick={handlePlay}>
      <div className="list-group-items text-white d-flex align-items-center p-3" key={track} onClick={applyMusic}>
        <img src={track.albumUrl} width="100px" />
        <div className="music-content">
          <p>{track.title}</p>
          <p>{track.artist}</p>
        </div>
        <p className="duration">{(min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec)}</p>
      </div>
    </div>
  );
}