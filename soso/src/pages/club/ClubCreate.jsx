import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios/customAxios";
import { useAtom } from "jotai";
import { useImage } from "../../utils/hooks/useImage";
import styles from "./ClubCreate.module.css";
import { loginIdState } from "../../utils/jotai";

export default function ClubCreate() {
    const navigate = useNavigate();
    const [loginId] = useAtom(loginIdState);

    // state
    const [club, setClub] = useState({
        clubName: "", clubIntroduce: "",
        regionNo: 0, categoryNo: 0,
        clubMax: 20, clubOpen: "Y"
    });

    // 카테고리 목록
    const [categoryList, setCategoryList] = useState([]);

    // 지역 관련 state
    const [selectedRegionName, setSelectedRegionName] = useState("");
    const [regionList, setRegionList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDepth1, setSelectedDepth1] = useState(null);

    // useImage Hook
    const { file, preview, handleFile } = useImage("/images/default-profile.jpg");

    // 1. 지역 정보 로드
    useEffect(() => {
        if(!loginId) return;
        
        const fetchRegions = async () => {
            try {
                const { data } = await axios.get("/region");
                setRegionList(Array.isArray(data) ? data : []);
            } catch (err) { console.error(err); }
        };
        fetchRegions();

        const fetchCategories = async () => {
            try {
                const response = await axios.get("/category");
                setCategoryList(response.data || []);
            }
            catch (err) {
                console.error("카테고리 로딩 실패", err);
            }
        };
        fetchCategories();
    }, []);

    // 2. 지역 데이터 그룹핑
    const groupedRegions = useMemo(() => {
        const groups = {};
        regionList.forEach((item) => {
            const parts = (item.regionName || "").split(" ");
            const depth1 = parts[0];
            if (!depth1) return;
            if (!groups[depth1]) groups[depth1] = [];
            groups[depth1].push(item);
        });
        return groups;
    }, [regionList]);

    // 카테고리 선택 토글
    const handleCategory = (categoryNo) => {
        setClub(prev => ({
            ...prev,
            categoryNo: categoryNo
        }));
    };

    // 핸들러
    const handleChange = useCallback((e) => {
        setClub({ ...club, [e.target.name]: e.target.value });
    }, [club]);

    // 지역 선택 핸들러
    const handleRegionSelect = (regionItem) => {
        setClub(prev => ({ ...prev, regionNo: regionItem.regionNo }));
        setSelectedRegionName(regionItem.regionName);
        setShowModal(false);
        setSelectedDepth1(null);
    };

    const sendData = useCallback(async () => {
        // 유효성 검사
        if (!club.clubName) { alert("제목을 입력해주세요!"); return; }
        if (club.regionNo === 0) { alert("활동 지역을 선택해주세요!"); return; }
        if (club.categoryNo === 0) { alert("카테고리를 선택해주세요!"); return; } // [중요] 0 체크

        const formData = new FormData();
        formData.append("clubName", club.clubName);
        formData.append("clubIntroduce", club.clubIntroduce);
        formData.append("regionNo", club.regionNo);
        formData.append("categoryNo", club.categoryNo);
        formData.append("clubMax", club.clubMax);
        formData.append("clubOpen", club.clubOpen);

        if (file) formData.append("attach", file);

        try {
            const response = await axios.post("/club/create", formData);
            alert("소모임 개설 완료!");
            navigate(`/club/detail/${response.data}`);
        } catch (err) {
            console.error("개설 실패", err);
            alert("오류가 발생했습니다.");
        }
    }, [club, file]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>소모임 개설하기</h2>

            {/* 이미지 업로드 */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>대표 이미지</label>
                <img src={preview} alt="preview" className={styles.previewImg} />
                <input type="file" className={styles.input} onChange={handleFile} />
            </div>

            {/* 카테고리 선택 */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>카테고리</label>
                <div className={styles.categoryContainer}>
                    {categoryList.map(cate => (
                        <button
                            key={cate.categoryNo}
                            // 선택된 항목에만 active 스타일 적용
                            className={`${styles.categoryBtn} ${club.categoryNo === cate.categoryNo ? styles.activeCategory : ''}`}
                            // [수정] 위에서 정의한 함수 이름과 똑같이 호출!
                            onClick={() => handleCategory(cate.categoryNo)}
                        >
                            {cate.categoryName}
                        </button>
                    ))}
                </div>
            </div>

            {/* 기본 정보 */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>모임 이름</label>
                <input type="text" name="clubName" className={styles.input}
                    placeholder="멋진 모임 이름을 지어주세요" onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>모임 소개</label>
                <textarea name="clubIntroduce" className={styles.textarea} rows="5"
                    placeholder="어떤 모임인지 소개해 주세요" onChange={handleChange}></textarea>
            </div>

            {/* 활동 지역 */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>활동 지역</label>
                <div className={styles.regionRow}>
                    <input type="text" className={`${styles.input} ${styles.regionInput}`}
                        value={selectedRegionName} readOnly placeholder="지역을 선택해주세요" />
                    <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowModal(true)}>
                        찾기
                    </button>
                </div>
            </div>

            {/* 기타 설정 */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>최대 인원</label>
                <input type="number" name="clubMax" className={styles.input}
                    value={club.clubMax} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>가입 방식</label>
                <div className={styles.joinTypeContainer}>
                    {/* 옵션 1: 바로 가입 (Y) */}
                    <button
                        className={`${styles.joinTypeBtn} ${club.clubOpen === 'Y' ? styles.activeJoinType : ''}`}
                        onClick={() => setClub({ ...club, clubOpen: 'Y' })}
                    >
                        <span className={styles.joinTitle}>바로 가입</span>
                        <span className={styles.joinDesc}>누구나 즉시 가입하여 활동합니다.</span>
                    </button>

                    {/* 옵션 2: 승인제 가입 (N) */}
                    <button
                        className={`${styles.joinTypeBtn} ${club.clubOpen === 'N' ? styles.activeJoinType : ''}`}
                        onClick={() => setClub({ ...club, clubOpen: 'N' })}
                    >
                        <span className={styles.joinTitle}>승인제 가입</span>
                        <span className={styles.joinDesc}>모임장의 승인을 받아야 가입됩니다.</span>
                    </button>
                </div>
            </div>

            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={sendData}>
                개설 완료
            </button>

            {/* 지역 선택 모달 */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>활동 지역 선택</h3>
                            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>&times;</button>
                        </div>

                        {/* Step 1: 시/도 */}
                        <div>
                            <h5 className={styles.sectionTitle}>1. 시/도를 선택해주세요</h5>
                            <div className={styles.tagContainer}>
                                {Object.keys(groupedRegions).map(depth1 => (
                                    <button key={depth1}
                                        className={`${styles.tagBtn} ${selectedDepth1 === depth1 ? styles.activeTag : ''}`}
                                        onClick={() => setSelectedDepth1(depth1)}>
                                        {depth1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px dashed #eee' }} />

                        {/* Step 2: 세부 지역 */}
                        <div>
                            <h5 className={styles.sectionTitle}>
                                {selectedDepth1 ? `2. ${selectedDepth1}의 세부 지역을 선택해주세요` : "2. 시/도를 먼저 선택하면 세부 지역이 나옵니다"}
                            </h5>
                            <div className={styles.tagContainer} style={{ minHeight: '100px' }}>
                                {selectedDepth1 ? (
                                    groupedRegions[selectedDepth1].map(regionItem => {
                                        const nameParts = regionItem.regionName.split(" ");
                                        const depth2Name = nameParts.length > 1 ? nameParts[1] : "전체";
                                        return (
                                            <button key={regionItem.regionNo}
                                                className={styles.tagBtn}
                                                onClick={() => handleRegionSelect(regionItem)}>
                                                {depth2Name}
                                            </button>
                                        )
                                    })
                                ) : (
                                    <div style={{ color: '#ccc', width: '100%', textAlign: 'center', paddingTop: '30px' }}>
                                        (위에서 지역을 선택해주세요)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}