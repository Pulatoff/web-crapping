const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const PORT = 8000;
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
const mongoose = require("mongoose");
const models = require("./model/malModel");
const fs = require("fs");
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
let dataObj;
const results = [];

async function get() {
  const array = await axios(url).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    let a = 0;
    let b = 0;
    $(".news", html).each(function () {
      const news__img = $(this).find("img").attr("src");
      const titleUrl = $(this).find(".news__title").attr("href");
      const urlcha = "https://kun.uz" + titleUrl;
      const title = $(this).find(".news__title").text();
      dataObj = {
        id: a,
        newImg: news__img,
        title: title,
        newsUrl: urlcha,
        newsParagraph: [],
      };
      a++;
      results.push(dataObj);
    });
    return results;
  });

  array.forEach((element, index) => {
    axios(element.newsUrl).then((res) => {
      const html1 = res.data;
      const $$ = cheerio.load(html1);
      $$(".single-content").each(function () {
        const datas = $$(this).find("p").text();
        element.newsParagraph.push(datas);
      });
    });
  });
  console.log(array);
}
get();

app.listen(PORT, () => {
  console.log(`server works on ${PORT} port`);
});
