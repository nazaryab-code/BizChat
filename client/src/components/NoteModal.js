// NoteModal.js
import React, { useState, useEffect } from 'react';
import '../styles/NoteModel.css';

const NoteModal = ({ onClose, noteContent }) => {
  const [newNote, setNewNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [alert, setAlert] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSaveNote = async () => {
    if (newNote.trim() !== '') {
      try {
        const response = await fetch('http://192.168.1.50:1234/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            note: newNote,
            user: '2', // Replace with the actual current user name
            date: new Date().toISOString(), // Set date as today's date in ISO format
            status: 'active',
          }),
        });

        if (response.ok) {
          const createdNote = await response.json();
          setSavedNotes([...savedNotes, createdNote]);
          setNewNote('');

          // Show success alert
          setAlert({
            type: 'success',
            message: 'Note saved successfully!',
          });
        } else {
          console.error('Failed to save note:', response.statusText);

          // Show error alert
          setAlert({
            type: 'error',
            message: 'Failed to save note',
          });
        }
      } catch (error) {
        console.error('Error saving note:', error);

        // Show error alert
        setAlert({
          type: 'error',
          message: 'Error saving note',
        });
      }
    }
  };

  useEffect(() => {
    // Fetch notes from the API when there is a search term
    const fetchNotes = async () => {
      try {
        if (searchInput.trim() !== '') {
          const response = await fetch(`http://192.168.1.50:1234/api/notesSearch?search=${searchInput}`);
          if (response.ok) {
            const notes = await response.json();
            setSearchResults(notes);
          } else {
            console.error('Failed to fetch notes:', response.statusText);
          }
        } else {
          // Clear search results if there is no search term
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [searchInput]);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          <i id="close" className="fa fa-times-circle" aria-hidden="true"></i>
        </span>
        <div className="noteinput">
          <textarea
            id='textarea1'
            rows="4"
            cols="50"
            placeholder="Write your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <br />
          <button className="save-button" onClick={handleSaveNote}>
            <i className="fa fa-book" aria-hidden="true"></i> Save
          </button>
        </div>
        <br></br>

        {alert && (
          <div className={`alert ${alert.type}`}>
            <span className="close-alert" onClick={() => setAlert(null)}>&times;</span>
            <strong>{alert.type === 'success' ? 'Success!' : 'Error!'}</strong> {alert.message}
          </div>
        )}

        <br></br>

        <div className="search-area">
          <label htmlFor="searchNotes" className="search-label">
            Search Notes
          </label>
          <input
            type="text"
            id="searchNotes"
            placeholder="Type to search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="search-results">
            {searchResults.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.slice().reverse().map((result, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td title={result.note}>
                        {result.note.length > 20 ? `${result.note.substring(0, 20)}...` : result.note}
                      </td>
                      <td>{new Date(result.date).toLocaleString()}</td>
                      <td>{result.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
