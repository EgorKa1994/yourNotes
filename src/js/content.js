export class Content {
  constructor(container) {
    this.container = container;

    this.noteInfo = {};
    this.noteId = null;
    this.updateList = null;
    this.data = [];
  }

  _createTrashButton(id) {
    const btnNode = document.createElement('button');

    btnNode.classList.value = 'btn btn-outline-danger py-0';
    btnNode.textContent = 'Remove';
    btnNode.setAttribute('data-id', id);

    btnNode.addEventListener('click', this._handleRemovingOfNote.bind(this));

    return btnNode;
  }

  _createEditButton(id) {
    const btnNode = document.createElement('button');

    btnNode.classList.value = 'btn btn-outline-warning py-0';
    btnNode.textContent = 'Edit';

    btnNode.setAttribute('data-id', id);
    btnNode.setAttribute('data-toggle', 'modal');
    btnNode.setAttribute('data-target', '#exampleModal');

    btnNode.addEventListener('click', this._handleEditingOfNote.bind(this));

    return btnNode;
  }

  _handleEditingOfNote(e) {
    this.container.classList.add('underEdition');

    let idOfNote = e.currentTarget.getAttribute('data-id');

    let titleField = document.querySelector('#title');
    let containField = document.querySelector('#contain');

    // Поиск по Id необходимой заметки и копирование в форму ее данных
    this.data.forEach((item) => {
      if (idOfNote == item.id) {
        titleField.value = item.title;
        containField.value = item.content;
      }
    });

    // Обновление LocalStorage
    // localStorage.setItem('data', JSON.stringify(this.data));
  }

  _handleRemovingOfNote(e) {
    this.container.innerHTML = '';
    let idOfNote = e.currentTarget.getAttribute('data-id');
    // Поиск по Id заметки и удаление ее из данных
    this.data.forEach((item, index) => {
      if (idOfNote == item.id) {
        this.data.splice(index, 1);
      }
    });

    // Обновление LocalStorage
    localStorage.setItem('data', JSON.stringify(this.data));

    this.updateList(this.data);
  }

  render(noteInfo, updateList, data) {
    this.noteInfo = noteInfo;
    this.updateList = updateList;
    this.data = data;
    this.noteId = noteInfo.id;

    this.container.innerHTML = '';
    let template = `
    <div>${noteInfo.time}</div>
    <p>${noteInfo.content}</p>
  `;
    this.container.innerHTML = this.container.innerHTML + template;

    let noteEditor = document.createElement('div');
    noteEditor.classList.value = 'contentEditor d-flex justify-content-center';
    noteEditor.append(this._createTrashButton(this.noteId));
    noteEditor.append(this._createEditButton(this.noteId));
    this.container.append(noteEditor);
  }
}
