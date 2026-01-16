import styles from "./Header.module.css";
import { useAtomValue, useSetAtom } from "jotai"; // useAtom -> useAtomValue, useSetAtom으로 최적화
import { Link, useNavigate } from "react-router-dom";
import { adminState, clearLoginState, loginIdState, loginState } from "../utils/jotai"; // 경로 확인
import { useCallback } from "react";
import axios from "../utils/axios/customAxios";

// ✨ [1] 방금 만든 컴포넌트 불러오기
import SearchSection from "./SearchSection";

export default function Header() {

    // 이동 도구
    const navigate = useNavigate();

    const isLogin = useAtomValue(loginState);
    const isAdmin = useAtomValue(adminState);
    const loginId = useAtomValue(loginIdState);

    // 로그아웃 시 상태 초기화
    const clearLogin = useSetAtom(clearLoginState);

    // 로그아웃 로직
    const logout = useCallback(async (e) => {
        e.preventDefault();

        if (window.confirm("로그아웃 하시겠습니까?")) {
            try {
                // 1. 서버에 "나 갈게" 하고 말함.
                // (여기서 토큰이 만료됐다면 서버는 401 에러를 뱉습니다 -> 바로 catch로 이동)
                await axios.delete("/account/logout");
            }
            catch (err) {
                // 2. 서버가 "너 토큰 만료돼서 에러야!" 라고 해도
                // "알았어, 어차피 나갈 거야" 하고 쿨하게 무시합니다.
                console.warn("로그아웃 요청 에러(토큰 만료 등):", err);
            }
            finally {
                // 3. [중요] 성공하든 실패하든, 내 브라우저의 짐을 쌉니다.
                clearLogin(); // Jotai 비우기
                window.sessionStorage.clear(); // 스토리지 비우기
                delete axios.defaults.headers.common["Authorization"];
                navigate("/"); // 메인으로
            }
        }
    }, [clearLogin, navigate]);
    return (
        <header className="sticky-top bg-white border-bottom shadow-sm"> {/* stickey -> sticky 오타 수정 */}

            {/* 상단 : 로고 & 회원가입/로그인 버튼 (기존 유지) */}
            <div className="container py-2">
                <div className="d-flex justify-content-between align-items-center">

                    {/* 로고 */}
                    <Link to="/" className={`fs-3 ${styles.logo}`}>
                        SOSO
                    </Link>

                    {/* 🔹 로그인 상태에 따른 버튼 분기 처리 🔹 */}
                    <div className="d-flex gap-2 align-items-center">
                        {isLogin ? (
                            // ✅ 로그인 상태
                            <>
                                <span className="fw-bold me-2" style={{ fontSize: '14px' }}>
                                    {loginId}님
                                </span>
                                {isAdmin && (
                                    <Link to="/admin" className="btn btn-danger btn-sm rounded-pill fw-bold">
                                        관리자
                                    </Link>
                                )}
                                <Link to="/mypage" className="btn btn-outline-secondary btn-sm rounded-pill fw-bold border-0">
                                    마이페이지
                                </Link>
                                <button onClick={logout} className="btn btn-dark btn-sm rounded-pill px-3 fw-bold">
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            // ✅ 비로그인 상태
                            <>
                                <Link to="/account/login" className="btn btn-outline-light text-dark btn-sm rounded-pill fw-bold border-0">
                                    로그인
                                </Link>
                                <Link to="/account/agreement" className="btn btn-dark btn-sm rounded-pill px-3 fw-bold">
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ✨ [2] 하단 : 지역선택 & 검색창 (컴포넌트로 교체!) */}
            {/* 기존의 복잡한 div들을 다 지우고 이거 하나면 끝납니다. */}
            <SearchSection />

        </header>
    );
}