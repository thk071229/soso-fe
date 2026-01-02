import { Route, Routes } from "react-router-dom";
import AccountJoin from "./account/accountjoin/accountJoin";
import AccountJoinFinish from "./account/accountjoin/AccountJoinFinish";
import Home from "./Home";


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

                    </Routes>
                </div>
            </div>
        </>
    )
}