import styles from "./ClubCard.module.css";

const ClubCard = ({ data }) => {

    return (<>
        <div className={`card h-100 ${styles.cardContainer}`}>

            {/* 썸네일 영역 */}
            <div className={styles.imageWrapper}>
                <img src={data.image} alt={data.title} className={styles.cardImage}></img>
                <span className={styles.badgeCategory}>{data.category}</span>

                {/* 찜하기 하트 아이콘 (우측 상단) */}
                <div className="position-absolute top-0 end-0 p-3">
                    <i className="bi bi-heart-fill text-white fs-5" style={{ textShadow: '0 0 3px rgba(0,0,0,0.3)' }}></i>
                </div>
            </div>

            {/* 내용 영역 */}
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-secondary" style={{ fontSize: '12px' }}>
                        <i className="bi bi-geo-alt me-1"></i>{data.region}
                    </small>
                    <small className="text-danger fw-bold" style={{ fontSize: '12px' }}>
                        {data.dDay}
                    </small>
                </div>

                <h5 className={styles.cardTitle}>{data.title}</h5>

                <div className="d-flex justify-content-between align-items-end mt-3">
                    {/* 멤버 정보 */}
                    <div className="d-flex align-items-center">
                        <i className="bi bi-people-fill text-secondary me-1" style={{color : '#20C997'}}></i>
                        <span className="text-secondary" style={{ fontSize: '13px' }}>
                            {data.currentMember} / {data.maxMember}명
                        </span>
                    </div>
                    {/* 금액이나 상태 */}
                    <span className="badge bg-light text-dark border">
                        {data.status}
                    </span>
                </div>
            </div>
        </div>
    </>)
}

export default ClubCard;