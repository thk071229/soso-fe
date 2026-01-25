import { Route, Routes } from "react-router-dom";
import AccountJoin from "./pages/account/join/AccountJoin";
import AccountJoinFinish from "./pages/account/join/AccountJoinFinish";
import Agreement from "./pages/account/join/Agreement";
import AccountLogin from "./pages/account/AccountLogin";
import InitialSetup from "./pages/account/join/InitialSetup";
import ClubCreate from "./pages/club/ClubCreate";
import Home from "./pages/Home";
import ClubLayout from "./pages/club/detail/ClubLayout";
import ClubHome from "./pages/club/detail/ClubHome";
import ClubBoard from "./pages/club/detail/ClubBoard";
import ClubEvent from "./pages/club/detail/ClubEvent";

export default function Content() {

    //render
    return (
        <>
            <div className="row">
                <div className="col-md-10 offset-md-1">
                    <Routes>

                        {/* 메인페이지 */}
                        <Route path="/" element={<Home/>}></Route>

                        {/* 회원 관련 페이지 */}
                        <Route path="/account/join" element={<AccountJoin/>}></Route>
                        <Route path="/account/joinFinish" element={<AccountJoinFinish />}></Route>
                        <Route path="/account/agreement" element={<Agreement/>}></Route>
                        <Route path="/account/login" element={<AccountLogin/>}></Route>
                        <Route path="/account/initial-setup" element={<InitialSetup/>}></Route>

                        {/* 소모임 관련 페이지 */}
                        <Route path="/club/create" element={<ClubCreate/>}></Route>
                        <Route path="/club/detail/:clubNo" element={<ClubLayout />}>
                            <Route index element={<ClubHome />} />          {/* 기본: 홈 */}
                            <Route path="home" element={<ClubHome />} />    {/* 탭: 홈 */}
                            <Route path="board" element={<ClubBoard />} />  {/* 탭: 게시판 */}
                            <Route path="event" element={<ClubEvent />} />    {/* 탭: 정모 */}
                        </Route>

                    </Routes>
                </div>
            </div>
        </>
    )
}