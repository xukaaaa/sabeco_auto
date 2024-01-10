import React, {useEffect, useState} from 'react';
import axios from "axios";
const BASE_URL = 'https://dragongem.biasaigon.vn/sbar/api'

function AlreadyPhone({getReward}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [avaiablePlay, setAvaiablePlay] = useState(0);
  const [token, setToken] = useState('')

  const getPlayerInfo = async () => {
    try {
      const apiRs2 = await axios.post(`/sbar/api/get_player_info/`, {}, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
      const user_info = apiRs2?.data?.data
      setAvaiablePlay(user_info?.turn_of_single_play)
      setUserInfo(user_info)
      return user_info
    } catch (error) {
      
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

  const autoPlay = async (newUserInfo) => {

    for (let level = 1; level <= newUserInfo.turn_of_single_play; level++) {
        try {

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
      } catch (error) {
        continue
      }
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

  const handleLoginWithToken = () => {
    localStorage.setItem('token', token)
  }

  

  const handleLogin = async () => {
    const listPhone = username.split('\n').map(item => item.trim())
    try {
      for (let i = 0; i< listPhone.length; i++) {
        const apiRs1 = await axios.post(`/sbar/api/login/`, {
              phone_number: listPhone[i],
              password: password,
      
            })
            const token = apiRs1?.data?.data?.token
            if(token) {
              console.log(token)
            // alert('Đăng nhập thành công')
      
      
      
            localStorage.setItem('token', token)
            setToken(token)
            getReward()
            const newUserInfo = await getPlayerInfo()

            // wait 1s
            if(newUserInfo.turn_of_single_play === 0) {
              alert(`Số ${newUserInfo?.phone_number} hết lượt chơi`)
              continue
            }
              if (newUserInfo?.turn_of_scan > 0) {
                // Săn rồng
                await handleGetDragon()
        
                // Chọn rồng mặc định
                await setDefaultDragon()
              }
              else {
                alert('Hết lượt lấy rồng')
              }
        
              // Chơi game
              await autoPlay(newUserInfo)
        
              // Lấy thông tin người chơi
              await getPlayerInfo()
        
            
            await new Promise(resolve => setTimeout(resolve, 1000));}
            else{
              continue
            }
      }
    } catch (error) {
      console.log(error)
    }
    // try {
    //   const apiRs1 = await axios.post(`/sbar/api/login/`, {
    //     phone_number: username,
    //     password: password,

    //   })
    //   const token = apiRs1?.data?.data?.token
    //   console.log(token)
    //   alert('Đăng nhập thành công')



    //   localStorage.setItem('token', token)
    //   await getPlayerInfo()
    // }
    // catch (e) {
    //   console.log(e, 'Có lỗi khi đăng nhập')
    // }
  }

  const getGrabVoucher = async () => {
    const listPhone = username.split('\n').map(item => item.trim())
    try {
      for (let i = 0; i< listPhone.length; i++) {
        const apiRs1 = await axios.post(`/sbar/api/login/`, {
              phone_number: listPhone[i],
              password: password,
      
        })
        const token = apiRs1?.data?.data?.token
        if(token) {
            // alert('Đăng nhập thành công')
      
      
      
            localStorage.setItem('token', token)
            setToken(token)
            getReward()
            const newUserInfo = await getPlayerInfo()

            // wait 1s
            const voucher = await axios.post(`/sbar/api/redeem_reward/`,{
              reward_id: 2,
            } , {
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem('token')}`
              }
            })
            console.log(`${voucher.data?.voucher_code} -  ${voucher.data?.msg}}`)

          }
          else {
            continue
          }
            
      
    } }catch(e) {
      console.log(e, 'Có lỗi khi đăng nhập')
    }
  }

  

  const getShopeeVoucher = async () => {
    const listPhone = username.split('\n').map(item => item.trim())
    try {
      for (let i = 0; i< listPhone.length; i++) {
        const apiRs1 = await axios.post(`/sbar/api/login/`, {
              phone_number: listPhone[i],
              password: password,
      
        })
        const token = apiRs1?.data?.data?.token
        if(token) {
            // alert('Đăng nhập thành công')
      
      
      
            localStorage.setItem('token', token)
            setToken(token)
            getReward()
            const newUserInfo = await getPlayerInfo()

            // wait 1s
            const voucher = await axios.post(`/sbar/api/redeem_reward/`,{
              reward_id: 3,
            } , {
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem('token')}`
              }
            })
            console.log(`${voucher.data?.voucher_code} -  ${voucher.data?.msg}}`)
          }
          else {
            continue
          }
            
      
    } }catch(e) {
      console.log(e, 'Có lỗi khi đăng nhập')
    }
  }

  useEffect(() => {
    getPlayerInfo()
  }, [])

  return (
    <div>
      Đã đki, cần choi lay diem
      {userInfo && (<div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        textAlign: 'left',
      }}>{JSON.stringify(userInfo)}</div>)}
      <label htmlFor="username">Nhập sđt</label>
      <textarea value={username} onChange={(e) => setUsername(e.target.value)}/>

      <label htmlFor="username">Nhập password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)}/>

      <button onClick={handleLogin} >Tự chơi lấy điểm</button>
      <button onClick={getGrabVoucher}>Đổi voucher grab</button>
      <button onClick={getShopeeVoucher}>Đổi voucher shopee</button>
    
    </div>
  );
}

export default AlreadyPhone;
