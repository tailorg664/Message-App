import React from 'react'
import "./UserInfo.css"
import chat_image1 from "../../assets/buttons/messageIcon.png"
import chat_image2 from "../../assets/buttons/phoneIcon.png"
import chat_image3 from "../../assets/buttons/settingIcon.png"
function UserInfo() {
  return (
    <div className="userInfoHeader">
      <div className='userInfoContainer1' >
          <div className="messageIcon  " >
            
            <img className='messageLogo'  src={chat_image1}  />
            </div>
          <div className=" phoneIcon ">
            <img className='phoneLogo' src={chat_image2}  />
          </div>
          
          
      </div>
      <div className='userInfoContainer2' >
          
      <div className=" settingIcon ">
            <img className='settingLogo' src={chat_image3}  />
          </div>

      </div>
     

    </div>
    
  );
}

export default UserInfo
