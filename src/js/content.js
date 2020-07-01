export class Content {
  constructor(container) {
    this.container = container;

    this.data = [];
    this.noteId = null;

    this.noteEditor = document.querySelector('.contentEditor');
    this.removeButton = document.querySelector('#removeBtn');
    this.editButton = document.querySelector('#editBtn');
  }

  _handleEditingOfNote() {
    this.container.classList.add('underEdition');

    let titleField = document.querySelector('#title');
    let containField = document.querySelector('#contain');

    // Поиск по Id необходимой заметки и копирование в форму ее данных
    this.data.forEach((item) => {
      if (this.noteId == item.id) {
        titleField.value = item.title;
        containField.value = item.content;
      }
    });

    // Обновление LocalStorage
    localStorage.setItem('data', JSON.stringify(this.data));
  }

  _handleRemovingOfNote() {
    this.container.innerHTML = '';

    // Поиск по Id заметки и удаление ее из данных
    this.data.forEach((item, index) => {
      if (this.noteId == item.id) {
        this.data.splice(index, 1);
      }
    });

    // Обновление LocalStorage
    localStorage.setItem('data', JSON.stringify(this.data));

    // Скрывает или добавляет кнопки удаления или редактирования заметки
    this._checkEmptinessOfNoteDescription(this.container);

    // this.createNoteList(this.data);
  }

  render(noteInfo, data) {
    this.data = data;
    this.noteId = noteInfo.id;

    this.container.innerHTML = '';
    let template = `
    <div>${noteInfo.time}</div>
    <p>${noteInfo.content}</p>
  `;
    this.container.innerHTML = this.container.innerHTML + template;

    this._checkEmptinessOfNoteDescription(this.container);

    // Удаление заметки
    this.removeButton.addEventListener(
      'click',
      this._handleRemovingOfNote.bind(this)
    );

    // Редактирование заметки
    this.editButton.addEventListener(
      'click',
      this._handleEditingOfNote.bind(this)
    );
  }

  _checkEmptinessOfNoteDescription(containerForChecking) {
    if (!containerForChecking.innerHTML) {
      this.noteEditor.classList.add('invisible');
    } else {
      this.noteEditor.classList.remove('invisible');
    }
  }
}
