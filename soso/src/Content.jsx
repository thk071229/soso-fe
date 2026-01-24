import { Route, Routes } from "react-router-dom";
import AccountJoin from "./account/accountjoin/accountJoin";
import AccountJoinFinish from "./account/accountjoin/AccountJoinFinish";
import Home from "./Home";
import Agreement from "./account/accountjoin/Agreement";
import AccountLogin from "./account/AccountLogin";
import InitialSetup from "./account/accountjoin/InitialSetup";
import ClubCreate from "./club/ClubCreate";


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
                        <Route path="/account/join" element={<AccountJoin />}></Route>
                        <Route path="/account/joinFinish" element={<AccountJoinFinish />}></Route>
                        <Route path="/account/agreement" element={<Agreement/>}></Route>
                        <Route path="/account/login" element={<AccountLogin/>}></Route>
                        <Route path="/account/initial-setup" element={<InitialSetup/>}></Route>

                        {/* 소모임 관련 페이지 */}
                        <Route path="/club/create" element={<ClubCreate/>}></Route>

                    </Routes>
                </div>
            </div>
        </>
    )
}