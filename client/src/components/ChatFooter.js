import React from 'react';
import Status from './Status';

function ChatFooter() {
  return (
    <footer className="columns">
      <div className="column is-hidden-mobile has-text-left">
        <small>&copy; {new Date().getFullYear()} - Yogesh Jha <a href="https://bizency.com/" target="_blank" rel="noopener noreferrer" className="has-text-white">( Bizency )</a></small>
      </div>
      <div className="column has-text-right-tablet has-text-centered">
        <Status />
      </div>
    </footer>
  );
}

export default ChatFooter;
