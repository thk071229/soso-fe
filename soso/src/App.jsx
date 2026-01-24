import { BrowserRouter } from "react-router-dom"
import Content from "./Content"
import Footer from "./component/common/Footer"
import Header from "./component/common/Header"

// Jotai 개발자 도구 설정
import "jotai-devtools/styles.css"; // 디자인
import { DevTools } from "jotai-devtools"; // 도구
import { Provider, useAtom, useAtomValue, useSetAtom } from "jotai"
import { accessTokenState, adminState, clearLoginState, loginCompleteState, loginIdState, loginLevelState, loginState } from "./utils/jotai"
import { useEffect } from "react"
import axios from "./utils/axios/customAxios";

function App() {

  // jotai state
  const [loginId, setLoginId] = useAtom(loginIdState);
  const [loginLevel, setLoginLevel] = useAtom(loginLevelState);
  const [accessToken, setAccessToken] = useAtom(accessTokenState);
  const [logincomplete, setLoginComplete] = useAtom(loginCompleteState);

  const isLogin = useAtomValue(loginState);
  const isAdmin = useAtomValue(adminState);
  const clearLogin = useSetAtom(clearLoginState);

  // [추가된 부분 1] 앱 실행 시 딱 한 번 실행! (새로고침 시 복구 로직)
  useEffect(() => {
    // 1. 세션스토리지 확인
    const savedToken = window.sessionStorage.getItem("accessToken");
    const savedId = window.sessionStorage.getItem("loginId");

    if (savedToken && savedToken.length > 0) {
      // 2. 스토리지에 정보가 있으면 Jotai에 집어넣기 (복구)
      setAccessToken(savedToken);
      if (savedId) setLoginId(savedId);

      // 3. [중요] 토큰으로 '등급(Level)' 등 상세정보 다시 받아오기
      // (스토리지에는 보안상 레벨 같은 건 잘 안 넣으므로 서버에 물어봄)
      axios.get("/account/profile", {
        headers: { Authorization: "Bearer " + savedToken }
      })
        .then(response => {
          // 성공 시 레벨 정보 복구
          setLoginLevel(response.data.memberLevel);
          // 닉네임 등 다른 정보가 있다면 여기서 set
        })
        .catch(err => {
          // 토큰이 만료되었거나 에러가 나면 -> 강제 로그아웃
          console.error("로그인 정보 복구 실패", err);
          setAccessToken("");
          window.sessionStorage.clear();
        })
        .finally(() => {
          // 로딩 끝
          setLoginComplete(true);
        });
    } else {
      // 토큰이 없으면 그냥 로딩 끝
      setLoginComplete(true);
    }
  }, []); // 의존성 배열 [] : 앱 켜질 때 1회만 실행


  // [기존 코드 유지] accessToken이 변경될 때마다 헤더 설정
  useEffect(() => {
    if (accessToken && accessToken.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  return (
    <>
      <Provider>
        <BrowserRouter>
          {/* Jotai 개발자 도구 */}
          {import.meta.env.DEV && <DevTools />}
          <Header />
          <div className="container-fluid my-5 pt-5">
            <Content />

            <hr />
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
