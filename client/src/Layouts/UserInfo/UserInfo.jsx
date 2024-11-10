import "./UserInfo.css";
import chat_image1 from "../../assets/buttons/messageIcon.png";
import chat_image2 from "../../assets/buttons/phoneIcon.png";
import chat_image3 from "../../assets/buttons/settingIcon.png";
function UserInfo() {
  return (
    <div className="userInfoHeader">
      <div className="userInfoContainer1">
        <button className="messageIcon  ">
          <img className="messageLogo" src={chat_image1} />
        </button>
        <button className=" phoneIcon ">
          <img className="phoneLogo" src={chat_image2} />
        </button>
        <button className=" settingIcon ">
          <img className="settingLogo" src={chat_image3} />
        </button>
      </div>
    </div>
  );
}

export default UserInfo;
