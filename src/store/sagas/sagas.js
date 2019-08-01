import * as actions from "../actions/action-types";
import {
  getArticlesFail,
  getArticlesStart,
  getArticlesSuccess,
  getArticlesNextPageSuccess,
  getArticlesNextPageStart,
  getArticlesNextPageFail,
  clearArticlesStart,
  clearArticlesSuccess
} from "../actions/actions";

import { put, takeEvery } from "@redux-saga/core/effects";
import axios from "axios";

export function* getArticlesSaga(action) {
  yield put(getArticlesStart());

  try {
    const articles = yield axios.get(
      "https://content.guardianapis.com/search?show-fields=starRating,sectionName,headline,webPublicationDate,trailText,thumbnail,short-url&page-size=50&show-tags=contributor&api-key=" +
        process.env.REACT_APP_API_KEY
    );
    yield put(
      getArticlesSuccess(
        articles.data.response.results,
        articles.data.response.pages
      )
    );
  } catch (err) {
    yield put(getArticlesFail(err));
  }
}

export function* getArticlesSearchSaga(action) {
  yield put(getArticlesStart());
  const page = action.page ? action.page : 1;
  const pageSize = action.pageSize ? action.pageSize : 50;

  try {
    const articles = yield axios.get(
      "https://content.guardianapis.com/search?q=" +
        action.query +
        "page=" +
        page +
        "&" +
        "page-size=" +
        pageSize +
        "&" +
        "show-fields=starRating,headline,trailText,thumbnail,sectionName,webPublicationDate,short-url&show-tags=contributor&api-key=" +
        process.env.REACT_APP_API_KEY
    );
    yield put(
      getArticlesSuccess(
        articles.data.response.results,
        articles.data.response.pages
      )
    );
  } catch (err) {
    yield put(getArticlesFail(err));
  }
}

export function* watchArticles() {
  yield takeEvery(actions.GET_ARTICLES_SEARCH, getArticlesSearchSaga);
  yield takeEvery(actions.GET_ARTICLES_INIT, getArticlesSaga);
  yield takeEvery(actions.GET_NEXT_PAGE_ARTICLES, getArticlesNextPageSaga);
  yield takeEvery(actions.CLEAR_ARTICLES, clearArticlesSaga);
}

export function* clearArticlesSaga(action) {
  yield put(clearArticlesStart());
  yield put(clearArticlesSuccess());
}

export function* getArticlesNextPageSaga(action) {
  yield put(getArticlesNextPageStart());
  const query = action.query ? action.query : null;
  const currentPage =
    action.pages > action.currentPage
      ? action.currentPage + 1
      : action.currentPage;
  try {
    if (action.pages > action.currentPage) {
      const articles = yield axios.get(
        "https://content.guardianapis.com/search?q=" +
          query +
          "&page=" +
          currentPage +
          "&page-size=50&" +
          "show-fields=starRating,headline,trailText,thumbnail,webPublicationDate,sectionName,short-url&show-tags=contributor&api-key=" +
          process.env.REACT_APP_API_KEY
      );

      yield put(
        getArticlesNextPageSuccess(articles.data.response.results, currentPage)
      );
    }
  } catch (err) {
    yield put(getArticlesNextPageFail(err));
  }
}
