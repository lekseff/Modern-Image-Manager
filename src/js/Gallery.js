/* eslint-disable class-methods-use-this */
export default class Gallery {
  constructor(container) {
    this.container = container;
    this.form = this.container.querySelector('#form');
    this.collection = this.container.querySelector('#view');
    this.dragZone = this.container.querySelector('.drag-zone');
    this.errorMessage = this.container.querySelector('.error');

    this.registerEvents();
  }

  /**
   * Регистрирует обработчики событий
   */
  registerEvents() {
    this.fileLoad = this.container.querySelector('#input-file');
    this.fileLoad.addEventListener('change', this.fileOnLoad.bind(this));
    this.dragZone.addEventListener('dragover', this.dragOvHandler.bind(this));
    this.dragZone.addEventListener('drop', this.dropHandler.bind(this));
    this.dragZone.addEventListener('click', this.clickHandler.bind(this));
    this.collection.addEventListener('click', Gallery.remove);
  }

  /**
   * Создаем возможность DnD, проверка, что  элемент на зоной сбрасывания
   * @param {*} event - event
   */
  dragOvHandler(event) {
    event.preventDefault();
  }

  /**
   * Обработка drop файла
   * @param {*} event - event
   * @returns - выходим если файл не изображение
   */
  dropHandler(event) {
    event.preventDefault();
    const file = Array.from(event.dataTransfer.files)[0];
    // Проверка файла
    if (this.validateFile(file)) return;
    const prevUrl = URL.createObjectURL(file);
    this.showImages(prevUrl);
  }

  /**
   * Обработка события выбора файла
   * @param {*} event - event
   * @returns - выходим если файл не изображение
   */
  fileOnLoad(event) {
    event.preventDefault();
    const file = Array.from(event.currentTarget.files)[0];
    // Проверка файла
    if (this.validateFile(file)) return;
    const prevUrl = URL.createObjectURL(file);
    this.container.querySelector('#input-file').value = '';
    this.showImages(prevUrl);
  }

  /**
   * Обработка клика по блоку drag и передача на input
   * @param {*} event - event
   */
  clickHandler(event) {
    event.preventDefault();
    this.fileLoad.dispatchEvent(new MouseEvent('click'));
  }

  /**
   * Проверка загружаемого файла
   * @param {*} file - объект file из event
   * @returns true - не пройдена, false - пройдена
   */
  validateFile(file) {
    if (!file.type.startsWith('image/')) {
      this.showError();
      return true;
    }
    return false;
  }

  /**
   * Отображает элемент на странице
   * @param {*} url - ссылка на загруженный элемент
   */
  showImages(url) {
    const el = this.renderElement(url);
    this.collection.append(el);
  }

  /**
   * Создает элемент
   * @param {*} url - ссылка на загружаемый объект
   */
  renderElement(url) {
    const viewItem = document.createElement('div');
    viewItem.classList.add('view__item');

    const viewItemImages = document.createElement('div');
    viewItemImages.classList.add('view__item-images');

    const img = document.createElement('img');
    img.src = url;
    img.addEventListener('load', () => {
      URL.revokeObjectURL(url);
    });

    const viewItemRemove = document.createElement('button');
    viewItemRemove.classList.add('view__item-remove');

    viewItemImages.append(img);
    viewItem.append(viewItemImages);
    viewItem.append(viewItemRemove);

    return viewItem;
  }

  /**
   * Удаляет элемент
   * @param {*} event  - Event
   */
  static remove(event) {
    const element = event.target;
    if (element.classList.contains('view__item-remove')) {
      element.closest('.view__item').remove();
    }
  }

  /**
   * Показывает сообщение об ошибке
   */
  showError() {
    this.errorMessage.classList.add('active');
    setTimeout(() => {
      this.errorMessage.classList.remove('active');
    }, 2000);
  }
}
