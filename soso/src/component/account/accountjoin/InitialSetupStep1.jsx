import { useState } from "react";
import axios from "../../../utils/axios/customAxios";

export default function InitialSetupStep1({ onNext }) {
    const [region, setRegion] = useState("");

    const sendRegion = async () => {
        if(!region) return alert("지역을 선택해주세요.");

        try {
            // [API] 지역 정보 업데이트 (PUT)
            // 예: 사용자 ID는 토큰에 있으니 body에는 지역만 보냄
            await axios.put("/account/region", { accountRegion: region });
            
            // 성공하면 부모가 준 '다음' 함수 실행
            onNext(); 
        } catch (e) {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h3>주로 활동하는 지역은 어디인가요?</h3>
            {/* 지역 선택 UI (버튼 등) */}
            <input value={region} onChange={e => setRegion(e.target.value)} />
            
            <button onClick={sendRegion}>다음 단계로</button>
        </div>
    );
}