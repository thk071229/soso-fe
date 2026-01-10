import styles from "./Header.module.css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Link, useNavigate } from "react-router-dom";
import { adminState, clearLoginState, loginIdState, loginState } from "../utils/jotai";
import { useCallback, useEffect } from "react";
import axios from "../utils/axios/customAxios";

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
                // 1. 서버에 요청 (성공하든 실패하든 일단 보냄)
                await axios.delete("/account/logout");
            }
            catch (err) {
                // 에러가 나도 콘솔에만 찍고, 로직은 계속 진행시켜야 함
                console.warn("로그아웃 요청 중 에러 발생 (무시하고 진행):", err);
            }
            finally {
                // ✅ 2. 무조건 실행되는 구역 (성공/실패 여부 상관없음)
                // 서버가 죽었어도 클라이언트에서는 로그아웃 처리를 해줘야 함
                clearLogin();
                delete axios.defaults.headers.common["Authorization"];
                navigate("/");
            }
        }
    }, [clearLogin, navigate]);

    return (<>
        <header className="stickey-top bg-white border-bottom shadow-sm">

            {/* 상단 : 로고 & 디자인 */}
            <div className="container py-2">
                <div className="d-flex justify-content-between align-items-center">

                    {/* 로고 */}
                    <Link to="/" className={`fs-3 ${styles.logo}`}>
                        SOSO
                    </Link>

                    {/* 🔹 로그인 상태에 따른 버튼 분기 처리 🔹 */}
                    <div className="d-flex gap-2 align-items-center">
                        {isLogin ? (
                            // ✅ 로그인 상태일 때 보일 화면
                            <>
                                <span className="fw-bold me-2" style={{ fontSize: '14px' }}>
                                    {loginId}님
                                </span>
                                {/* 관리자라면 관리자 버튼 표시 (선택사항) */}
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
                            // ✅ 로그아웃(비로그인) 상태일 때 보일 화면 (기존 코드)
                            <>
                                <Link to="/account/login" className="btn btn-outline-light text-dark btn-sm rounded-pill fw-bold border-0">
                                    로그인
                                </Link>
                                <Link to="/account/join" className="btn btn-dark btn-sm rounded-pill px-3 fw-bold">
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 하단 : 지역선택 & 검색창 (기존 동일) */}
            <div className="container pb-2">
                <div className="d-flex gap-2">
                    <div className="flex-shrink-0">
                        <button className={`btn rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${styles.regionBtn}`}>
                            <i className="bi bi-geo-alt-fill text-danger"></i>
                            <span className="fw-bold" style={{ fontSize: '14px' }}>수원시</span>
                            <i className="bi bi-chevron-down text-secondary" style={{ fontSize: '10px' }}></i>
                        </button>
                    </div>

                    <div className="flex-grow-1">
                        <div className={`d-flex align-items-center px-3 py-2 ${styles.searchBox}`}>
                            <i className="bi bi-search text-secondary me-2"></i>
                            <input type="text" className={styles.searchInput} placeholder="검색어를 입력하세요" />
                        </div>
                    </div>
                </div>
            </div>

        </header>
    </>)
}