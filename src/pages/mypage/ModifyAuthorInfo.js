import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import "../../styles/ModifySpaceInfo.css";
import BusinessInfo from "../../components/BusinessInfo";
// 다이어로그
import MuiDialog from "../../libs/MuiDialog";

// api
import { onConfirmAuthorPwHandler } from "../../apis/servicehandeler/AuthorApiHandler";
const ModifyAuthorInfo = () => {
  // 비밀번호 입력 후 개인정보 수정 들어간건지
  const [authState, setAuthState] = useState(false);
  const [enableDialog, setEnableDialog] = useState(false); //  다이어로그
  // api 비밀번호 확인
  const setAuthStateChange = () => {
    let userId = localStorage.getItem("userId");
    console.log("유저 비번확인" + userId);
    onConfirmAuthorPwHandler(
      { userId, password: passwordState },
      (responseStatus) => {
        // 비밀번호 확인 조건식 넣기
        if (responseStatus) {
          setAuthState(true);
        } else {
          setEnableDialog(true);
          setAuthState(false);
        }
      }
    );
  };
  // 비밀번호 입력
  const [passwordState, setPasswordState] = useState("");

  const handlePasswordChangeState = (e) => {
    setPasswordState(e.target.value);
  };

  const [infostate, setInfoState] = useState({
    name: "",
    id: "",
    phoneNumber: "",
    email: "",
    password: "",
    authPassword: "",
  });

  const handleChangeState = (e) => {
    setInfoState({
      ...infostate,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="spaceInfoContainer">
      {authState === true && (
        <BusinessInfo
          isBusinessInfo={true}
          whatUser={"author"}
          setAuthState={setAuthState}
        />
      )}
      {authState === false && (
        <div>
          <Stack
            spacing={2}
            direction="row"
            style={{ marginTop: 20, marginBottom: 50 }}
          >
            <TextField
              name="pw"
              id="standard-password-input"
              label="비밀번호"
              type="password"
              autoComplete="current-password"
              variant="standard"
              onChange={handlePasswordChangeState}
            />

            <button
              type="button"
              class="btn btn-dark"
              onClick={setAuthStateChange}
            >
              확인
            </button>
          </Stack>
        </div>
      )}
      {enableDialog && (
        <MuiDialog
          title={"알림"}
          content={"비밀번호가 틀렸습니다. 다시 입력해주세요"}
          result={true}
          page={"login"}
          parentClick={setEnableDialog}
        />
      )}
    </div>
  );
};
export default ModifyAuthorInfo;
