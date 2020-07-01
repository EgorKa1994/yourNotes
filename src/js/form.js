import { List } from './list';

export class Form {
  constructor(form) {
    this.form = form;
    this.inputTitle = document.querySelector('#title');
    this.inputContain = document.querySelector('#contain');

    this.idCounter = localStorage.getItem('id') || 0;
    this.data = JSON.parse(localStorage.getItem('data')) || [];

    this.closeButton = document.querySelector('#closeModal');

    this.noteList = document.querySelector('#noteList');
    this.oneNoteContent = document.querySelector('#oneNoteContent');
    this.noteEditor = document.querySelector('.contentEditor');
    this.list = new List(this.noteList);

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

    // Получение данных о времени
    let timeData = this._getDate();

    // Проверка: редактирование или добавление заметки
    if (!this.oneNoteContent.classList.contains('underEdition')) {
      this.data.push({
        title: this.inputTitle.value,
        content: this.inputContain.value,
        time: timeData,
        id: this.idCounter,
      });

      ++this.idCounter;
      localStorage.setItem('id', this.idCounter);
    } else {
      // Поиск заметки по Id и ее изменение
      this.data.forEach((item, index) => {
        if (this.noteId == item.id) {
          this.data[index].title = this.inputTitle.value;
          this.data[index].content = this.inputContain.value;
        }
      });
    }

    this.oneNoteContent.classList.remove('underEdition');

    localStorage.setItem('data', JSON.stringify(this.data));

    this.list.render(this.data);

    this._checkEmptinessOfNoteDescription();

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

  _checkEmptinessOfNoteDescription() {
    if (!this.oneNoteContent.innerHTML) {
      this.noteEditor.classList.add('invisible');
    } else {
      this.noteEditor.classList.remove('invisible');
    }
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

    let month = this._parseNumber(now.getMonth());
    let year = now.getFullYear();
    let day = this._parseNumber(now.getDate());

    let hours = this._parseNumber(now.getHours());
    let minutes = this._parseNumber(now.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
}
