import React from "react";
import { useRef } from "react";

import { firestore } from "database/firebase";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Messages({ study, participant }) {
  const dummy = useRef();

  const messagesRef = firestore
    .collection("studies")
    .doc(study.id)
    .collection("participants")
    .doc(participant.id)
    .collection("messages");

  const autoscroll = () => {
    dummy.current && dummy.current.scrollIntoView();
  };

  return (
    <>
      <MessageList ref={dummy} autoscroll={autoscroll} messagesRef={messagesRef} />
      <MessageInput autoscroll={autoscroll} messagesRef={messagesRef} />
    </>
  );
}

export default Messages;
