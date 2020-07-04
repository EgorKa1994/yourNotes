import { List } from './list';
import { Form } from './form';

let data = JSON.parse(localStorage.getItem('data')) || [];

let formNode = document.querySelector('form');
new Form(formNode);

let listNode = document.querySelector('#noteList');
let list = new List(listNode);

list.render(data);

//-------------------------------------------------------

// import Note from './note.js';

// let data = JSON.parse(localStorage.getItem('data')) || [];

// const yourNote = new Note();
// yourNote.createNoteList(data);
