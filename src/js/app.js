import { List } from './list';
import { Form } from './form';

// let data = JSON.parse(localStorage.getItem('data')) || [];
localStorage.setItem('choosenNoteId', null); // Обнулить ид выбранной заметки

let formNode = document.querySelector('form');
new Form(formNode);

let listNode = document.querySelector('#noteList');
let list = new List(listNode);

fetch('http://localhost:8080/api/data', { method: 'GET' })
  .then((response) => response.json())
  .then((data) => list.render(data.list))
  .catch((error) => console.error(error));

// list.render(data);

//-------------------------------------------------------

// import Note from './note.js';

// let data = JSON.parse(localStorage.getItem('data')) || [];

// const yourNote = new Note();
// yourNote.createNoteList(data);
