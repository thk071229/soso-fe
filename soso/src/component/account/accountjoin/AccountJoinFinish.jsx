import { useNavigate } from "react-router-dom";
import styles from "./AccountJoinFinish.module.css";
import { FaCircleCheck } from "react-icons/fa6";

export default function AccountJoinFinish() {
    // 이동 도구
    const navigate = useNavigate();

    //render
    return (<>
        <div className={styles.container}>
            <div className={styles.card}>
                {/* 1. 성공 아이콘 */}
                <div className={styles.iconWrapper}>
                    <FaCircleCheck className={styles.icon} />
                </div>

                {/* 2. 환영 메시지 */}
                <h2 className={styles.title}>회원가입 완료!</h2>

                <p className={styles.description}>
                    <span className={styles.highlight}>SOSO</span>의 회원이 되신 것을 환영합니다.<br />
                    이제 다양한 소모임과 함께 취미를 즐겨보세요!
                </p>

                {/* 3. 로그인 이동 버튼 */}
                <button
                    className={styles.btn}
                    onClick={() => navigate("/login")} // 로그인 페이지 경로에 맞게 수정
                >
                    로그인 하러가기
                </button>
            </div>
        </div>
    </>)
}