import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import PlaylistResult from "./Playlist"
import SpotifyWebApi from "spotify-web-api-node"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './MusicPlayer.css'

const spotifyApi = new SpotifyWebApi({
  clientId: "a6198c492eb94ba49a698075e6d4b604",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [userImage, setUserImage] = useState();

  // Hàm set bài hát được chọn để gửi đến Spotify Web Playback
  // Sử dụng khi chọn 1 bài hát để phát
  function chooseTrack(track) {
    setPlayingTrack(track);
  }

  // Dùng để thiết lập token để kết nối đến API của Spotify và lấy dữ liệu từ chúng.
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe().then((res) => {
      setUserImage(() => {
        return res.body.images[0].url;
      })
    })
  }, [accessToken]);
  // Biến lưu hàm tìm kiếm bài hát khi ấn vào nút Search
  // Được gọi thông qua sự kiện onClick
  const searchMusic = () => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map(track => {
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[0].url,
            duration: track.duration_ms
          }
        })
      );
    });

    return () => (cancel = true);
  }

  const goToTabSearch = () => {
    document.getElementsByClassName("nav-item-search")[0].classList.add("active-link");
    document.getElementsByClassName("nav-item-playlist")[0].classList.remove("active-link");
    document.getElementsByClassName("playlist")[0].classList.add("d-none");
    document.getElementsByClassName("search")[0].classList.remove("d-none");
    document.getElementsByClassName('playlist')[0].classList.remove('heightAnimation');
    document.getElementById('musicSearch').classList.remove('d-none');
    document.getElementById('searchMusicButton').classList.remove('d-none');
  }

  const goToTabPlaylist = () => {
    document.getElementsByClassName("nav-item-playlist")[0].classList.add("active-link");
    document.getElementsByClassName("nav-item-search")[0].classList.remove("active-link");
    document.getElementsByClassName("playlist")[0].classList.remove("d-none");
    document.getElementsByClassName("search")[0].classList.add("d-none");
    document.getElementsByClassName('playlist')[0].classList.add('heightAnimation');
    document.getElementById('musicSearch').classList.add('d-none');
    document.getElementById('searchMusicButton').classList.add('d-none');
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.getPlaylist('5WltjiYQ0BoDlVWSNAJJBZ').then(res => {
      if (cancel) return;
      setPlaylist(
        res.body.tracks.items.map(track => {
          return {
            artist: track.track.artists[0].name,
            title: track.track.name,
            uri: track.track.uri,
            albumUrl: track.track.album.images[0].url,
            duration: track.track.duration_ms
          }
        })
      );
    });

    return () => (cancel = true);
  }
  // Giao diện chính của Trang phát nhạc
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="navbar navbar-expand-sm navbar-dark bg-transparent">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <img src={userImage} alt="Avatar Logo" style={{ width: "60px", height: "60px", margin: "0 0 0 2.5rem" }} className="rounded-pill" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="mynavbar">
              <ul className="navbar-nav">
                <li className="nav-item me-5 nav-item-search active-link">
                  <p className="nav-link" style={{ cursor: "pointer", fontSize: "30px" }} onClick={goToTabSearch}>Tìm Kiếm</p>
                </li>
                <li className="nav-item nav-item-playlist">
                  <p className="nav-link" style={{ cursor: "pointer", fontSize: "30px" }} onClick={goToTabPlaylist}>Playlist</p>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="col-lg-5">
          <div className="d-flex justify-content-center searching-bar">
            <input type="search" className="form-control m-3" placeholder="Enter your music name" id="musicSearch" onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' ? document.getElementById('searchMusicButton').click() : null} />
            <button type={"submit"} className="btn btn-primary m-3" id="searchMusicButton" onClick={searchMusic}>Tìm Kiếm</button>
          </div>
          <div className="list-group search">
            {/* Sổ ra danh sách mà API tìm được và hiện lên màn hình */}
            {searchResults.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
                applyMusic={applyMusic(track.title, track.artist, track.duration, track.albumUrl)}
              />
            ))}
          </div>
          <div className="list-group playlist d-none">
            {playlist.map(track => (
              <PlaylistResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
                applyMusic={applyMusic(track.title, track.artist, track.duration, track.albumUrl)}
              />
            ))}
          </div>
        </div>
        <div className="col-lg-7">
          <div className="disc" style={{ background: "linear-gradient(120deg, #000000, #434343)" }}>
            <div className="border-disc">
              <div className="hole-on-disc"></div>
            </div>
          </div>
          <div className="music-name mt-2">
            <p style={{ opacity: '0' }}>Music Name</p>
          </div>
          <div className="artist mt-2">
            <p style={{ opacity: '0' }}>Artist</p>
          </div>
        </div>
        <div className="col-lg-12 mt-2 slide-cont">
          <div className="duration-slider" onClick={timeSliderClick(playingTrack?.duration)}>
            <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
          </div>
        </div>
        <div className="col-lg-12 d-flex justify-content-center position-relative" style={{ right: "20px" }}>
          <div className="slide-cont">
            <i className="bi bi-volume-up-fill" onClick={volumeClickHandler(".bi-volume-up-fill")}></i>
            <i className="bi bi-volume-down-fill d-none" onClick={volumeClickHandler(".bi-volume-down-fill")}></i>
            <i className="bi bi-volume-mute-fill d-none" onClick={volumeClickHandler(".bi-volume-mute-fill")}></i>
            <div className="slider">
              <input type="range" name="volumnSlider" id="volumnSlider" min="0" max="100" value="100" onChange={volumeChangeHandler()} />
              <progress min="0" max="100" value="100"></progress>
            </div>
            <div className="slider-value">100</div>
          </div>
          <button className="stop" onClick={playPauseStopHandler("stop", "play", "pause", playingTrack?.duration)}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 400 400">
              <g className="icon icon-stop">
                <circle className="icon-border" strokeMiterlimit="10" cx="200" cy="200" r="198"></circle>
                <rect className="icon-actual" x="120" y="120" strokeMiterlimit="10" width="160" height="160">
                </rect>
              </g>
            </svg>
          </button>
          <button className="play" onClick={playPauseStopHandler("play", "stop", "pause", playingTrack?.duration)}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 400 400">
              <g className="icon icon-play">
                <circle className="icon-border" strokeMiterlimit="10" cx="200" cy="200" r="198"></circle>
                <polygon className="icon-actual" strokeMiterlimit="10" points="280,200 160,280 160,120">
                </polygon>
              </g>
            </svg>
          </button>
          <button className="pause" onClick={playPauseStopHandler("pause", "play", "stop", playingTrack?.duration)}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 400 400">
              <g className="icon icon-pause">
                <circle className="icon-border" strokeMiterlimit="10" cx="200" cy="200" r="198"></circle>
                <rect className="icon-actual" x="130" y="120" strokeMiterlimit="10" width="60" height="160">
                </rect>
                <rect className="icon-actual" x="210" y="120" strokeMiterlimit="10" width="60" height="160">
                </rect>
              </g>
            </svg>
          </button>
          <button className="repeat" onClick={repeatClickHandler(playingTrack?.duration)}>
            <i className="bi bi-arrow-repeat"></i>
          </button>
          <div className="duration-value">
            <p className="opacity-0"> 00:00 </p>
            <p className="px-1 opacity-0"> / </p>
            <p className="full-time-music opacity-0"> 00:00 </p>
          </div>
        </div>
      </div>
    </div>
  );
}

let currentVolumeValue = 100;
let myInterval;
var count = 0;

// Hàm để thiết lập âm lượng khi kéo thanh input của input[type="range"]
// Được gọi thông qua sự kiện onChange
function volumeChangeHandler() {
  const changeValue = () => {
    var slider = document.querySelector('.slider input');
    slider.oninput = function () {
      slider.value = slider.value;
      spotifyApi.setVolume(slider.value).catch(() => {
        return null;
      });
      var progress = document.querySelector('.slider progress');
      progress.value = slider.value;
      var sliderValue = document.querySelector('.slider-value');
      sliderValue.innerHTML = slider.value;
      if (slider.value <= 50 && slider.value >= 1) {
        document.querySelector('.bi-volume-down-fill').classList.remove('d-none');
        document.querySelector('.bi-volume-up-fill').classList.add('d-none');
        document.querySelector('.bi-volume-mute-fill').classList.add('d-none');
      } else if (slider.value == 0) {
        document.querySelector('.bi-volume-down-fill').classList.add('d-none');
        document.querySelector('.bi-volume-up-fill').classList.add('d-none');
        document.querySelector('.bi-volume-mute-fill').classList.remove('d-none');
      } else {
        document.querySelector('.bi-volume-down-fill').classList.add('d-none');
        document.querySelector('.bi-volume-up-fill').classList.remove('d-none');
        document.querySelector('.bi-volume-mute-fill').classList.add('d-none');
      }
      currentVolumeValue = slider.value;
    };
  };
  return changeValue;
}

// Hàm thiết lập các chức năng khi ấn vào các nút play, pause, stop
// Được gọi thông qua sự kiện onClick
function playPauseStopHandler(className, className1, className2, duration) {
  const click = async (e) => {
    clearInterval(myInterval);
    document.getElementsByClassName(className)[0].classList.add("active");
    if (className === "play") {
      spotifyApi.play().then(() => {
        if (document.querySelector(".music-name p").classList.contains('fadeOut')) {
          document.querySelector(".music-name p").classList.remove('fadeOut');
          document.querySelector(".music-name p").classList.add('fadeIn');
        }
        if (document.querySelector(".artist p").classList.contains('fadeOut')) {
          document.querySelector(".artist p").classList.remove('fadeOut');
          document.querySelector(".artist p").classList.add('fadeIn');
        }
        if (document.getElementsByClassName('disc')[0].classList.contains('slideOutTop')
          || document.getElementsByClassName('disc')[0].classList.contains('allWaysOn')) {
          document.getElementsByClassName('disc')[0].classList.remove('slideOutTop');
          document.getElementsByClassName('disc')[0].classList.remove('allWaysOn');
        }
        if (document.getElementsByClassName('disc')[0].classList.contains('slideInTop')) {
          document.getElementsByClassName('disc')[0].classList.add('infiniteRotate');
        } else {
          document.getElementsByClassName('disc')[0].classList.add('slideInTop');
          setTimeout(() => {
            document.getElementsByClassName('disc')[0].classList.add('infiniteRotate');
          }, 680);
        }
      }).catch(() => {
        return null;
      });
      if (count < 1 && document.querySelector('._SliderRSWP span[role="slider"]') !== null && document.querySelector('._SliderRSWP span[role="slider"]').ariaValueNow !== '0') {
        myInterval = setInterval(() => {
          document.querySelector(".music-name p").classList.remove('fadeIn');
          document.querySelector(".artist p").classList.remove('fadeIn');
          document.querySelector(".music-name p").classList.add('fadeOut');
          document.querySelector(".artist p").classList.add('fadeOut');
          document.getElementsByClassName('disc')[0].classList.remove('infiniteRotate');
          document.getElementsByClassName('disc')[0].classList.remove('allWaysOn');
          document.getElementsByClassName('disc')[0].classList.remove('slideInTop');
          document.getElementsByClassName('disc')[0].classList.add('slideOutTop');
          document.querySelector(".play").classList.remove('active');
          document.querySelector(".stop").classList.add('active');
        }, duration - (duration * parseInt(document.querySelector('._SliderRSWP span[role="slider"]').ariaValueNow)) / 100);
      } else if (count == 1) {
        spotifyApi.setRepeat("track");
      }
    } else if (className === "pause") {
      clearInterval(myInterval);
      spotifyApi.pause().then(() => {
        if (!document.getElementsByClassName('disc')[0].classList.contains('slideOutTop')) {
          document.getElementsByClassName('disc')[0].classList.add('allWaysOn');
          document.getElementsByClassName('disc')[0].classList.remove('infiniteRotate');
        }
      }).catch(() => {
        return null;
      });
    } else if (className === "stop") {
      clearInterval(myInterval);
      spotifyApi.skipToNext().then(() => {
        if (document.querySelector(".music-name p").classList.contains('fadeIn')) {
          document.querySelector(".music-name p").classList.remove('fadeIn');
          document.querySelector(".music-name p").classList.add('fadeOut');
        }
        if (document.querySelector(".artist p").classList.contains('fadeIn')) {
          document.querySelector(".artist p").classList.remove('fadeIn');
          document.querySelector(".artist p").classList.add('fadeOut');
        }
        if (document.getElementsByClassName('disc')[0].classList.contains('slideInTop')
          || document.getElementsByClassName('disc')[0].classList.contains('infiniteRotate')
          || document.getElementsByClassName('disc')[0].classList.contains('allWaysOn')) {
          document.getElementsByClassName('disc')[0].classList.remove('infiniteRotate');
          document.getElementsByClassName('disc')[0].classList.remove('allWaysOn');
          document.getElementsByClassName('disc')[0].classList.remove('slideInTop');
          document.getElementsByClassName('disc')[0].classList.add('slideOutTop');
        }
      }).catch(() => {
        return null;
      });
      spotifyApi.setRepeat("off").catch(() => {
        return null;
      });
    }
    document.getElementsByClassName(className1)[0].classList.remove("active");
    document.getElementsByClassName(className2)[0].classList.remove("active");
  }
  return click;
}

// Hàm bắt sự kiện khi click trên thanh thời gian của bài hát.
// Nhằm thiết lập thời gian hiệu ứng biến mất sau khi bài hát đã phát xong
// Được gọi thông qua sự kiện onClick
function timeSliderClick(duration) {
  const click = () => {
    clearInterval(myInterval);
    setTimeout(() => {
      if (count < 1) {
        myInterval = setInterval(() => {
          document.querySelector(".music-name p").classList.remove('fadeIn');
          document.querySelector(".artist p").classList.remove('fadeIn');
          document.querySelector(".music-name p").classList.add('fadeOut');
          document.querySelector(".artist p").classList.add('fadeOut');
          document.getElementsByClassName('disc')[0].classList.remove('infiniteRotate');
          document.getElementsByClassName('disc')[0].classList.remove('allWaysOn');
          document.getElementsByClassName('disc')[0].classList.remove('slideInTop');
          document.getElementsByClassName('disc')[0].classList.add('slideOutTop');
          document.querySelector(".play").classList.remove('active');
          document.querySelector(".stop").classList.add('active');
        }, duration - (duration * parseInt(document.querySelector('._SliderRSWP span[role="slider"]').ariaValueNow)) / 100);
      }
    }, 200);
  }
  return click;
}

// Hàm bắt sự kiện khi bấm vào nút lặp lại
// Dùng để thiết lập chức năng lặp lại của API, và những hiệu ứng
// Được gọi thông sự kiện onCLick
function repeatClickHandler(duration) {
  const click = () => {
    if (count < 1) {
      clearInterval(myInterval);
      document.getElementsByClassName('repeat')[0].classList.add("active");
      spotifyApi.setRepeat("track").then(() => {
        count++;
      }).catch(() => {
        return null;
      });
    } else {
      document.getElementsByClassName('repeat')[0].classList.remove("active");
      clearInterval(myInterval);
      spotifyApi.setRepeat("off").then(() => {
        count = 0;
        setTimeout(() => {
          myInterval = setInterval(() => {
            document.querySelector(".music-name p").classList.remove('fadeIn');
            document.querySelector(".artist p").classList.remove('fadeIn');
            document.querySelector(".music-name p").classList.add('fadeOut');
            document.querySelector(".artist p").classList.add('fadeOut');
            document.getElementsByClassName('disc')[0].classList.remove('infiniteRotate');
            document.getElementsByClassName('disc')[0].classList.remove('allWaysOn');
            document.getElementsByClassName('disc')[0].classList.remove('slideInTop');
            document.getElementsByClassName('disc')[0].classList.add('slideOutTop');
            document.querySelector(".play").classList.remove('active');
            document.querySelector(".stop").classList.add('active');
          }, duration - (duration * parseInt(document.querySelector('._SliderRSWP span[role="slider"]').ariaValueNow)) / 100);
        }, 200);
      });
    }
  }
  return click;
}

// Hàm bắt sự kiện khi bấm icon âm lượng
// Dùng để tắt âm nhanh hoặc bật âm nhanh
// Được gọi thông qua sự kiện onClick
function volumeClickHandler(className) {
  const volumeClick = () => {
    var slider = document.querySelector('.slider input');
    if (className.startsWith(".bi-volume-mute-fill")) {
      slider.value = currentVolumeValue;
      spotifyApi.setVolume(slider.value).catch(() => {
        return null;
      });
    } else {
      slider.value = 0;
      spotifyApi.setVolume(slider.value).catch(() => {
        return null;
      });
    }
    var progress = document.querySelector('.slider progress');
    progress.value = slider.value;
    var sliderValue = document.querySelector('.slider-value');
    sliderValue.innerHTML = slider.value;
    if (slider.value <= 50 && slider.value >= 1) {
      document.querySelector('.bi-volume-down-fill').classList.remove('d-none');
      document.querySelector('.bi-volume-up-fill').classList.add('d-none');
      document.querySelector('.bi-volume-mute-fill').classList.add('d-none');
    } else if (slider.value == 0) {
      document.querySelector('.bi-volume-down-fill').classList.add('d-none');
      document.querySelector('.bi-volume-up-fill').classList.add('d-none');
      document.querySelector('.bi-volume-mute-fill').classList.remove('d-none');
    } else {
      document.querySelector('.bi-volume-down-fill').classList.add('d-none');
      document.querySelector('.bi-volume-up-fill').classList.remove('d-none');
      document.querySelector('.bi-volume-mute-fill').classList.add('d-none');
    }
  }
  return volumeClick;
}

// Hàm chuyển thiết lập data xuất hiện khi phát nhạc khi chọn 1 bài hát
// Được gọi thông qua sự kiện onClick
function applyMusic(musicName, artist, duration, image) {
  const apply = () => {
    clearInterval(myInterval);
    spotifyApi.setVolume(currentVolumeValue).catch(() => {
      return null;
    });
    document.getElementsByClassName("play")[0].classList.add("active");
    document.getElementsByClassName("pause")[0].classList.remove("active");
    document.getElementsByClassName("stop")[0].classList.remove("active");
    document.getElementsByClassName('disc')[0].classList.remove('slideOutTop');
    document.getElementsByClassName('disc')[0].classList.remove('allWaysOn');
    if (document.getElementsByClassName('disc')[0].classList.contains('slideInTop')) {
      document.getElementsByClassName('disc')[0].classList.add('infiniteRotate');
    } else {
      document.getElementsByClassName('disc')[0].classList.add('slideInTop');
      setTimeout(() => {
        document.getElementsByClassName('disc')[0].classList.add('infiniteRotate');
      }, 680);
    }
    let min = Math.floor((duration / 1000 / 60) << 0);
    let sec = Math.floor((duration / 1000) % 60);
    document.querySelector(".music-name p").innerHTML = musicName;
    document.querySelector(".artist p").innerHTML = artist;
    document.querySelector(".music-name p").classList.remove('fadeOut');
    document.querySelector(".artist p").classList.remove('fadeOut');
    document.querySelector(".music-name p").classList.add('fadeIn');
    document.querySelector("._ContentRSWP").classList.add('d-none');
    document.querySelector("._SliderRSWP").setAttribute('style', 'cursor: pointer');
    document.querySelector(".artist p").classList.add('fadeIn');
    document.querySelector(".duration-value .full-time-music").innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
    document.querySelector(".disc").setAttribute('style', 'background: url(' + image + ')!important');

    if (count < 1) {
      setTimeout(() => {
        myInterval = setInterval(() => {
          document.querySelector(".music-name p").classList.remove('fadeIn');
          document.querySelector(".artist p").classList.remove('fadeIn');
          document.querySelector(".music-name p").classList.add('fadeOut');
          document.querySelector(".artist p").classList.add('fadeOut');
          document.getElementsByClassName('disc')[0].classList.remove('infiniteRotate');
          document.getElementsByClassName('disc')[0].classList.remove('allWaysOn');
          document.getElementsByClassName('disc')[0].classList.remove('slideInTop');
          document.getElementsByClassName('disc')[0].classList.add('slideOutTop');
          document.querySelector(".play").classList.remove('active');
          document.querySelector(".stop").classList.add('active');
        }, duration - (duration * parseInt(document.querySelector('._SliderRSWP span[role="slider"]').ariaValueNow)) / 100);
      }, 2000);
    } //else if (count == 1) {
    //spotifyApi.setRepeat('track');
    //}
  }
  return apply;
}