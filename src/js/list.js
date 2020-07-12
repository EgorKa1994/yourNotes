import { Content } from './content';

export class List {
  constructor(container) {
    this.container = container;
    this.oneNoteContent = document.querySelector('#oneNoteContent');
    this.content = new Content(this.oneNoteContent);

    this.noteId = null;

    this.data = [];

    this._init();
  }

  _init() {
    // Выбор определенной заметки
    this.container.addEventListener(
      'click',
      this._handleChoosenNote.bind(this)
    );
  }

  _handleChoosenNote(e) {
    // если это не добавить, не сохраняются данные this.data
    // this.data = JSON.parse(localStorage.getItem('data'));

    // Удаление разметки
    let arrOfNotes = this.container.querySelectorAll('li');
    arrOfNotes.forEach((item) => {
      item.classList.remove('active');
    });

    // Добавление разметки
    if (!e.target.hasAttribute('id')) {
      this.noteId = e.target.parentNode.getAttribute('id');
    } else {
      this.noteId = e.target.getAttribute('id');
    }

    let choosenLi = document.getElementById(this.noteId);
    choosenLi.classList.add('active');
    localStorage.setItem('choosenNoteId', this.noteId);
    // Добавление описания заметки

    fetch('http://localhost:8080/api/data', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        data.list.forEach((item) => {
          if (this.noteId == item.id) {
            this.content.render(item, this.render.bind(this));
          }
        });
      })
      .catch((error) => console.error(error));
  }

  render(data) {
    this.data = data;
    this.container.innerHTML = '';

    data.forEach((item) => {
      let template = `<li id=${item.id}>
      <h3>${item.title}</h3>
      <div>${item.time}</div>
      </li>`;

      this.container.innerHTML = this.container.innerHTML + template;
    });

    let activeItemId = Number(localStorage.getItem('choosenNoteId'));
    if (activeItemId) {
      let choosenLi = document.getElementById(this.noteId);
      choosenLi.classList.add('active');
      // this.data.forEach((item) => {
      //   if (activeItemId == item.id) {
      //     this.content.render(item, this.render.bind(this));
      //   }
      // });
      fetch('http://localhost:8080/api/data', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          data.list.forEach((item) => {
            if (this.noteId == item.id) {
              this.content.render(item, this.render.bind(this));
            }
          });
        })
        .catch((error) => console.error(error));
    }
  }
}
