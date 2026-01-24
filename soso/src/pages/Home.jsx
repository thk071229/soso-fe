import ClubCard from "../component/club/ClubCard";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

export default function Home() {

    const dummyMoims = [
        {
            id: 1,
            title: "퇴근 후 가볍게 달리기 하실 분! 초보 환영합니다 🏃",
            category: "운동/스포츠",
            region: "수원시 영통구",
            image: "https://picsum.photos/id/73/400/300", // 랜덤 이미지
            dDay: "마감임박",
            currentMember: 3,
            maxMember: 4,
            status: "모집중"
        },
        {
            id: 2,
            title: "주말 오후, 조용하게 책 읽는 모임 (북카페 투어)",
            category: "독서/인문",
            region: "수원시 팔달구",
            image: "https://picsum.photos/id/24/400/300",
            dDay: "D-5",
            currentMember: 1,
            maxMember: 6,
            status: "모집중"
        },
        {
            id: 3,
            title: "같이 베이킹 원데이 클래스 들으러 가요 🥐",
            category: "취미/공예",
            region: "용인시 수지구",
            image: "https://picsum.photos/id/292/400/300",
            dDay: "D-2",
            currentMember: 2,
            maxMember: 2,
            status: "마감"
        },
        {
            id: 4,
            title: "직장인 영어회화 스터디 (왕초보반)",
            category: "외국어",
            region: "수원시 권선구",
            image: "https://picsum.photos/id/3/400/300",
            dDay: "상시모집",
            currentMember: 5,
            maxMember: 8,
            status: "모집중"
        },
        {
            id: 5,
            title: "맛집 탐방하고 인스타 사진 찍기 📸",
            category: "맛집/카페",
            region: "수원역 인근",
            image: "https://picsum.photos/id/431/400/300",
            dDay: "D-1",
            currentMember: 3,
            maxMember: 4,
            status: "모집중"
        }
    ];

    return (<>
        <div className="home-container">

            {/* 1. 상단 배너 섹션 */}
            <section className={styles.bannerSection}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <span className="badge bg-secondary text-white mb-2">New</span>
                            <h1 className={styles.bannerTitle}>
                                소소한 취미,<br />
                                <span style={{ color: '#20C997' }}>특별한 만남</span>으로<br />
                                시작해보세요.
                            </h1>
                            <p className="text-secondary mt-3">
                                동네 이웃들과 함께하는 취미 생활,<br />
                                지금 바로 내 주변 모임을 찾아보세요!
                            </p>

                            <Link to="/club/create" className="btn btn-primary btn-lg mt-3 shadow-sm">
                                <i className="bi bi-plus-lg me-2"></i>모임 개설하기
                            </Link>

                        </div>
                        {/* 배너 오른쪽엔 일러스트나 이미지가 들어가면 좋음 (일단 비워둠) */}
                        <div className="col-md-6 text-end d-none d-md-block">
                            {/* 폰트어썸 아이콘을 크게 넣어서 장식 */}
                            <i className="bi bi-people-fill" style={{ fontSize: '150px', color: '#C3FAE8' }}></i>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. 메인 리스트 섹션 */}
            <section className="container mb-5">
                <div className={styles.sectionTitle}>
                    <span>🔥 지금 뜨는 소모임</span>
                    <a href="#" className="text-decoration-none fs-6 text-secondary fw-normal">전체보기 &gt;</a>
                </div>

                {/* 반응형 그리드: 모바일 1열 / 태블릿 2열 / PC 4열 */}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                    {dummyMoims.map((club) => (
                        <div className="col" key={club.id}>
                            <ClubCard data={club} />
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. 추천 카테고리 (간단하게) */}
            <section className="container py-5">
                <h3 className="fw-bold mb-4">어떤 취미를 찾으세요?</h3>
                <div className="d-flex gap-3 overflow-auto pb-3">
                    {['🚴 운동', '📚 독서', '🍳 요리', '🎵 음악', '✈️ 여행', '🎨 미술'].map((tag, index) => (
                        <button key={index} className="btn btn-outline-secondary rounded-pill px-4 text-nowrap">
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

        </div>
    </>)
}