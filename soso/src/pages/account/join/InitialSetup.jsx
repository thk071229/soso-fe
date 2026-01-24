// 지역 카테고리 등 초기 설정을 위한 페이지
import { useNavigate } from "react-router-dom";
import Stepper from "../../../component/common/Stepper";
import InitialSetupStep1 from "./InitialSetupStep1";
import InitialSetupStep2 from "./InitialSetupStep2";
import { useCallback, useState } from "react";

export default function InitialSetup() {
    // 이동도구
    const navigate = useNavigate();

    // 현재 단계 
    const [step, setStep] = useState(0);
    const steps = ["지역설정", "카테고리설정"];

    // step1이 성공하면 step2로 이동
    const step1Success = useCallback(() => {
        setStep(prev=>prev+1);
    }, []);

    // 모든 설정 완료 후 메인으로 이동
    const handleFinish = () => {
        alert("모든 설정이 완료되었습니다!");
        navigate("/");
    };


    //render
    return (<>
        <div className="container mt-5">
            {/* Stepper UI에 현재 step 전달 */}
            <Stepper currentStep={step} steps={["지역 설정", "카테고리 설정"]} />

            <div className="mt-4">
                {/* Step 1: 지역 설정 
                  - 저장이 완료되면 handleNextStep을 호출하도록 전달
                */}
                {step === 0 && (
                    <InitialSetupStep1 onNext={step1Success} />
                )}

                {/* Step 2: 카테고리 설정 
                  - 저장이 완료되면 handleFinish를 호출하도록 전달
                */}
                {step === 1 && (
                    <InitialSetupStep2 onFinish={handleFinish} />
                )}
            </div>
        </div>
    </>)
}