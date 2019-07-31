import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getArticles,
  getArticlesSearch,
  clearArticles
} from "../../store/actions/actions";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Header from "../header/header";
import { Container } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import styles from "./frontPage.module.css";
import { Article } from "../article/article";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const FrontPage = props => {
  const [query, setQuery] = useState("");

  const searchArticle = event => {
    setQuery(event.target.value);
    if (event.target.value.trim().length === 0) {
      props.clearArticles();
    }
    else { 
      props.getSearchArticles(query + "&");
  }
  };

  const getLatestNews = () => {
    setQuery("");
    props.getArticles();
  };

  const articles = props.articles
    ? props.articles.map(article => {
        return (
          <Grid   key={article.id + 1} item xs={3}>
            <Article
              className={styles.Article}
              type={article.type}
              webTitle={article.webTitle}
            
              webUrl={article.webUrl}
              img={article.fields.thumbnail}
              headline={article.fields.headline}
              body={article.fields.trailText}
            />
          </Grid>
        );
      })
    : null;

  const body = props.loading ? (
    <CircularProgress />
  ) : (
    <Grid container spacing={3}>
      {articles}
    </Grid>
  );
  return (
    <Container style={{ bakgroundColor: "#eae8e3" }} maxWidth="xl">
      <br />
      <Container className={styles.Header} maxWidth="xl">
        <Header />
      </Container>
      <Divider variant="middle" />
      <Container maxWidth="lg">
        <Input
          fullWidth
          className={styles.searchInput}
          defaultValue={query}
          inputProps={{
            "aria-label": "description"
          }}
          onChange={event => searchArticle(event)}
          placeholder="Enter your search query..."
        />
      </Container>
      <Button variant="outlined" onClick={getLatestNews}>
        Get the Latest News
      </Button>
      <br />
      <br />
      <br />
      {body}
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    articles: state.articles,
    loading: state.loading
  };
};

const mapActionsToProps = dispatch => {
  return {
    getArticles: () => dispatch(getArticles()),
    getSearchArticles: query => dispatch(getArticlesSearch(query)),
    clearArticles: () => dispatch(clearArticles())
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(FrontPage);
