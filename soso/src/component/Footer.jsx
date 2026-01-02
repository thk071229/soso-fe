import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';


export default function Footer() {

    return (<>
        <footer className={styles.footerContainer}>
            <div className="container">
                <div className="row g-4">

                    {/* 서비스 소개 및 SNS */}
                    <div className="col-lg-4 col-md-6">
                        <Link to="/" className={styles.footerLogo}>SOSO</Link>
                        <p className="mb-4">
                            취향이 맞는 사람들과의 따뜻한 만남.<br />
                            소소한 일상 속 특별한 즐거움을 찾아보세요.
                        </p>
                        <div className="d-flex">
                            <Link to="#" className={styles.snsIcon}><i className="bi bi-instagram"></i></Link>
                            <Link to="#" className={styles.snsIcon}><i className="bi bi-facebook"></i></Link>
                            <Link to="#" className={styles.snsIcon}><i className="bi bi-youtube"></i></Link>
                        </div>
                    </div>

                    {/* 회사 정보 */}
                    <div className="col-lg-2 col-md-3 col-6"> {/* 반응형: PC에선 2칸, 태블릿 3칸, 모바일 6칸 */}
                        <h5 className={styles.footerTitle}>소소 정보</h5>
                        <ul className={styles.footerList}>
                            <li><Link to="#" className={styles.footerLink}>서비스 소개</Link></li>
                            <li><Link to="#" className={styles.footerLink}>인재 채용</Link></li>
                            <li><Link to="#" className={styles.footerLink}>제휴 문의</Link></li>
                        </ul>
                    </div>

                    {/* 고객지원 */}
                    <div className="col-lg-2 col-md-3 col-6">
                        <h5 className={styles.footerTitle}>고객 지원</h5>
                        <ul className={styles.footerList}>
                            <li><Link to="#" className={styles.footerLink}>공지사항</Link></li>
                            <li><Link to="#" className={styles.footerLink}>자주 묻는 질문</Link></li>
                            <li><Link to="#" className={styles.footerLink}>1:1 문의</Link></li>
                        </ul>
                    </div>

                    {/* 약관 및 정책*/}
                    <div className="col-lg-4 col-md-12">
                        <h5 className={styles.footerTitle}>정책 및 약관</h5>
                        <ul className={styles.footerList}>
                            <li><Link to="#" className={styles.footerLink}>이용약관</Link></li>
                            <li><Link to="#" className={styles.footerLink}><strong>개인정보처리방침</strong></Link></li>
                            <li><Link to="#" className={styles.footerLink}>위치기반서비스 이용약관</Link></li>
                        </ul>
                    </div>

                </div>

                {/* 하단 저작권 */}
                <div className={styles.copyright}>
                    <p className="mb-0">© 2024 SOSO. All rights reserved.</p>
                </div>
                
            </div>
        </footer>
    </>)
}