import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/components/videocall/Videochat.module.css";
import VideoPlayer from "./VideoPlayer";
import Options from "./Options";
import Notifications from "./Notifications";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { api_host } from "../../constants";

const socket = io(api_host);

const VideoChat = ({ videoCallToggle, setVideoCallToggle }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => setMe(id));

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({
        isReceivedCall: true,
        from,
        name: callerName,
        signal,
      });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    videoCallToggle && (
      <div className={styles.main__container}>
        <p onClick={() => setVideoCallToggle(false)}>X</p>
        <VideoPlayer
          name={name}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          callEnded={callEnded}
          stream={stream}
          call={call}
          // setName={setName}
          // callUser={callUser}
          // answerCall={answerCall}
          // leaveCall={leaveCall}
        />
        <Options
          me={me}
          setName={setName}
          callUser={callUser}
          leaveCall={leaveCall}
          name={name}
          callAccepted={callAccepted}
          callEnded={callEnded}
        >
          <Notifications />
        </Options>
      </div>
    )
  );
};

export default VideoChat;
