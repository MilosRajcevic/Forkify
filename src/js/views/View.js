export default class View {
  _data;
  //jsdoc.app
  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data The data to be rendered(e.g recipe)
   * @param {boolean} {render=true} If false, cretea markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=falase
   * @this {Object} View instance
   * @author Milos Rajcevic
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   *
   * @param {*} data
   */

  update(data) {
    this._data = data;
    // Kreiramo novi markap i uporedjujemo sa starim markapom, isamo promenimo text i atribute stare verzije sa novom
    const newMarkup = this._generateMarkup();

    // "Kreiramo dom koji zivi u virtuelnoj memoriji"
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // console.log("😕", newEl.firstChild.nodeValue);
        curEl.textContent = newEl.textContent;
      }

      // Updates changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
  <div class="spinner">
    <svg>
      <use href="../assets/icons.svg#icon-loader"></use>
    </svg>
  </div>
  `;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterBegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
         <div class="error">
            <div>
              <svg>
                <use href="../assets/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._succesMessage) {
    const markup = `
         <div class="message">
            <div>
              <svg>
              <use href="../assets/icons.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
