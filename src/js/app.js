import { List } from './list';

let data = JSON.parse(localStorage.getItem('data')) || [];

let listNode = document.querySelector('#noteList');
let list = new List(listNode);

console.log(data);

list.render(data);

//-------------------------------------------------------

// import Note from './note.js';

// let data = JSON.parse(localStorage.getItem('data')) || [];

// const yourNote = new Note();
// yourNote.createNoteList(data);
