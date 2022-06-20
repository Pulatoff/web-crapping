const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const PORT = 8000;
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
const mongoose = require("mongoose");
const DB = process.env.DB.replace("<password>", process.env.PASSWORD);

mongoose.connect(
  DB,
  () => {
    console.log("connected to DB");
  },
  () => {
    console.log("hatto");
  }
);

const url = "https://kun.uz/news/category/uzbekiston";

axios(url).then((response) => {
  const html = response.data;
  const $ = cheerio.load(html);
  const results = [];
  let a = 0;
  let b = 0;
  $(".news", html).each(function () {
    const news__img = $(this).find("img").attr("src");
    const titleUrl = $(this).find(".news__title").attr("href");
    const urlcha = "https://kun.uz" + titleUrl;
    const title = $(this).find(".news__title").text();
    const dataObj = {
      id: a,
      newImg: news__img,
      title: title,
      newsUrl: url,
      newsParagraph: [],
    };
    a++;
    axios(urlcha).then((res) => {
      const html1 = res.data;
      const $$ = cheerio.load(html1);
      $$(".single-content").each(function () {
        const datas = $$(this).find("p").text();
        dataObj.newsParagraph.push(datas);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`server works on ${PORT} port`);
});
