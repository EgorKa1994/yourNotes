import { List } from './list';
import { Form } from './form';

let data = JSON.parse(localStorage.getItem('data')) || [];

let listNode = document.querySelector('#noteList');
let list = new List(listNode);

list.render(data);

//-------------------------------------------------------
