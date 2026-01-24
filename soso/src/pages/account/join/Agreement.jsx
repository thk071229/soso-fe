// 회원가입 약관동의
import { useNavigate } from "react-router-dom";
import styles from "./Agreement.module.css";
import { useCallback, useEffect, useState } from "react";

export default function Agreement() {
    // 이동 도구
    const navigate = useNavigate();

    // state
    const [allChecked, setAllChecked] = useState(false);//전체동의
    const [termsChecked, setTermschecked] = useState(false);// 이용약관
    const [privacyChecked, setPrivacyChecked] = useState(false);//개인정보
    const [thirdPartyChecked, setThirdPartyChecked] = useState(false);// 제3자 이용
    const [marketingChecked, setMarketingChecked] = useState(false); // 마케팅 수신

    const isEssentialValid = termsChecked && privacyChecked;

    // effect 
    useEffect(() => {// 전체동의 활성화
        if (termsChecked && privacyChecked && thirdPartyChecked && marketingChecked) {
            setAllChecked(true);
        }
        else {
            setAllChecked(false);
        }
    }, [termsChecked, privacyChecked, thirdPartyChecked, marketingChecked]);

    // 전체동의
    const handleAllCheck = useCallback((e) => {
        const checked = e.target.checked;
        setAllChecked(checked);
        setTermschecked(checked);
        setPrivacyChecked(checked);
        setThirdPartyChecked(checked);
        setMarketingChecked(checked);
    }, []);

    const handleNext = () => {
        if (!termsChecked || !privacyChecked) {
            alert("필수 약관에 모두 동의해주셔야 합니다");
            return;
        }
        navigate("/account/join", {
            state: {
                marketingAgree: marketingChecked ? 'Y' : 'N',
                thirdPartyAgree: thirdPartyChecked ? 'Y' : 'N'
            }
        });
    };


    //render
    return (<>

        <div className={styles.container}>
            <h2 className={styles.title}>서비스 이용 약관 동의</h2>
            <p className={styles.subtitle}>
                SOSO 소모임 커뮤니티 가입을 환영합니다<br />
                원활한 서비스 이용을 위해 약관에 동의해주세요.
            </p>

            <div className={styles.formBox}>
                {/* 전체 동의 영역 */}
                <div className={styles.allCheckContainer}>
                    <input
                        type="checkbox"
                        id="all-check"
                        checked={allChecked}
                        onChange={handleAllCheck}
                        className={styles.checkbox}
                    />
                    <label htmlFor="all-check" className={styles.allCheckLabel}>
                        <strong>약관 전체 동의하기</strong>
                    </label>
                </div>

                {/* 약관 1 */}
                <div className={styles.termGroup}>
                    <div className={styles.labelContainer}>
                        <input
                            type="checkbox"
                            id="terms-check"
                            checked={termsChecked}
                            onChange={(e) => setTermschecked(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="terms-check" className={styles.checkLabel}>
                            [필수] 서비스 이용약관 동의
                        </label>
                    </div>
                    <div className={styles.textarea}>
                        <strong>제 1 조 (목적)</strong><br />
                        본 약관은 SOSO(이하 "회사")가 제공하는 소모임 커뮤니티 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br /><br />

                        <strong>제 2 조 (용어의 정의)</strong><br />
                        1. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 이용할 수 있는 자를 말합니다.<br />
                        2. "소모임"이란 회원이 취미, 친목 등을 목적으로 개설한 온/오프라인 모임을 말합니다.<br /><br />

                        <strong>제 3 조 (회원의 의무)</strong><br />
                        회원은 관계법령, 본 약관의 규정, 이용안내 및 주의사항을 준수해야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.<br />
                        (욕설, 비방, 광고성 홍보 게시글 작성 시 제재될 수 있습니다.)
                    </div>
                </div>

                {/* 약관 2 */}
                <div className={styles.termGroup}>
                    <div className={styles.labelContainer}>
                        <input
                            type="checkbox"
                            id="privacy-check"
                            checked={privacyChecked}
                            onChange={(e) => setPrivacyChecked(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="privacy-check" className={styles.checkLabel}>
                            [필수] 개인정보 수집 및 이용 동의
                        </label>
                    </div>
                    <div className={styles.textarea}>
                        SOSO는 원활한 서비스 제공을 위해 아래와 같이 개인정보를 수집합니다.<br /><br />

                        <strong>1. 수집하는 개인정보 항목</strong><br />
                        - 필수항목: 아이디, 비밀번호, 닉네임, 이름, 휴대전화번호, 이메일<br />
                        - 선택항목: 프로필 사진, 거주 지역(동네), 관심사<br /><br />

                        <strong>2. 수집 및 이용 목적</strong><br />
                        - 회원 가입 의사 확인, 연령 확인, 불량회원의 부정이용 방지<br />
                        - 소모임 개설 및 참여 관리, 맞춤형 모임 추천<br /><br />

                        <strong>3. 보유 및 이용 기간</strong><br />
                        - 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사조사가 진행 중인 경우 해당 종료 시까지)
                    </div>
                </div>

                {/* 3. [선택] 개인정보 제3자 제공 동의 */}
                <div className={styles.termGroup}>
                    <div className={styles.labelContainer}>
                        <input
                            type="checkbox"
                            id="third-party-check"
                            checked={thirdPartyChecked}
                            onChange={(e) => setThirdPartyChecked(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="third-party-check" className={styles.checkLabel}>
                            <span className={styles.optional}>[선택]</span> 개인정보 제3자 제공 동의
                        </label>
                    </div>
                    <div className={styles.textarea}>
                        회사는 회원의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.<br /><br />
                        1. 이용자들이 사전에 동의한 경우<br />
                        2. 소모임 오프라인 행사 진행 시 제휴 업체(장소 대관, 티켓 발권 등)에 필요한 최소한의 정보 제공<br />
                        - 제공받는 자: SOSO 제휴 파트너사<br />
                        - 제공 항목: 이름, 휴대전화번호<br />
                        - 보유 기간: 행사 종료 후 3개월 이내 파기
                    </div>
                </div>

                {/* 4. [선택] 마케팅 정보 수신 동의 */}
                <div className={styles.termGroup}>
                    <div className={styles.labelContainer}>
                        <input
                            type="checkbox"
                            id="marketing-check"
                            checked={marketingChecked}
                            onChange={(e) => setMarketingChecked(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="marketing-check" className={styles.checkLabel}>
                            <span className={styles.optional}>[선택]</span> 마케팅 정보 수신 동의 (SNS, 이메일)
                        </label>
                    </div>
                    <div className={styles.textarea}>
                        동의하실 경우 SOSO에서 제공하는 새로운 소모임 추천, 이벤트 및 혜택 정보를 받아보실 수 있습니다.<br /><br />
                        1. 전송 방법: SMS, 이메일, 앱 푸시 알림<br />
                        2. 전송 내용: 신규 기능 안내, 할인 쿠폰, 지역 기반 추천 모임 알림<br />
                        * 동의를 거부하셔도 기본적인 서비스 이용에는 제한이 없습니다.
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className={styles.buttonGroup}>
                    <button className={styles.cancelButton} onClick={() => navigate("/")}>
                        취소
                    </button>

                    <button className={`${styles.nextButton} ${isEssentialValid ? styles.active : ''}`}
                        onClick={handleNext}
                        disabled={!isEssentialValid}>
                        다음
                    </button>
                </div>
            </div>
        </div>

    </>)
}