import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../common/stepper/Stepper";
import AccountJoinStep1 from "./AccountJoinStep1";
import AccountJoinStep2 from "./AccountJoinStep2";
import styles from "./AccountJoin.module.css";

export default function AccountJoin() {
    // 이동도구
    const navigate = useNavigate();

    // 현재 단계
    const [step, setStep] = useState(1);

    const steps = ["본인인증", "정보입력"]

    // 인증된 전화번호를 저장
    const [verifiedPhone, setVerifiedPhone] = useState("");

    // step1이 성공하면 step2로 이동
    const step1Success = useCallback((phone) => {
        setVerifiedPhone(phone);
        setStep(1);
    }, []);

    // 이용약관에서 받은 정보
    const location = useLocation();

    const marketingAgree = location.state?.marketingAgree || 'N';
    const thirdPartyAgree = location.state?.thirdPartyAgree || 'N';

    //render
    return (<>
        <div className={styles.stepContainer}>
            <Stepper steps={steps} currentStep={step} />

            {/* 내용 영역 */}
            <div style={{ marginTop: '40px' }}>
                {step === 0 ? (
                    <AccountJoinStep1 onNext={step1Success} />
                ) : (
                    <AccountJoinStep2
                        verifiedPhone={verifiedPhone}
                        marketingAgree={marketingAgree}
                        thirdPartyAgree={thirdPartyAgree}
                    />
                )}
            </div>
        </div>

    </>)
}