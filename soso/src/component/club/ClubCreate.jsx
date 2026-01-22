import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "../../utils/axios/customAxios";
import { useAtom } from "jotai";
import { loginIdState } from "../../utils/jotai";
import { useImage } from "../../utils/hooks/useImage";

export default function ClubCreate() {
    // 이동 도구
    const navigate = useNavigate();

    // jotai state
    const [loginId, setLoginId] = useAtom(loginIdState);

    // state
    const [club, setClub] = useState({
        clubName: "", clubLeader: "", clubIntroduce: "",
        regionNo: "", categoryNo: "", clubProfile: "",
        clubMax: "", clubOpen: ""
    });
    // 선택된 지역 이름
    const [selectedRegionName, setSelectedRegionName] = useState("");
    // 소모임 활동지역
    const [regionList, setRegionList] = useState([]);

    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    //모달 내부: 현재 선택된 시/도 (Depth1)
    const [selectedDepth1, setSelectedDepth1] = useState(null);

    // 지역정보 가져오기
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const { data } = await axios.get("/region");
                setRegionList(Array.isArray(data) ? data : []);
            }
            catch (err) {
                console.error(err);
            }
            fetchRegions();
        }
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

            if (depth2) {
                groups[depth1].add(depth2);
            }
            else {
                groups[depth1].add("전체")
            }
        });

        const result = {};
        Object.keys(groups).forEach(key => {
            result[key] = Array.from(groups[key]).sort();
        });

        console.log("분류된 데이터", result);

    }, [regionList]);

    // 4. 핸들러: 지역 선택 완료 (모달에서 구/군 클릭 시 실행)
    const handleRegionSelect = (regionItem) => {
        // regionItem 안에 regionNo, regionName 다 들어있음
        setClub(prev => ({ ...prev, regionNo: regionItem.regionNo })); // 번호 저장 (서버 전송용)
        setSelectedRegionName(regionItem.regionName); // 이름 저장 (화면 표시용)

        setShowModal(false); // 모달 닫기
        setSelectedDepth1(null); // 초기화
    };

    //  지역 선택 완료 (모달에서 구/군 클릭 시)
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


    // useImage
    const { file, preview, handleFile } = useImage("/images/default-profile.jpg");

    const sendData = useCallback(async () => {

        // 유효성 검사 (빈칸 막기)
        if (!club.clubName) { alert("제목을 입력해주세요!"); return; }
        if (!club.regionNo) { alert("활동 지역을 선택해주세요!"); return; }

        // 보따리 준비
        const formData = new FormData();

        formData.append("clubName", club.clubName);
        formData.append("clubIntroduce", club.clubIntroduce);
        formData.append("regionNo", club.regionNo);
        formData.append("categoryNo", club.categoryNo);
        formData.append("clubMax", club.clubMax);
        formData.append("clubOpen", club.clubOpen);

        if (file) {
            formData.append("attach", file);
        }

        try {
            const response = await axios.post("/club/create", formData);

            const newClubNo = response.data;
            alert("소모임 개설 완료! 소모임 페이지로 이동합니다");
            navigate(`/club/detail/${newClubNo}`);

        }
        catch (err) {
            console.error("개설 실패", err);
        }
    }, []);

    return (<>

    </>)
}