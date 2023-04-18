import React, { useState } from "react";

const Options = ({
  children,
  me,
  setName,
  callUser,
  leaveCall,
  name,
  callAccepted,
  callEnded,
}) => {
  const [idToCall, setIdToCall] = useState("");
  return <div>
    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    {children}</div>;
};

export default Options;
