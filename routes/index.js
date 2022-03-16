// var express = require('express');
import express from "express";
const router = express.Router();
import cloudinary from "cloudinary";
import multer from "multer";
import cors from "cors";

import {
  getAllGames,
  getGameByID,
  getGameByTitle,
  getGameByGenre,
  addNewGame,
  deleteGame,
  replaceGame,
  getGameByDeveloper,
  getGameByYear,
  getGameByRating,
  getGameByBand,
  getGameBySearch,
} from "../models/functions.js";
import { cloudName, apiKey, apiSecret } from "../config.js";
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");
export { multerUploads };

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// GET ALL GAMES OR SEARCH
router.get("/games", async function (req, res) {
  const { title, rating, band, genre, year, developer, comments } = req.query;

  if (title) {
    const searchResults = await getGameByTitle(title);
    res.json({
      success: true,
      message: `Searched game titles by ${title}`,
      payload: searchResults,
    });
    return;
  }

  if (genre) {
    const searchResults = await getGameByGenre(genre);
    res.json({
      success: true,
      message: `Searched game genres by ${genre}`,
      payload: searchResults,
    });
    return;
  }

  if (developer) {
    const searchResults = await getGameByDeveloper(developer);
    res.json({
      success: true,
      message: `Searched game developers by ${developer}`,
      payload: searchResults,
    });
    return;
  }

  if (year) {
    const searchResults = await getGameByYear(year);
    res.json({
      success: true,
      message: `Searched game year by ${year}`,
      payload: searchResults,
    });
    return;
  }

  if (rating) {
    const searchResults = await getGameByRating(rating);
    res.json({
      success: true,
      message: `Searched game ratings by ${rating}`,
      payload: searchResults,
    });
    return;
  }

  if (band) {
    const searchResults = await getGameByBand(band);
    res.json({
      success: true,
      message: `Searched game rating by ${band}`,
      payload: searchResults,
    });
    return;
  }

  const games = await getAllGames();
  console.log("games", games);
  res.json({ success: true, payload: games });
});

// router.get("/games", async function (req, res, next) {
//   const { title, genre, band } = req.query;
//   const game = await getGameBySearch(title, genre, band);

//   res.json({
//     success: true,
//     payload: game,
//   });
// });

// GET GAME BY ID
router.get("/games/:id", async function (req, res) {
  const game = Number(req.params.id);
  const returnedGame = await getGameByID(game);
  res.json({ success: true, payload: returnedGame });
});

// ADD NEW GAME
router.post("/games", cors(), async function (req, res, next) {
  console.log(req);
  const { title, rating, band, genre, year, developer, comments, image } =
    req.body;

  // const imageURL = [];
  // for (let i = 0; i < image.length; i++) {
  //   const cloudinaryRes = await cloudinary.uploader.upload(image[i].base64);
  //   imageURL.push(cloudinaryRes.secure_url);
  // }

  const imageUpload = await cloudinary.uploader.upload(image[0].base64);
  const imageURL = imageUpload.secure_url;

  const newGame = await addNewGame(
    title,
    rating,
    band,
    genre,
    year,
    developer,
    comments,
    imageURL
  );
  res.json({ success: true, payload: newGame });
});

// DELETE GAME
router.delete("/games/:id", async function (req, res) {
  const game = Number(req.params.id);
  const deletedGame = await deleteGame(game);
  res.json({ success: true, payload: deletedGame });
});

// REPLACE GAME
router.put("/games/:id", async function (req, res) {
  const game = Number(req.params.id);
  const newGame = req.body;
  const update = await replaceGame(game, newGame);
  res.json({ success: true, payload: update });
});

export default router;
