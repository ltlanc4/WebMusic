import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./Login"
import Dashboard from "./Dashboard"

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  // Kiểm tra code có bị null hay không để chuyển sang trang phát nhạc hoặc trở lại trang đăng nhập
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App
