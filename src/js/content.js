// import { response } from 'express';

export class Content {
  constructor(container) {
    this.container = container;

    this.noteInfo = {};
    this.noteId = null;
    this.updateList = null;
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
    btnNode.setAttribute('data-target', '#formModal');

    btnNode.addEventListener('click', this._handleEditingOfNote.bind(this));

    return btnNode;
  }

  _handleEditingOfNote(e) {
    this.container.classList.add('underEdition');

    const idOfNote = e.currentTarget.getAttribute('data-id');

    const titleField = document.querySelector('#title');
    const containField = document.querySelector('#contain');

    // Поиск по Id необходимой заметки и копирование в форму ее данных
    fetch('http://localhost:8080/api/data', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        data.list.forEach((item) => {
          if (item.id == idOfNote) {
            titleField.value = item.title;
            containField.value = item.contain;
            $('#formModal').modal('show');
          }
        });
      })
      .catch((error) => console.error(error));
  }

  _handleRemovingOfNote(e) {
    const idOfNote = e.currentTarget.getAttribute('data-id');
    localStorage.setItem('choosenNoteId', null); // Обнуляем id после удаления заметки

    fetch(`http://localhost:8080/api/data/${idOfNote}`, { method: 'DELETE' })
      .then((response) => response.json())
      .then((data) => {
        this.container.innerHTML = '';
        if (this.updateList) {
          this.updateList(data.list);
        }
      });
  }

  render(noteInfo, updateList) {
    this.noteInfo = noteInfo;
    this.updateList = updateList;
    this.noteId = noteInfo.id;

    this.container.innerHTML = '';
    const template = `
    <div>${noteInfo.time}</div>
    <p>${noteInfo.contain}</p>
  `;
    this.container.innerHTML = this.container.innerHTML + template;

    const noteEditor = document.createElement('div');
    noteEditor.classList.value = 'contentEditor d-flex justify-content-center';
    noteEditor.append(this._createTrashButton(this.noteId));
    noteEditor.append(this._createEditButton(this.noteId));
    this.container.append(noteEditor);
  }
}
