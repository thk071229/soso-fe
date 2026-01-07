import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// UI 아이콘
import { FaCamera, FaEye, FaEyeSlash, FaUser } from "react-icons/fa6";

// Custom Hook & Styles
import { useImage } from "../../../utils/hooks/useImage";
import styles from "./AccountJoinStep2.module.css";

const AccountJoinStep2 = ({ verifiedPhone, marketingAgree, thirdPartyAgree }) => {
    // 1. 초기화 및 State 정의
    const navigate = useNavigate();
    const { file, preview, handleFile } = useImage("/images/default-profile.jpg");

    const [account, setAccount] = useState({
        accountId: "", accountPw: "", accountPw2: "",
        accountEmail: "", accountBirth: "", accountGender: "",
        accountNickname: "",
        accountContact: verifiedPhone, attach: "",
        accountMarketingAgree: marketingAgree || 'N',
        accountThirdPartyAgree: thirdPartyAgree || 'N'
    });

    const [accountClass, setAccountClass] = useState({
        accountId: "", accountPw: "", accountPw2: "",
        accountEmail: "", accountNickname: "", accountContact: verifiedPhone
    });

    const [feedbacks, setFeedbacks] = useState({
        id: "", pw: "", nickname: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    // 2. 핸들러 함수들
    const changeStrValue = useCallback(e => {
        const { name, value } = e.target;
        setAccount(prev => ({ ...prev, [name]: value }));

        if (value.length === 0) {
            setAccountClass(prev => ({ ...prev, [name]: "" }));
            setFeedbacks(prev => ({ ...prev, [name === 'accountId' ? 'id' : name === 'accountPw' ? 'pw' : 'nickname']: "" }));
        }
    }, []);

    // [수정] 날짜 입력 핸들러 (MUI 제거 -> 표준 input event 사용)
    const changeDateValue = useCallback((e) => {
        setAccount(prev => ({ ...prev, accountBirth: e.target.value }));
    }, []);

    //아이디 검사
    const checkAccountId = useCallback(async (e) => {
        const regex = /^[a-z][a-z0-9]{4,19}$/;
        const isValid = regex.test(account.accountId);
        if (isValid) {
            try {
                const { data } = await axios.get(`/account/accountId/${account.accountId}`);
                if (data === true) {
                    setAccountClass(prev => ({ ...prev, accountId: "is-valid" }));
                }
                else {
                    setAccountClass(prev => ({ ...prev, accountId: "is-invalid" }));
                    setAccountIdFeedback("이미 사용중인 아이디입니다");
                }
            } catch (e) { console.error(e); }
        }
        else {
            setAccountClass(prev => ({ ...prev, accountId: "is-invalid" }));
            setAccountIdFeedback("아이디는 영문 소문자로 시작하며 숫자를 포함한 5-20자로 작성하세요");
        }

        if (account.accountId.length === 0) {
            setAccountClass(prev => ({ ...prev, accountId: "" }));
            setAccountIdFeedback("");
        }
    }, [account.accountId]);

    // 비밀번호 검사
    const checkAccountPw = useCallback((e) => {
        const regex = /^(?=.*?[A-Z]+)(?=.*?[a-z]+)(?=.*?[0-9]+)(?=.*?[!@#$]+)[A-Za-z0-9!@#$]{8,16}$/;
        const isValid1 = regex.test(account.accountPw);
        const isValid2 = (account.accountPw === account.accountPw2);

        setAccountClass(prev => ({
            ...prev,
            accountPw: account.accountPw.length > 0 ? (isValid1 ? "is-valid" : "is-invalid") : "",
            accountPw2: account.accountPw2.length > 0 ? (isValid2 && isValid1 ? "is-valid" : "is-invalid") : ""
        }));

    }, [account.accountPw, account.accountPw2]);

    // 유효성 검사 (닉네임)
    //닉네임 검사
    const checkAccountNickname = useCallback(async () => {
        const regex = /^[가-힣0-9]{2,10}$/;
        const isValid = regex.test(account.accountNickname);
        if (isValid === true) {
            try {
                const { data } = await axios.get(`/account/accountNickname/${account.accountNickname}`);
                if (data === true) {
                    setAccountClass(prev => ({ ...prev, accountNickname: "is-valid" }));
                }
                else {
                    setAccountClass(prev => ({ ...prev, accountNickname: "is-invalid" }));
                    setAccountNicknameFeedback("이미 사용중인 닉네임입니다");
                }
            } catch (e) { console.error(e); }
        }
        else {
            setAccountClass(prev => ({ ...prev, accountNickname: "is-invalid" }));
            setAccountNicknameFeedback("한글 또는 숫자 2~10글자로 작성하세요");
        }
    }, [account.accountNickname]);

    // 유효성 검사 (이메일)
    const checkAccountEmail = useCallback(() => {
        if (account.accountEmail.length === 0) {
            setAccountClass(prev => ({ ...prev, accountEmail: "" }));
            return;
        }
        const regex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}$/;
        setAccountClass(prev => ({
            ...prev,
            accountEmail: regex.test(account.accountEmail) ? "is-valid" : "is-invalid"
        }));
    }, [account.accountEmail]);

    // 통합 유효성 검사
    const accountValid = useMemo(() => {
        return (
            accountClass.accountId === "is-valid" &&
            accountClass.accountPw === "is-valid" &&
            accountClass.accountPw2 === "is-valid" &&
            accountClass.accountNickname === "is-valid" &&
            accountClass.accountEmail !== "is-invalid" &&
            account.accountBirth && account.accountGender
        );
    }, [accountClass, account]);

    // 전송 로직
    const sendData = useCallback(async () => {
        if (!accountValid) return;
        const formData = new FormData();

        Object.keys(account).forEach(key => {
            if (key !== 'attach') formData.append(key, account[key]);
        });
        if (file) formData.append("attach", file);

        try {
            await axios.post("/account/join", formData);
            navigate("/account/joinFinish");
        } catch (e) {
            const msg = e.response?.data?.message || "가입 오류 발생";
            alert(msg);
        }
    }, [account, accountValid, file, navigate]);

    // [추가] 오늘 날짜 구하기 (미래 선택 방지용)
    const today = new Date().toISOString().split("T")[0];

    // 3. UI 렌더링
    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className={styles.card}>
                        <div className={styles.topBar}></div>

                        <div className="card-body p-4 p-md-5">
                            <h3 className={styles.title}>정보 입력</h3>

                            {/* 프로필 사진 영역 */}
                            <div className="text-center mb-5">
                                <label className={styles.profileWrapper}>
                                    <img
                                        src={preview}
                                        alt="프로필"
                                        className={styles.profileImg}
                                        onError={(e) => { e.target.src = "/images/default-profile.jpg"; }}
                                    />

                                    {/* 여기가 아이콘 들어가는 자리 */}
                                    <div className={styles.cameraIcon}>
                                        {/* CSS Module로 색상이나 크기를 제어할 수 있습니다 */}
                                        <FaCamera className={styles.iconSvg} />
                                    </div>

                                    <input
                                        type="file"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleFile} />
                                </label>
                                <div className="text-muted small mt-2">프로필 사진 선택</div>
                            </div>

                            {/* 아이디 */}
                            <div className="row mb-3 align-items-center">
                                <label className={`col-sm-3 ${styles.label}`}>
                                    아이디 <span className={styles.required}>*</span>
                                </label>
                                <div className="col-sm-9">
                                    <div className="input-group">
                                        {/* 1. 인풋창: styles.roundedInput 제거! */}
                                        <input
                                            type="text"
                                            className={`form-control ${accountClass.accountId}`}
                                            name="accountId"
                                            value={account.accountId}
                                            onChange={changeStrValue}
                                            placeholder="영문 소문자, 숫자 포함 5~20자"
                                        />

                                        {/* 2. 버튼: checkBtn은 색상만 담당 */}
                                        <button className={`btn ${styles.checkBtn} ms-2`} type="button" onClick={checkAccountId}>
                                            중복확인
                                        </button>
                                    </div>

                                    <div className="invalid-feedback">{feedbacks.id}</div>
                                    {accountClass.accountId === "is-valid" && <div className={styles.validText}>사용 가능한 아이디입니다!</div>}
                                </div>
                            </div>

                            {/* 비밀번호 */}
                            <div className="row mb-3 align-items-center">
                                <label className={`col-sm-3 ${styles.label}`}>
                                    비밀번호 <span className={styles.required}>*</span>
                                </label>
                                <div className="col-sm-9">
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control ${accountClass.accountPw}`}
                                            name="accountPw"
                                            value={account.accountPw}
                                            onChange={changeStrValue}
                                            onBlur={checkAccountPw}
                                            placeholder="8~16자, 영문/숫자/특수문자"
                                            style={{ paddingRight: '40px', backgroundImage: "none" }}
                                        />
                                        <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </span>
                                    </div>
                                    {accountClass.accountPw === "is-invalid" &&
                                        <div className="invalid-feedback d-block">형식에 맞게 입력해주세요 (대/소문자, 숫자, 특수문자)</div>}
                                </div>
                            </div>

                            {/* 비밀번호 확인 */}
                            <div className="row mb-3 align-items-center">
                                <label className={`col-sm-3 ${styles.label}`}>
                                    비밀번호 확인 <span className={styles.required}>*</span>
                                </label>
                                <div className="col-sm-9">
                                    <div className="position-relative">
                                        <input
                                            type={showPasswordCheck ? "text" : "password"}
                                            className={`form-control ${accountClass.accountPw2}`}
                                            name="accountPw2"
                                            value={account.accountPw2}
                                            onChange={changeStrValue}
                                            onBlur={checkAccountPw}
                                            placeholder="비밀번호 재입력"
                                            style={{ paddingRight: '40px', backgroundImage: "none" }}
                                        />
                                        <span className={styles.eyeIcon} onClick={() => setShowPasswordCheck(!showPasswordCheck)}>
                                            {showPasswordCheck ? <FaEye /> : <FaEyeSlash />}
                                        </span>
                                    </div>
                                    {accountClass.accountPw2 === "is-invalid" && <div className="invalid-feedback d-block">비밀번호가 일치하지 않습니다</div>}
                                </div>
                            </div>

                            {/* 닉네임 */}
                            <div className="row mb-3 align-items-center">
                                <label className={`col-sm-3 ${styles.label}`}>
                                    닉네임 <span className={styles.required}>*</span>
                                </label>
                                <div className="col-sm-9">
                                    <div className="input-group">
                                        {/* styles.roundedInput 제거 */}
                                        <input type="text"
                                            className={`form-control ${accountClass.accountNickname}`}
                                            name="accountNickname" value={account.accountNickname} onChange={changeStrValue}
                                            placeholder="한글, 숫자 2~10자" />

                                        <button className={`btn ${styles.checkBtn} ms-2`} type="button" onClick={checkAccountNickname}>
                                            중복확인
                                        </button>
                                    </div>
                                    <div className="invalid-feedback">{feedbacks.nickname}</div>
                                    {accountClass.accountNickname === "is-valid" && <div className={styles.validText}>멋진 닉네임이네요!</div>}
                                </div>
                            </div>

                            {/* 이메일 */}
                            <div className="row mb-3 align-items-center">
                                <label className={`col-sm-3 ${styles.label}`}>이메일</label>
                                <div className="col-sm-9">
                                    <input type="text" className={`form-control ${accountClass.accountEmail}`}
                                        name="accountEmail" value={account.accountEmail} onChange={changeStrValue} onBlur={checkAccountEmail}
                                        placeholder="user@example.com (선택)" />
                                    {accountClass.accountEmail === "is-invalid" && <div className="invalid-feedback d-block">이메일 형식이 올바르지 않습니다</div>}
                                </div>
                            </div>

                            {/* 성별 */}
                            <div className="row mb-3 align-items-center">
                                <label className={`col-sm-3 ${styles.label}`}>
                                    성별 <span className={styles.required}>*</span>
                                </label>
                                <div className="col-sm-9">
                                    <div className="btn-group w-100" role="group">
                                        {['남', '여', ''].map(gender => (
                                            <button key={gender} type="button"
                                                className={`btn ${styles.genderBtn} ${account.accountGender === gender ? styles.genderBtnActive : ''}`}
                                                onClick={() => setAccount({ ...account, accountGender: gender })}>
                                                {gender || '선택안함'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* [수정] 생년월일 (표준 input 사용) */}
                            <div className="row mb-5 align-items-center">
                                <label className={`col-sm-3 ${styles.label}`}>
                                    생년월일 <span className={styles.required}>*</span>
                                </label>
                                <div className="col-sm-9">
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="accountBirth"
                                        value={account.accountBirth}
                                        onChange={changeDateValue}
                                        max={today} // 미래 날짜 선택 방지
                                        style={{ height: "45px" }} // 다른 input과 높이 맞춤
                                    />
                                </div>
                            </div>

                            {/* 가입 버튼 */}
                            <button type="button" className={styles.submitBtn}
                                disabled={!accountValid} onClick={sendData}>
                                {accountValid ? "회원 가입하기" : "필수 정보를 모두 입력해주세요"}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountJoinStep2;