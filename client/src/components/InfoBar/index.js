import React from 'react';
import socket from '../../configs/socketConfig'
import onlineIcon from '../../assets/icons/onlineIcon.png';
import closeIcon from '../../assets/icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room }) => {

  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img className="onlineIcon" src={onlineIcon} alt="online icon" />
        <h3>{room}</h3>
      </div>
      <div className="rightInnerContainer">
        <a href='/' ><img src={closeIcon} alt="close icon" /></a>
      </div>
    </div>
  )
};

export default InfoBar;