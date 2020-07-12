import { List } from './list';
import { Form } from './form';

localStorage.setItem('choosenNoteId', null); // Обнулить ид выбранной заметки в списке

let formNode = document.querySelector('form');
new Form(formNode);

let addBtn = document.querySelector('#addNote');
addBtn.addEventListener('click', () => {
  $('#formModal').modal('show');
});

let listNode = document.querySelector('#noteList');
let list = new List(listNode);

fetch('http://localhost:8080/api/data', { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    list.render(data.list);
  })
  .catch((error) => console.error(error));
