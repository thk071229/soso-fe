import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import styles from './SearchSection.module.css';
import axios from "../../utils/axios/customAxios";
import { useAtom } from "jotai";
import { regionState } from "../../utils/jotai";

const SearchSection = () => {

    const [selectedRegion, setSelectedRegion] = useAtom(regionState);
    const [regionList, setRegionList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState("");

    // UI 상태: 왼쪽 패널에서 선택된 '시/도' (기본값: 서울특별시)
    const [activeTab, setActiveTab] = useState("서울특별시");

    // ref
    const dropdownRef = useRef(null);

    // ✨ 2. 외부 클릭 감지 로직 (useEffect)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 드롭다운이 열려있고, 클릭한 곳이 드롭다운 영역(dropdownRef)의 바깥이라면 닫기
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // 화면 전체에 이벤트 리스너 등록
        document.addEventListener('mousedown', handleClickOutside);

        // 컴포넌트가 사라질 때 리스너 정리 (메모리 누수 방지)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // isOpen이 바뀔 때마다 갱신

    // 1. 데이터 가져오기
    const fetchRegions = useCallback(async () => {
        try {
            const { data } = await axios.get("/region");
            if (Array.isArray(data)) {
                setRegionList(data);
            } else {
                setRegionList([]);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchRegions();
    }, [fetchRegions]);

    // 2. 데이터 가공 (Memoization으로 성능 최적화)
    // "서울특별시 종로구" -> { "서울특별시": ["종로구", "중구"...], "경기도": ["수원시"...] } 형태로 변환
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

    // 3. 최종 선택 핸들러
    const handleSelectComplete = (depth2) => {
        // "전체"를 선택했을 경우 "서울특별시"만 저장, 아니면 "서울특별시 종로구" 저장
        const finalValue = depth2 === "전체" ? activeTab : `${activeTab} ${depth2}`;
        setSelectedRegion(finalValue);
        setIsOpen(false);
    };

    return (
        <div className="container pb-2">
            <div className="d-flex gap-2">

                {/* --- 지역 선택 영역 --- */}
                <div className="flex-shrink-0 position-relative" ref={dropdownRef}>

                    <button
                        className={`btn rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${styles.regionBtn}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <i className="bi bi-geo-alt-fill text-danger"></i>
                        <span className="fw-bold" style={{ fontSize: '14px' }}>
                            {selectedRegion}
                        </span>
                        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} text-secondary`} style={{ fontSize: '10px' }}></i>
                    </button>

                    {/* ✨ 메가 드롭다운 메뉴 */}
                    {isOpen && (
                        <div className={styles.megaDropdown}>

                            {/* [왼쪽] 시/도 리스트 */}
                            <ul className={`${styles.leftPanel} text-nowrap`}>
                                {Object.keys(groupedRegions).map((depth1) => (
                                    <li
                                        key={depth1}
                                        className={`${styles.leftItem} ${activeTab === depth1 ? styles.activeLeftItem : ''}`}
                                        onClick={() => setActiveTab(depth1)} // 마우스 올리면 탭 변경
                                    >
                                        {depth1}
                                    </li>
                                ))}
                            </ul>

                            {/* [오른쪽] 구/군 리스트 (선택된 시/도에 따라 바뀜) */}
                            <div className={`${styles.rightPanel} text-nowrap`}>
                                <div className={styles.subGrid}>
                                    {/* 현재 선택된 탭의 하위 지역들만 보여줌 */}
                                    {groupedRegions[activeTab]?.map((depth2, index) => (
                                        <div
                                            key={index}
                                            className={styles.rightItem}
                                            onClick={() => handleSelectComplete(depth2)}
                                        >
                                            <label className="cursor-pointer d-flex align-items-center gap-2">
                                                {/* 라디오 버튼 모양 흉내 (원하면 제거 가능) */}
                                                <input
                                                    type="radio"
                                                    checked={selectedRegion?.includes(depth2) && selectedRegion?.includes(activeTab)}
                                                    readOnly
                                                    style={{ accentColor: '#20C997' }}
                                                />
                                                {depth2}
                                            </label>
                                        </div>
                                    ))}

                                    {/* 데이터가 없을 경우 */}
                                    {(!groupedRegions[activeTab] || groupedRegions[activeTab].length === 0) && (
                                        <div className="text-secondary small p-2">하위 지역 없음</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* --- 검색창 영역 (그대로) --- */}
                <div className="flex-grow-1">
                    <div className={`d-flex align-items-center px-3 py-2 ${styles.searchBox}`}>
                        <i className="bi bi-search text-secondary me-2"></i>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="검색어를 입력하세요"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SearchSection;