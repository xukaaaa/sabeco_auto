import axios from 'axios'
import React, { useEffect, useState } from 'react'

function RewardsInfo({rewardList}) {

    

    // const response = await rewardApis.getVoucher(reward?.id ?? 0);

    //   setVoucher(response.data.data.voucher);

    // await rewardApis.redeemReward(reward?.id ?? 0, parseTelco);
    // redeemReward: async (rewardId: number, telco?: string) => {
    //     const response = await axiosInstance.post('/redeem_reward/', {
    //       reward_id: rewardId,
    //       telco,
    //     });
    //     return response;
    //   },

    //   getVoucher: async (playerRewardId: number) => {
    //     const response = await axiosInstance.post('/get_player_reward/', {
    //       player_reward_id: playerRewardId,
    //     });
    //     return response;
    //   },

  return (
    <div style={{
        textAlign: 'left',
        width: '100%',
        marginBottom: '20px'
    }}>
        {
            localStorage.getItem('token')
        }
        {
            rewardList.map(item => (
                <div key={item?.id}>
                    {`${item?.name} - `}<span style={{
                        color: item?.is_claimed ? 'green' : 'red'
                    }}>{item?.is_claimed ? 'Đã nhận' : 'Chưa nhận'}</span>{` - ${item?.description}` }
                </div>
            ))
        }
    </div>
  )
}

export default RewardsInfo