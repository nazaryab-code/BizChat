import React, { useEffect, useRef } from 'react';
import Message from './Message';

function MessageList({ messages, currentUser, selectedUser }) {
  const messageListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Filter messages based on the sender and receiver's full names
  const filteredMessages = messages.filter(
    (message) =>
      (message.sender === currentUser && message.receiver === selectedUser) ||
      (message.sender === selectedUser && message.receiver === currentUser)
  );

  return (
    <div ref={messageListRef} className="columns is-multiline has-text-black has-background-white-bis messagelist scrollable-content" style={{ alignContent: 'flex-start', overflowY: 'auto', maxHeight: '400px' }}>
      {filteredMessages.map((message, index) => (
        <Message key={index} data={message} currentUser={currentUser} />
      ))}
    </div>
  );
}

export default MessageList;
