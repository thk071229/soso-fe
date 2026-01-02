import styles from "./Header.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css'; // 아이콘 가져오기
import { Link } from "react-router-dom";

export default function Header(){

    return (<>
        <header className="stickey-top bg-white border-bottom shadow-sm">

            {/* 상단 : 로고 & 디자인 */}
            <div className="container py-2">
                <div className="d-flex justify-content-between align-items-center">

                    {/* 로고 */}
                    <Link to="/" className={`fs-3 ${styles.logo}`}>
                        SOSO
                    </Link>

                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-light text-dark btn-sm rounded-pill fw-bold border-0">
                            로그인
                        </button>
                        <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold">
                            회원가입
                        </button>
                    </div>
                </div>
            </div>

            {/* 하단 : 지역선택 & 검색창 */}
            <div className="container pb-2">
                <div className="d-flex gap-2">

                    {/* 지역 선택 버튼 */}
                    <div className="flex-shrink-0">
                        <button className={`btn rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${styles.regionBtn}`}>
                            <i className="bi bi-geo-alt-fill text-danger"></i>
                            <span className="fw-bold" style={{fontSize : '14px'}}>수원시</span>
                            <i className="bi bi-chevron-down text-secondary" style={{fontSize : '10px'}}></i>
                        </button>
                    </div>

                    {/* 검색창 */}
                    <div className="flex-grow-1">
                        <div className={`d-flex align-items-center px-3 py-2 ${styles.searchBox}`}>
                            <i className="bi bi-search text-secondary me-2"></i>
                            <input type="text" className={styles.searchInput} placeholder="검색어를 입력하세요"/>
                        </div>
                    </div>

                </div>
            </div>

        </header>
    </>)
}