import './App.css';
import {useState} from "react";
import axios from "axios";
import AlreadyPhone from "./AlreadyPhone";
import RedeemRewards from './RedeemRewards';

const BASE_URL = 'https://dragongem.biasaigon.vn/sbar/api'

function App() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const generateRandomEmail = () => {
    return Math.round(Math.random() * 100000) + "@gmail.com";
  }

  const getOTP = async () => {
    try {
      await axios.post(`sbar/api/get_otp/`, {
        phone_number: phone,
      })
    }
    catch (e) {
      alert('Có lỗi xảy ra')
      console.log(e)
    }
  }

  const registerAccount = async () => {
    try {
      const apiRs = await axios.post(`/sbar/api/registry/`, {
        email: generateRandomEmail(),
        full_name: 'Nguyen Van A',
        location: "Hà Nội",
        otp: otp,
        password: '111000zZ',
        phone_number: phone,
      })
      if (apiRs?.data?.msg === 'Already exists') {
        alert('Tài khoản đã tồn tại')
        return
      }
      // return apiRs.

      localStorage.setItem('token', apiRs?.data?.data?.token)

      // lay token in ra
      console.log(phone, '111000zZ', apiRs?.data?.data?.token)
    }
    catch (e) {
      console.log(e, 'Có lỗi khi đăng ký')
    }
  }


  // Xử lý case tài khoản đã tồn tại
  const handleSubmitPhone= async () => {
    if (!phone) {
      alert('Vui lòng nhập số diện thoại')
      return
    }
    try {
      await getOTP()
    }
    catch (e) {
      console.log(e)
      console.log('get otp failed')
    }
  }

  const handleSubmitOTP = async() => {
    if (!otp) {
      alert('Vui lòng nhập mã OTP')
      return
    }
    await registerAccount()
  }


  return (
    <div className="App">
      <div>Đki mới
        <label htmlFor="input">Nhập sđt</label>
        <input id={'input'} value={phone} onChange={(e) => setPhone(e.target.value)}/>
        <button onClick={handleSubmitPhone}>Lấy OTP</button>

        <label htmlFor="input_otp">Nhập OTP</label>
        <input id={'input_otp'} value={otp} onChange={(e) => setOtp(e.target.value)}/>
        <button onClick={handleSubmitOTP}>Xác nhận OTP</button>
      </div>

      <AlreadyPhone />
      <RedeemRewards />
    </div>
  );
}

export default App;
