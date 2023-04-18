import React from "react";
import styles from "../../styles/components/videocall/Videoplayer.module.css";

const VideoPlayer = ({
  name,
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  stream,
  call,
  // setName,
  // callUser,
  // answerCall,
  // leaveCall,
}) => {
  return (
    <div className={styles.main__container}>
      {stream && (
        <div className={styles.my__video__container}>
          <p>{name}</p>
          <video
            className={styles.my__video}
            playsInline
            muted
            ref={myVideo}
            autoPlay
          />
        </div>
      )}
      {callAccepted && !callEnded && (
        <div>
          <p> {call.name}</p>
          <video
            className={styles.user__video}
            playsInline
            muted
            ref={userVideo}
            autoPlay
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
