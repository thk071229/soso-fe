import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from "../../../utils/axios/customAxios"
import styles from "./ClubLayout.module.css";
import { useAtom } from "jotai";
import { loginIdState } from "../../../utils/jotai";


export default function ClubLayout(){

    const [loginId] = useAtom(loginIdState);

    const {clubNo} = useParams(); // URL에서 번호 꺼내기
    const navigate = useNavigate();

    // state
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    // callback
    const loadData = useCallback(async()=>{

        try{
            const resp = await axios.get(`/club/detail/${clubNo}`);
            setDetail(resp.data);
            setLoading(false);
        }
        catch(err){
            alert("소모임 정보를 불러오지 못했습니다");
            console.error(err)
            // navigate("/club/")
        }
    },[clubNo]);

    useEffect(()=>{
        loadData();
    },[clubNo]);

    if (loading) return <div>로딩중... ⏳</div>;
    if (!detail) return null;

    const { clubDto, isMember, isLeader } = detail;

    return (<>
        <div className={styles.container}>
            {/* === [공통 상단] 헤더 === */}
            <div className={styles.header}>
                <h1>{clubDto.clubName}</h1>
                <p>멤버 {detail.memberList.length}명</p>
                {/* 버튼들: 데이터에 따라 다르게 보여주기 */}
                <div className={styles.actions}>
                    {!isMember && <button>가입하기</button>}
                    {isMember && <button>채팅하기</button>}
                    {isLeader && <button>설정</button>}
                </div>
            </div>

            {/* === [공통 상단] 탭 메뉴 === */}
            <nav className={styles.nav}>
                {/* NavLink는 활성화되면 'active' 클래스를 자동 적용해줌 */}
                <NavLink to="home" className={({isActive})=> isActive ? styles.active : styles.tab}>홈</NavLink>
                <NavLink to="board" className={({isActive})=> isActive ? styles.active : styles.tab}>게시판</NavLink>
                <NavLink to="gallery" className={({isActive})=> isActive ? styles.active : styles.tab}>사진첩</NavLink>
                <NavLink to="chat" className={({isActive})=> isActive ? styles.active : styles.tab}>정모</NavLink>
            </nav>

            <hr />

            {/* === [가변 하단] 여기가 중요!! ⭐ === */}
            {/* 자식들아, 'detail' 데이터랑 'loadData' 함수 가져다 써라! */}
            <Outlet context={{ detail, loadData }} /> 
        </div>
    </>)
}