import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";
import { RES_PER_PAGE } from "./config.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    // set page = 1 default value
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥`);
    // Throw new error // Approve it to catch in another place where is imported this function
    throw err;
  }
};

export const loadSerchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    // console.log(data);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err}💥💥💥`);
    throw err;
  }
};

// set page number to 1, default
export const getSearchResultsPage = function (page = state.search.page) {
  // It's important for part where we want to change pages
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};
