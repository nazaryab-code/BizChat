import React, { useState, useRef } from 'react';
import { useMessagesDispatch } from '../contexts/MessagesContext';
import socket from '../Socket';
import NoteModal from './NoteModal';
// Import the sound file
import messageSound from '../styles/sound/send.mp3';
import clickSound from '../styles/sound/clicktoggle.mp3';
//import whooshSound from '../styles/sound/open.mp3';//incomming message
import openSetting from '../styles/sound/coin.mp3';//open show more button

function MessageForm({ fullName }) {
  const textareaRef = useRef(null);
  const dispatch = useMessagesDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [isRobotOn, setIsRobotOn] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false); // State to control the visibility of the modal
  const [noteContent, setNoteContent] = useState('');

  const audioRef = useRef(new Audio(messageSound));
  const audio1Ref = useRef(new Audio(clickSound));
  //const audio2Ref = useRef(new Audio(whooshSound));
  const audio3Ref = useRef(new Audio(openSetting));


  const checkSubmit = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let textarea = textareaRef.current;

    socket.emit('send message', {
      user: fullName,
      text: textarea.value,
    });

    dispatch({
      type: 'newmessage',
      message: {
        type: 'primary',
        user: fullName,
        text: textarea.value,
      },
    });
    audioRef.current.play();
    textarea.value = '';
    // Play the sound
    
  };
  const toggleRobot = () => {
    setIsRobotOn(!isRobotOn);
    audio1Ref.current.play();
  };
  const handleOptionClick = (option) => {
    audio1Ref.current.play();
    setShowOptions(false);

    if (option === 'Note') {
      // Handle the Note button click
      setShowNoteModal(true);
      setNoteContent(''); // Set your note content here
    } 
    if (option === 'Location') {
      // Handle the Location button click
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          // Get the current value of the textarea
          const currentValue = textareaRef.current.value;
  
          // Append the location link to the textarea
          textareaRef.current.value = currentValue
            ? `${currentValue}\n${locationLink}`
            : locationLink;
  
          // Set focus to the textarea
          textareaRef.current.focus();
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    }
    else {
      // Handle other options
      // ...
    }
  };
  const closeNoteModal = () => {
    setShowNoteModal(false);
  };

  return (
    <>
      <div className="column is-paddingless">
        <textarea
          ref={textareaRef}
          autoFocus={true}
          className="textarea is-shadowless scrollable-content"
          rows="2"
          placeholder="Type a message"
          onKeyDown={checkSubmit} required
        ></textarea>

      <div class="containerswitch">
                  <label class="switch"><input type="checkbox" onChange={toggleRobot}/>    <div>
                  <label class="robot">{isRobotOn ? 'Robot Off' : 'Robot On'}</label>
                  </div>
                  </label>
                  
                </div>

            </div>

      <div className="column is-2-mobile is-1-tablet is-paddingless">
        <div className="dropdown-wrapper">

          
        <div className="button-tooltip">
          <button 
            className="button is-medium is-paddingless is-white"
            onClick={() => setShowOptions(!showOptions)}
          >
            <i className="far fa-plus" onClick={() => audio3Ref.current.play()}></i>
            <div className="tooltip">More Settings</div>
          </button>
        </div>


          {/* Dropdown Popup for Options */}
          {showOptions && (
            <div className="dropdown-options">
              <div className="options-group">
                <button className="dropdown-option" onClick={() => handleOptionClick('Idea')}>
                <i class="fa fa-lightbulb" aria-hidden="true"></i>  Idea
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Price')}>
                <i class="fa fa-inr" aria-hidden="true"></i>  Price request
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Transfer')}>
                <i class="fa fa-comments" aria-hidden="true"></i>  Transfer this chat
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Invite')}>
                <i class="fa fa-user-plus" aria-hidden="true"></i>  Invite other
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Email')}>
                <i class="fa fa-envelope" aria-hidden="true"></i>  Email Chat
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Knowledge')}>
                <i class="fa fa-book" aria-hidden="true"></i> Knowledge base
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Estimate')}>
                <i class="fa fa-archive" aria-hidden="true"></i> New Estimate
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Block')}>
                <i class="fa fa-lock" aria-hidden="true"></i> Block user
                </button>
              </div>
              <div className="options-group">
                <button className="dropdown-option" onClick={() => handleOptionClick('Lead')}>
                <i class="fa fa-flag" aria-hidden="true"></i>  New lead
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Deal')}>
                <i class="fa fa-handshake" aria-hidden="true"></i> New deal
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Task')}>
                <i class="fa fa-thumb-tack" aria-hidden="true"></i> New task
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Sales')}>
                <i class="fa fa-balance-scale" aria-hidden="true"></i> Add sales visit
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Call')}>
                <i class="fa fa-phone" aria-hidden="true"></i> Add call reminder
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Location')}>
                <i class="fa fa-map-marker" aria-hidden="true"></i> Share location
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('URL')}>
                 <i class="fa fa-globe" aria-hidden="true"></i> Share URL
                </button>
                <button className="dropdown-option" onClick={() => handleOptionClick('Note')}>
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Note
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="button-tooltip">
          <button 
            className="button is-medium is-paddingless is-white"
            onClick={handleSubmit}
          >
            <i className="far fa-paper-plane"></i>
            <div className="tooltip">Send Message</div>
          </button>
        </div>

      </div>
      {/* Render the NoteModal when showNoteModal is true */}
      {showNoteModal && (
        <NoteModal onClose={closeNoteModal} noteContent={noteContent} />
      )}
    </>
  );
}

export default MessageForm;
