import { List } from './list';
import { Content } from './content';
// import { response } from 'express';

export class Form {
  constructor(form) {
    this.form = form;
    this.inputTitle = document.querySelector('#title');
    this.inputContain = document.querySelector('#contain');

    this.idCounter = localStorage.getItem('id') || 0;
    // this.data = [];

    this.closeButton = document.querySelector('#closeModal');

    this.noteList = document.querySelector('#noteList');
    this.oneNoteContent = document.querySelector('#oneNoteContent');
    this.noteEditor = document.querySelector('.contentEditor');
    this.list = new List(this.noteList);

    this.oneNoteContent = document.querySelector('#oneNoteContent');
    this.content = new Content(this.oneNoteContent);

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

    // let data = JSON.parse(localStorage.getItem('data')) || [];

    // Получение данных о времени
    let timeData = this._getDate();

    let noteId = localStorage.getItem('choosenNoteId');
    let elem = {};
    // Проверка: редактирование или добавление заметки
    if (!this.oneNoteContent.classList.contains('underEdition')) {
      // data.push({
      //   // title: this.inputTitle.value,
      //   // content: this.inputContain.value,
      //   time: timeData,
      //   id: this.idCounter,
      // });

      let formDa = new FormData(this.form);
      for (let [name, value] of formDa) {
        elem[name] = value;
      }
      elem.time = timeData;
      elem.id = this.idCounter;

      ++this.idCounter;
      localStorage.setItem('id', this.idCounter);

      console.log(elem);
      console.log(JSON.stringify(elem));
    }
    // else {
    //   // Поиск заметки по Id и ее изменение
    //   data.forEach((item, index) => {
    //     if (noteId == item.id) {
    //       data[index].title = this.inputTitle.value;
    //       data[index].content = this.inputContain.value;
    //       this.content.render(item, null, data);
    //     }
    //   });
    // }

    this.oneNoteContent.classList.remove('underEdition');

    fetch('http://localhost:8080/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(elem),
    })
      .then((response) => response.json())
      .then((data) => this.list.render(data.list))
      .catch((error) => console.error(error));

    // localStorage.setItem('data', JSON.stringify(data));

    // this.list.render(data);

    let choosenNote = document.getElementById(noteId);
    if (choosenNote) choosenNote.classList.add('active');

    this._resetForm(this.form);

    $('#exampleModal').modal('hide');
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
}
