import { useCallback, useEffect, useRef, useState } from "react";
import { formatTime } from "../../../utils/hooks/useFormat";
import axios from "axios";
import styles from "./AccountJoinStep1.module.css";

const AccountJoinStep1 = ({ onNext }) => {

    //state
    const [phone, setPhone] = useState("");
    const [certNumber, setCertNumber] = useState("");
    const [isSent, setIsSent] = useState(false);

    // 피드백 & 타이머 상태
    const [certFeedback, setCertFeedback] = useState("");
    const [timeLeft, setTimeLeft] = useState(180);
    const timeRef = useRef(null);

    // 타이머 함수
    const startTimer = useCallback(() => {
        if (timeRef.current) clearInterval(timeRef.current);
        setTimeLeft(180);
        timeRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timeRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // 컴포넌트 해제 시 타이머 정리
    useEffect(() => {
        return () => { if (timeRef.current) clearInterval(timeRef.current); };
    }, []);

    // 인증번호 발송
    const sendCert = useCallback(async () => {
        if (!phone) return;
        const cleanPhone = phone.replace(/-/g, "");
        const regex = /^010[1-9][0-9]{7}$/;

        if (!regex.test(cleanPhone)) {
            alert("번호를 정확히 입력해주세요");
            return;
        }

        // 재발송
        if (isSent) {
            if (!window.confirm("인증번호를 재전송 하시겠습니까?")) return;
        }

        try {
            await axios.post("/cert/sendPhone", null, {
                params: { phone: cleanPhone }
            });

            // 상태 업데이트
            setIsSent(true);
            setCertFeedback("");
            setCertNumber("");
            startTimer();

            alert(isSent ? "인증번호가 재전송되었습니다." : "인증번호가 발송되었습니다.");
        }
        catch (e) {
            if (e.response && e.response.status === 409) {
                alert("이미 가입된 번호입니다.\n로그인 페이지로 이동하거나 아이디 찾기를 이용해주세요.");
            }
            else {
                console.log(e)
                alert("메시지 발송 실패 (서버 연결 확인 필요)");
            }
        }
    }, [phone, isSent, startTimer]);

    // 인증번호 확인
    const checkCert = useCallback(async () => {
        if (timeLeft === 0) {
            setCertFeedback("입력 시간이 초과되었습니다. 재전송해주세요");
            return;
        }

        if (!certNumber) {
            setCertFeedback("인증번호를 입력해주세요");
            return;
        }

        try {
            const cleanPhone = phone.replace(/-/g, "");
            const response = await axios.post("/cert/check", {
                certTarget: cleanPhone,
                certNumber: certNumber
            });

            if (response.data === true) {
                setCertFeedback("");
                if (timeRef.current) clearInterval(timeRef.current);
                alert("본인인증이 완료되었습니다");
                onNext(cleanPhone);//다음단계로 정보를 넘겨줌
            }
            else {
                setCertFeedback("인증번호가 일치하지 않거나 만료되었습니다");
            }
        }
        catch (e) {
            alert("오류가 발생했습니다. 다시 시도해주세요");
        }
    }, [phone, certNumber, onNext, timeLeft]);

    // (render 부분만 수정)
    return (
        <div className={styles.formContainer}>
            {/* 1. 헤더 영역 */}
            <div className={styles.header}>
                <h3 className={styles.title}>휴대폰 인증</h3>
                <p className={styles.description}>
                    안전한 서비스 이용을 위해<br />
                    본인 명의의 휴대폰으로 인증해주세요.
                </p>
            </div>

            {/* 2. 휴대폰 번호 입력 */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>휴대폰 번호</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="01012345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        readOnly={isSent} // 발송 후 수정 불가
                        maxLength={11}
                    />
                    <button
                        type="button"
                        className={`${styles.button} ${isSent ? styles.resendButton : ''}`}
                        onClick={sendCert}
                    >
                        {isSent ? "재전송" : "인증요청"}
                    </button>
                </div>
                {/* 번호 재입력 링크 (발송 후에만 보임) */}
                {isSent && (
                    <div
                        className={styles.resetLink}
                        onClick={() => { setIsSent(false); setPhone(""); setCertNumber(""); }}
                    >
                        번호를 잘못 입력하셨나요?
                    </div>
                )}
            </div>

            {/* 3. 인증번호 입력 (발송 성공 시에만 보임) */}
            {isSent && (
                <div className={styles.inputGroup}>
                    <div style={{ position: 'relative' }}>
                        <label className={styles.label}>인증번호</label>
                        {/* 타이머 표시 */}
                        {timeLeft > 0 && (
                            <span className={styles.timerBadge}>
                                남은 시간 {formatTime(timeLeft)}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="인증번호 6자리"
                            value={certNumber}
                            onChange={(e) => setCertNumber(e.target.value)}
                            maxLength={6}
                        />
                        <button
                            type="button"
                            className={styles.button}
                            onClick={checkCert}
                        >
                            확인
                        </button>
                    </div>

                    {/* 피드백 메시지 */}
                    {certFeedback && (
                        <div className={`${styles.feedback} ${styles.error}`}>
                            {certFeedback}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountJoinStep1;