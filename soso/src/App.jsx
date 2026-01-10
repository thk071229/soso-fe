import { BrowserRouter } from "react-router-dom"
import Content from "./component/Content"
import Footer from "./component/Footer"
import Header from "./component/Header"

// Jotai 개발자 도구 설정
import "jotai-devtools/styles.css"; // 디자인
import { DevTools } from "jotai-devtools"; // 도구
import { Provider, useAtom, useAtomValue, useSetAtom } from "jotai"
import { accessTokenState, adminState, clearLoginState, loginCompleteState, loginIdState, loginLevelState, loginState } from "./utils/jotai"
import { useEffect } from "react"
import axios from "./utils/axios/customAxios";

function App() {

  // jotai state
  const [loginId, setloginId] = useAtom(loginIdState);
  const [loginLevel, setLoginLevel] = useAtom(loginLevelState);
  const [accessToken, setAccessToken] = useAtom(accessTokenState);
  const [logincomplete, setLoginComplete] = useAtom(loginCompleteState);
  const isLogin = useAtomValue(loginState);
  const isAdmin = useAtomValue(adminState);
  const clearLogin = useSetAtom(clearLoginState);

  // 앱이 처음 켜질 때(새로고침 포함)
  useEffect(()=>{
    if(accessToken && accessToken.length > 0){
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    else{
      // 토큰이 없으면 헤더 제거
      delete  axios.defaults.headers.common["Authorization"];
    }
    // 로그인 여부 판정 완료(화면 깜빡임 방지용)
    setLoginComplete(true);
  },[accessToken, setLoginComplete]);

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
