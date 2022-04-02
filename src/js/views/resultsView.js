import View from "./View";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recepies found for your query! Please try again :)";
  _succesMessage;

  _generateMarkup() {
    return this._data.map(this._generateMarkupPrewiev).join("");
  }

  _generateMarkupPrewiev(results) {
    return `
    <li class="preview">
      <a class="preview__link " href="#${results.id}">
        <figure class="preview__fig">
          <img src="${results.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${results.title}</h4>
          <p class="preview__publisher">${results.publisher}</p>
   
        </div>
      </a>
    </li>
  `;
  }
}

export default new ResultsView();
