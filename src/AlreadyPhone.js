import React, {useState} from 'react';
import axios from "axios";
const BASE_URL = 'https://dragongem.biasaigon.vn/sbar/api'

function AlreadyPhone(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [avaiablePlay, setAvaiablePlay] = useState(0);

  const getPlayerInfo = async () => {
    const apiRs2 = await axios.post(`/sbar/api/get_player_info/`, {}, {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
    const user_info = apiRs2?.data?.data
    setAvaiablePlay(user_info?.turn_of_single_play)
    setUserInfo(user_info)
  }
  const handleLogin = async () => {
    try {
      const apiRs1 = await axios.post(`/sbar/api/login/`, {
        phone_number: username,
        password: password,

      })
      const token = apiRs1?.data?.data?.token
      console.log(token)
      alert('Đăng nhập thành công')



      localStorage.setItem('token', token)
  await getPlayerInfo()
    }
    catch (e) {
      console.log(e, 'Có lỗi khi đăng nhập')
    }
  }

  const handleGetDragon = async () => {
    try {
      const apiRs = await axios.post(`/sbar/api/capture_dragon/` , {} , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
      console.log(apiRs)
      const idDragon = apiRs?.data?.data?.id
      localStorage.setItem('idDragon', idDragon)
      return idDragon
    }
    catch (e) {
      console.log(e, 'Có lỗi khi săn rồng')
    }
  }

  const setDefaultDragon = async () => {
   try {
      const apiRs = axios.post(`/sbar/api/set_default_player_dragon/` , {
        player_dragon_id: localStorage.getItem('idDragon')
      } , {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
     // console.log(apiRs)
   }
   catch (e) {
     console.log(e, 'Có lỗi khi set default dragon')
   }
  }

  const autoPlay = async () => {

    try {
      for (let level = 1; level <= avaiablePlay; level++) {

        const apiRs = await axios.post(`/sbar/api/end_single_play_game/`, {
          "is_win": "true",
          "level": level.toString(),
        }, {
          headers: {
            Authorization: `JWT ${localStorage.getItem('token')}`
          }
        });
        console.log(`Gửi thành công với level: ${level}`);
        console.log(apiRs.data); // In ra dữ liệu từ phản hồi của API nếu cần
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
    }
  }

  // Hàm chơi hộ cho người khác
  const handlePlay = async () => {
    if(avaiablePlay === 0) {
      alert('Hết lượt chơi')
      return
    }
    try{
      if (userInfo?.turn_of_scan > 0) {
        // Săn rồng
        await handleGetDragon()

        // Chọn rồng mặc định
        await setDefaultDragon()
      }
      else {
        alert('Hết lượt lấy rồng')
      }

      // Chơi game
      await autoPlay()

      // Lấy thông tin người chơi
      await getPlayerInfo()

    }
    catch (e) {
      console.log(e, 'Có lỗi khi chơi hộ')
    }

  }


  return (
    <div>
      Đã đki, cần choi lay diem
      {userInfo && (<div>{JSON.stringify(userInfo)}</div>)}
      <label htmlFor="username">Nhập sđt</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)}/>

      <label htmlFor="username">Nhập password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)}/>

      <button onClick={handleLogin} >Đăng nhập</button>
      <button onClick={handlePlay} >Chơi hộ</button>
    </div>
  );
}

export default AlreadyPhone;
