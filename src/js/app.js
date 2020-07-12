import { List } from './list';
import { Form } from './form';

localStorage.setItem('choosenNoteId', null); // Обнулить ид выбранной заметки в списке

const formNode = document.querySelector('form');
new Form(formNode);

const addBtn = document.querySelector('#addNote');
addBtn.addEventListener('click', () => {
  $('#formModal').modal('show');
});

const listNode = document.querySelector('#noteList');
const list = new List(listNode);

fetch('http://localhost:8080/api/data', { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    list.render(data.list);
  })
  .catch((error) => console.error(error));
