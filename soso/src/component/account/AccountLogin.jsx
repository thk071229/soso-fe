import { useAtom, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { accessTokenState, loginIdState, loginLevelState, refreshTokenState } from "../../utils/jotai";
import { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axios/customAxios";
import styles from "./AccountLogin.module.css";
import { FaLock, FaUser } from "react-icons/fa";


export default function AccountLogin() {

    const navigate = useNavigate();

    // jotai state
    const setLoginId = useSetAtom(loginIdState);
    const setLoginLevel = useSetAtom(loginLevelState);
    const setAccessToken = useSetAtom(accessTokenState);
    const setRefreshToken = useSetAtom(refreshTokenState);

    // 로그인 상태 확인용(값만 필요)
    const [loginId] = useAtom(loginIdState);

    // state
    const [account, setAccount] = useState({ accountId: "", accountPw: "" });
    const [isLoginFail, setIsLoginFail] = useState(false); // 로그인 실패 여부

    // usecallback
    const changeStrValue = useCallback(e => {
        const { name, value } = e.target;
        setAccount(prev => ({ ...prev, [name]: value }));
        if (isLoginFail) setIsLoginFail(false);
    }, [isLoginFail]);

    // 로그인 요청
    const sendLogin = useCallback(async () => {
        if (!account.accountId || !account.accountPw) return;
        
        try {
            const { data } = await axios.post("/account/login", account);
            // 상태 업데이트
            setLoginId(data.loginId);
            setLoginLevel(data.loginLevel);
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
        }
        catch (e) {
            setIsLoginFail(true); 
        }
    }, [account, setAccessToken, setLoginId, setLoginLevel, setRefreshToken]);

    // 엔터키 처리
    const handleEnter = (e)=>{
        if(e.key === 'Enter') sendLogin();
    };

    if(loginId) return null;

    // render
    return (<>
       <div className={styles.container}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>로그인</h2>
                
                {/* 아이디 입력 */}
                <div className={styles.inputGroup}>
                    <FaUser className={styles.icon} />
                    <input 
                        type="text" 
                        name="accountId"
                        className={styles.input}
                        placeholder="아이디"
                        value={account.accountId}
                        onChange={changeStrValue}
                        onKeyUp={handleEnter}
                        autoFocus
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div className={styles.inputGroup}>
                    <FaLock className={styles.icon} />
                    <input 
                        type="password" 
                        name="accountPw" 
                        className={styles.input}
                        placeholder="비밀번호"
                        value={account.accountPw}
                        onChange={changeStrValue}
                        onKeyUp={handleEnter}
                    />
                </div>

                {/* 에러 메시지 */}
                {isLoginFail && (
                    <div className={styles.errorMessage}>
                        아이디 또는 비밀번호가 일치하지 않습니다.
                    </div>
                )}

                {/* 로그인 버튼 */}
                <button className={styles.loginBtn} onClick={sendLogin}>
                    로그인
                </button>

                {/* 추가 메뉴 (회원가입, 찾기) */}
                <div className={styles.links}>
                    <span onClick={() => navigate("/account/join")}>회원가입</span>
                    <span className={styles.divider}>|</span>
                    <span onClick={() => alert("준비중입니다")}>아이디/비밀번호 찾기</span>
                </div>
            </div>
        </div>
    </>)
}