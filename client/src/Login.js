import React from 'react'
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './picture/Spotify_logo_without_text.svg.png';

const CLIENT_ID = "a6198c492eb94ba49a698075e6d4b604";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize?";
const RESPONSE_TYPE = "code";
const SCOPES = ["user-read-playback-state", "user-library-read", "user-library-modify", "streaming", "user-modify-playback-state", "playlist-read-collaborative",
                "playlist-modify-private", "playlist-read-private", "user-read-private", "user-read-email"];

// Đường dẫn tạo đăng nhập vào spotify để chuyển sang trang phát nhạc
const enpoint = `${AUTH_ENDPOINT}client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join("%20")}&show_dialog=true`;

export default function Login() {
  return (
    <div id="popup1" className="popup-container">
      <div className="popup-content">
        <img src={logo} />
        <a href={enpoint} className="popup-button btn">Đăng nhập với Spotify</a>
      </div>
    </div>
  );
}