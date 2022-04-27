import View from "./View";
import PreviewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recepies found for your query! Please try again :)";
  _succesMessage;

  _generateMarkup() {
    return this._data
      .map((bookmark) => PreviewView.render(bookmark, false))
      .join("");
  }
}

export default new ResultsView();
