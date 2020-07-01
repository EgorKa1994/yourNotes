import Note from './note.js';

let data = JSON.parse(localStorage.getItem('data')) || [];

const yourNote = new Note();
yourNote.createNoteList(data);
