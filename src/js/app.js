import { List } from './list';

let data = JSON.parse(localStorage.getItem('data')) || [];

let listNode = document.querySelector('#noteList');
let list = new List(listNode);

list.render(data);
