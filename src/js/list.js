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
    // Удаление разметки
    this._markUpRemoving(this.container.querySelectorAll('li'));

    let target = e.target;
    this.noteId = this._getIdOfNote(target);
    // Добавление разметки
    this._markUpAddition(this.noteId);

    localStorage.setItem('choosenNoteId', this.noteId); // Запоминаем id выбранной заметки

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

  //----------------Вспомогательные функции-----------------------

  // Удаление разметки
  _markUpRemoving(noteList) {
    noteList.forEach((item) => {
      item.classList.remove('active');
    });
  }

  // Добавление разметки
  _markUpAddition(noteId) {
    let choosenLi = document.getElementById(noteId);
    choosenLi.classList.add('active');
  }

  // Получение id заметки
  _getIdOfNote(target) {
    let idOfnote;
    if (!target.hasAttribute('id')) {
      idOfnote = target.parentNode.getAttribute('id');
    } else {
      idOfnote = target.getAttribute('id');
    }
    return idOfnote;
  }

  //--------------------------------------------------------

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
      this._markUpAddition(activeItemId);

      fetch('http://localhost:8080/api/data', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          data.list.forEach((item) => {
            if (activeItemId == item.id) {
              this.content.render(item, this.render.bind(this));
            }
          });
        })
        .catch((error) => console.error(error));
    }
  }
}
