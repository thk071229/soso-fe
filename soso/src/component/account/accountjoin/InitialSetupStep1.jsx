import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../../utils/axios/customAxios";
import { useAtom } from "jotai";
import { accessTokenState, regionState } from "../../../utils/jotai";
import styles from "./InitialSetupStep1.module.css";
// 아이콘 (설치 필요: npm install react-icons)
import { FaHouse, FaBuilding, FaHeart, FaPlus, FaXmark } from "react-icons/fa6";

export default function InitialSetupStep1({ onNext }) {
    // 1. 상태 관리
    const [selectedRegionAtom, setSelectedRegionAtom] = useAtom(regionState); // (필요하다면 사용)
    const [regionList, setRegionList] = useState([]); // 서버 원본 데이터 (ID 찾기용)
    const [accessToken, setAccessToken] = useAtom(accessTokenState);

    // 사용자가 설정한 3개의 지역 (화면 표시용)
    const [selections, setSelections] = useState({
        HOME: null,      // 예: "서울특별시 강남구"
        WORK: null,
        INTEREST: null
    });

    // 모달 상태 (현재 어떤 슬롯을 수정 중인가?)
    const [activeSlot, setActiveSlot] = useState(null); // 'HOME', 'WORK', 'INTEREST' or null
    const [tempDepth1, setTempDepth1] = useState("서울특별시"); // 모달 내 선택 중인 시/도

    // 2. 데이터 가져오기
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const { data } = await axios.get("/region");
                setRegionList(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRegions();
    }, []);

   const groupedRegions = useMemo(() => {
        const groups = {};

        regionList.forEach((item) => {
            const fullName = item.regionName || "";
            const parts = fullName.split(" ");

            const depth1 = parts[0];
            const depth2 = parts[1];

            if (!depth1) return;

            if (!groups[depth1]) {
                groups[depth1] = new Set();
            }

            // "서울특별시" 처럼 뒤에 구/군이 없는 경우도 처리
            if (depth2) {
                groups[depth1].add(depth2);
            } else {
                groups[depth1].add("전체"); // 혹은 자기 자신
            }
        });

        const result = {};
        Object.keys(groups).forEach(key => {
            result[key] = Array.from(groups[key]).sort();
        });

        console.log("분류된 지역 데이터", result);

        return result;
    }, [regionList]);

    // 4. 핸들러: 지역 선택 완료 (모달에서 구/군 클릭 시)
    const handleSelectComplete = (depth2) => {
        const finalValue = depth2 === "전체" ? tempDepth1 : `${tempDepth1} ${depth2}`;

        // 선택한 슬롯에 값 저장
        setSelections(prev => ({ ...prev, [activeSlot]: finalValue }));

        // 모달 닫기 및 초기화
        setActiveSlot(null);
    };

    // 5. 핸들러: 선택 취소 (X 버튼)
    const handleRemove = (e, slotType) => {
        e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
        setSelections(prev => ({ ...prev, [slotType]: null }));
    };

    // 6. 서버 전송 (ID 매칭 및 Insert)
    const handleSubmit = async () => {
        if (!selections.HOME) return alert("집(필수) 위치를 설정해주세요!");

        // [추가] DB가 원하는 값으로 변환하는 사전
        const typeMapping = {
            "HOME": "집",
            "WORK": "직장",
            "INTEREST": "관심지역"
        };

        try {
            // 3개의 슬롯을 순회하며 저장
            for (const [type, regionName] of Object.entries(selections)) {
                if (regionName) {
                    // [핵심] 문자열(서울 강남구)로 원본 리스트에서 ID(regionNo) 찾기
                    const target = regionList.find(r => r.regionName === regionName);

                    if (target) {
                        // DB Insert 요청
                        await axios.post("/region/insert", null, {
                            params: {
                                regionNo: target.regionNo,
                                regionType: typeMapping[type]
                            },
                            // [추가] 토큰을 강제로 실어 보냅니다!
                            headers: {
                                Authorization: "Bearer " + accessToken
                            }
                        });
                    }
                }
            }
            onNext(); // 다음 단계로
        } catch (e) {
            console.error(e);

            if (e.response && e.response.status === 500) {
                alert("데이터베이스 제약조건 오류: regionType 값을 확인해주세요.");
            } else {
                alert("저장 중 오류가 발생했습니다.");
            }

        }
    };

    // 슬롯 설정 정보
    const slotConfig = [
        { key: 'HOME', label: '우리 집', icon: <FaHouse />, required: true },
        { key: 'WORK', label: '직장/학교', icon: <FaBuilding />, required: false },
        { key: 'INTEREST', label: '관심지역', icon: <FaHeart />, required: false },
    ];

    return (
        <div className="container">
            <h3 className="text-center fw-bold mb-4">활동 지역을 설정해주세요</h3>
            <p className="text-center text-muted mb-5">동네 인증과 모임 추천에 사용됩니다.</p>

            {/* 1. 슬롯 카드 영역 */}
            <div className={styles.slotContainer}>
                {slotConfig.map((slot) => (
                    <div
                        key={slot.key}
                        className={`${styles.slotCard} ${selections[slot.key] ? styles.activeCard : ''}`}
                        onClick={() => {
                            setActiveSlot(slot.key);
                            // 기존 값이 있다면 그 지역의 시/도로 탭 초기화 (UX 디테일)
                            if (selections[slot.key]) {
                                setTempDepth1(selections[slot.key].split(" ")[0]);
                            }
                        }}
                    >
                        <div className={styles.iconWrapper}>{slot.icon}</div>
                        <div className={styles.slotInfo}>
                            <span className={styles.slotLabel}>
                                {slot.label} {slot.required && <span className="text-danger">*</span>}
                            </span>
                            <span className={styles.slotValue}>
                                {selections[slot.key] || "눌러서 지역 선택"}
                            </span>
                        </div>

                        {/* 값이 있을 때만 X 버튼 표시 (필수값인 HOME은 삭제 불가 처리 가능) */}
                        {selections[slot.key] && (
                            <button
                                className={styles.removeBtn}
                                onClick={(e) => handleRemove(e, slot.key)}
                            >
                                <FaXmark />
                            </button>
                        )}
                        {!selections[slot.key] && <FaPlus className={styles.plusIcon} />}
                    </div>
                ))}
            </div>

            {/* 2. 지역 선택 모달 (activeSlot이 있을 때만 표시) */}
            {activeSlot && (
                <div className={styles.modalOverlay} onClick={() => setActiveSlot(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h5>지역 선택 ({slotConfig.find(s => s.key === activeSlot).label})</h5>
                            <button className="btn-close" onClick={() => setActiveSlot(null)}></button>
                        </div>

                        <div className={styles.selectorBody}>
                            {/* 왼쪽: 시/도 리스트 */}
                            <ul className={styles.depth1List}>
                                {Object.keys(groupedRegions).map(d1 => (
                                    <li
                                        key={d1}
                                        className={tempDepth1 === d1 ? styles.activeDepth1 : ''}
                                        onClick={() => setTempDepth1(d1)}
                                    >
                                        {d1}
                                    </li>
                                ))}
                            </ul>

                            {/* 오른쪽: 시/군/구 그리드 */}
                            <div className={styles.depth2Grid}>
                                {groupedRegions[tempDepth1]?.map(d2 => (
                                    <button
                                        key={d2}
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => handleSelectComplete(d2)}
                                    >
                                        {d2}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-5 text-end">
                <button
                    className="btn btn-primary btn-lg px-5"
                    onClick={handleSubmit}
                    disabled={!selections.HOME} // 집 설정 안하면 비활성
                >
                    다음 단계로
                </button>
            </div>
        </div>
    );
}