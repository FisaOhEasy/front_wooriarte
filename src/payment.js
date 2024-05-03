import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import MuiDialog from "./libs/MuiDialog";

const Payment = ({ exhibitId, ticketNumber }) => {
  const [enableDialog, setEnableDialog] = useState(false); //  빈 다이어로그
  const [enableLoginDialog, setEnableLoginDialog] = useState(false); //  로그인 다이어로그
  const [enableNotInfoDialog, setEnableNotInfoDialog] = useState(false); //  결제정보 가져오기 실패 다이어로그
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const fetchMerchantUid = async (exhibitId, amount) => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/api/payment", {
        exhibit_id: exhibitId,
        amount: amount,
      });
      return {
        merchantUid: response.data.merchant_uid,
        amount: response.data.amount,
      };
    } catch (error) {
      console.error("merchant_uid를 가져오는 중 에러가 발생했습니다.", error);
      return null;
    }
  };

  const requestPay = async (exhibitId, amount) => {
    if (amount == 0) {
      setEnableDialog(true);
      return;
    }
    const userId = localStorage.getItem("userId");
    if (userId == undefined) {
      setEnableLoginDialog(true);
      return;
    }

    const orderInfo = await fetchMerchantUid(exhibitId, amount);

    if (!orderInfo) {
      setEnableNotInfoDialog(true);
      return;
    }

    const { IMP } = window;
    IMP.init("imp20842147");

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        merchant_uid: orderInfo.merchantUid,
        name: "사탕이 녹는 시간 1매",
        amount: orderInfo.amount,
      },
      async (rsp) => {
        try {
          const { data } = await axios.post(
            "http://127.0.0.1:8080/api/payment/verifyIamport/" + rsp.imp_uid
          );
          console.log(data.verified);
          if (data.verified) {
            alert("결제 성공");
            alert(localStorage.userId);
            const { ticket } = await axios.post(
              "http://127.0.0.1:8080/api/tickets",
              {
                amount: ticketNumber,
                exhibitId: exhibitId,
                userId: localStorage.userId,
                paymentId: data.paymentId,
                status: false,
                canceled: false,
              }
            );
          } else {
            alert("결제 실패");
          }
        } catch (error) {
          console.error("결제 검증 중 에러 발생:", error);
          await axios.post(
            "http://127.0.0.1:8080/api/payment/cancel/" + orderInfo.merchantUid
          );
          alert("결제 실패");
        }
      }
    );
  };

  return (
    <div>
      <Button
        variant="contained"
        endIcon={<AddShoppingCartIcon />}
        onClick={() => requestPay(exhibitId, ticketNumber)}
        style={{
          marginTop: 10,
          backgroundColor: "black", // 버튼 배경색을 검정으로 설정
          color: "white", // 텍스트 색상을 흰색으로 설정
          "&:hover": {
            backgroundColor: "darkgrey", // 호버 상태의 배경색 변경
          },
        }}
      >
        결제하기
      </Button>
      {enableDialog && (
        <MuiDialog
          title={"알림"}
          content={"티켓 매수가 0입니다!"}
          result={true}
          page={"login"}
          parentClick={setEnableDialog}
        />
      )}
      {enableLoginDialog && (
        <MuiDialog
          title={"알림"}
          content={"로그인 후 이용해 주세요."}
          result={true}
          page={"login"}
          parentClick={setEnableLoginDialog}
        />
      )}
      {enableNotInfoDialog && (
        <MuiDialog
          title={"알림"}
          content={"결제 정보를 가져오는데 실패했습니다."}
          result={true}
          page={"login"}
          parentClick={setEnableNotInfoDialog}
        />
      )}
    </div>
  );
};

export default Payment;
