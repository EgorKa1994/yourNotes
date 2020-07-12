import { List } from './list';
import { Content } from './content';
// import { response } from 'express';
// import { response } from 'express';

export class Form {
  constructor(form) {
    this.form = form;
    this.inputTitle = document.querySelector('#title');
    this.inputContain = document.querySelector('#contain');
    this.closeButton = document.querySelector('#closeModal');

    this.idCounter = localStorage.getItem('id') || 0; // счетчик id

    this.noteList = document.querySelector('#noteList');
    this.list = new List(this.noteList);

    this.oneNoteContent = document.querySelector('#oneNoteContent');

    this._init();
  }

  _init() {
    this.form.addEventListener('submit', this._handleSubmit.bind(this));

    this.closeButton.addEventListener(
      'click',
      this._handleCloseModal.bind(this)
    );
  }

  _handleCloseModal() {
    this.oneNoteContent.classList.remove('underEdition'); // Индикатор добавления или изменения заметки
    this._resetForm(this.form);
  }

  _handleSubmit(e) {
    e.preventDefault();
    let url = `http://localhost:8080/api/data`;

    // Получение данных о времени
    let timeData = this._getDate();

    // Проверка: редактирование или добавление заметки
    if (!this.oneNoteContent.classList.contains('underEdition')) {
      let newNoteData = this._сreateNoteData(timeData, this.idCounter); // Создание объекта

      this._editListOfNotes(url, 'POST', newNoteData);

      localStorage.setItem('id', ++this.idCounter); // Обновляем счетчик id
    } else {
      let noteId = localStorage.getItem('choosenNoteId');
      url = url + `/${noteId}`;

      let newNoteData = this._сreateNoteData(timeData, noteId); // Создание объекта

      this._editListOfNotes(url, 'PUT', newNoteData);

      this.oneNoteContent.classList.remove('underEdition');
    }

    this._resetForm(this.form);

    $('#formModal').modal('hide');
  }

  _resetForm(form) {
    form.reset();

    // Найдём все скрытые поля в форме и сбросим их значение
    [...form.querySelectorAll('[type="hidden"]')].forEach((input) => {
      input.value = '';
    });
  }

  _parseNumber(num) {
    let parsedNum = num;

    if (parsedNum < 10) {
      return '0' + parsedNum;
    } else {
      return parsedNum;
    }
  }

  _getDate() {
    let now = new Date();
    let month = this._parseNumber(now.getMonth() + 1);
    let year = now.getFullYear();
    let day = this._parseNumber(now.getDate());

    let hours = this._parseNumber(now.getHours());
    let minutes = this._parseNumber(now.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // Создание или редактирование заметки
  _editListOfNotes(url, verb, newObj) {
    fetch(url, {
      method: verb,
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(newObj),
    })
      .then((response) => response.json())
      .then((data) => this.list.render(data.list))
      .catch((error) => console.error(error));
  }

  // Создание заметки
  _сreateNoteData(time, noteId) {
    let newNote = {};
    let formDa = new FormData(this.form);
    for (let [name, value] of formDa) {
      newNote[name] = value;
    }
    newNote.time = time;
    newNote.id = noteId;
    return newNote;
  }
}
