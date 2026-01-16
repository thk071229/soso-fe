import { useCallback, useEffect, useState } from "react";
import styles from "./InitialSetupStep2.module.css";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { accessTokenState, loginIdState, loginLevelState } from "../../../utils/jotai"; // loginIdState는 안써서 뺌
import axios from "../../../utils/axios/customAxios";

const InitialSetupStep2 = ({ onFinish }) => {

    // jotai
    const [accessToken, setAccessToken] = useAtom(accessTokenState);
    const setLoginId = useSetAtom(loginIdState);
    const setLoginLevel = useSetAtom(loginLevelState);
    // 이동 도구
    const navigate = useNavigate();

    // DB에서 가져온 카테고리 목록
    const [categoryList, setCategoryList] = useState([]);
    // 사용자가 입력한 카테고리 번호 목록
    const [selectedNos, setSelectedNos] = useState([]);

    // 1. 카테고리 목록 불러오기 (GET)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // [핵심 1] GET 요청이지만, 인터셉터 통과를 위해 토큰을 강제로 넣습니다.
                // 백엔드에서 exclude가 제대로 안 먹혀도 이걸로 뚫립니다.
                const response = await axios.get("/category", {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                });
                setCategoryList(response.data || []);
            }
            catch (err) {
                console.error("카테고리 로딩 실패", err);
            }
        };
        fetchCategories();
    }, [accessToken]); // [핵심 2] 여기는 [] 또는 [accessToken]만 있어야 합니다. categoryList 넣으면 무한루프!

    // 2. 카테고리 선택 토글
    const toggleCategory = useCallback((categoryNo) => {
        setSelectedNos(prev => {
            // 이미 선택된 번호라면 제거 
            if (prev.includes(categoryNo)) {
                return prev.filter(no => no !== categoryNo);
            }
            // 선택 안 된 번호면 추가
            else {
                if (prev.length >= 5) {
                    alert("최대 5개까지만 선택 가능합니다");
                    return prev;
                }
                return [...prev, categoryNo];
            }
        })
    }, []);

    // 3. 저장 및 전송 (POST)
    const sendData = useCallback(async () => {
        if (selectedNos.length === 0) {
            return alert("관심사를 하나 이상 선택해주세요");
        }

        try {
            await axios.post("/category/insert", {
                categoryList: selectedNos
            }, {
                // [핵심 3] POST 요청에도 토큰 강제 주입
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            alert("설정이 완료되었습니다! 환영합니다");

            // sessionStorage에 저장
            window.sessionStorage.setItem("accessToken", accessToken);

            // 내 정보 가져오기
            const profileResp = await axios.get("/account/profile", {
                headers: { Authorization: "Bearer " + accessToken }
            });

            if (onFinish) {
                onFinish();
            }
            else {
                navigate("/");
            }
        }
        catch (err) {
            console.error("저장 실패", err);
            if (err.response && err.response.status === 403) {
                alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
            } else {
                alert("저장 중 오류가 발생했습니다");
            }
        }
    }, [selectedNos, accessToken, navigate, onFinish]); // 의존성 배열 완벽함

    return (
        <div className="container">
            <div className="text-center mb-5">
                <h3 className="fw-bold mb-2">어떤 주제에 관심이 있으신가요?</h3>
                <p className="text-muted">딱 맞는 모임을 추천해 드릴게요. (최대 5개)</p>
            </div>

            {/* 그리드 영역 */}
            <div className={styles.categoryGrid}>
                {categoryList.map((cat) => (
                    <button
                        key={cat.categoryNo}
                        // 선택 여부에 따라 active 스타일 적용
                        className={`${styles.catCard} ${selectedNos.includes(cat.categoryNo) ? styles.activeCat : ''}`}
                        onClick={() => toggleCategory(cat.categoryNo)}
                    >
                        <div className={styles.catIcon}>
                            <i className={cat.categoryIcon || "fa-solid fa-star"}></i>
                        </div>

                        <span className={styles.catLabel}>{cat.categoryName}</span>
                    </button>
                ))}
            </div>

            {/* 하단 버튼 */}
            <div className="mt-5 text-end">
                <button
                    className="btn btn-primary btn-lg px-5 fw-bold"
                    onClick={sendData}
                    disabled={selectedNos.length === 0}
                >
                    SOSO 시작하기
                </button>
            </div>
        </div>
    );
}

export default InitialSetupStep2;