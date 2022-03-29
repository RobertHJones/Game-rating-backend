import request from "supertest";
import app from "../app.js";

// table for testing
const game = {
  id: expect.any(Number),
  title: expect.any(String),
  rating: expect.any(Number),
  band: expect.any(String),
  genre: expect.any(String),
  year: expect.any(Number),
  developer: expect.any(String),
  comments: expect.any(String),
  image: expect.any(String),
};

describe("Testing that the games route is working as expected", () => {
  // testing the status code
  test("should return a status of 200", async () => {
    const res = await request(app).get("/games");
    expect(res.statusCode).toBe(200);
  });

  // testing the response body to ensure it returns the correct type
  test("should return the game", async () => {
    const res = await request(app).get("/games");
    const actual = res.body;
    const expected = {
      success: true,
      payload: expect.any(Array),
    };
    expect(actual).toEqual(expected);
  });

  // testing returning the correct payload
  test("should return the actual payload", async () => {
    const res = await request(app).get("/games");
    const actual = res.body;
    actual.payload.forEach((item) => {
      expect(item).toEqual(game);
    });
  });
});

// testing the post request
test("should post to the table", async () => {
  const game = {
    title: "Final Fantasy 5",
    rating: 85,
    band: "80-100",
    genre: "RPG",
    year: 1995,
    developer: "Square",
    comments: "Not as good as 6. But still good",
    image: "https://www.retrogamer.net/wp-content/uploads/2013/10/ff501.jpg",
  };
  await request(app)
    .post("/games")
    .send(game)
    .expect(200)
    .then(async (response) => {
      console.log("this is", response.body);
      expect(response.body.payload[0].id).toBeTruthy();
      expect(response.body.payload[0].title).toBe(game.title);
      expect(response.body.payload[0].rating).toBe(game.rating);
      expect(response.body.payload[0].band).toBe(game.band);
      expect(response.body.payload[0].genre).toBe(game.genre);
      expect(response.body.payload[0].developer).toBe(game.developer);
      expect(response.body.payload[0].comments).toBe(game.comments);
      expect(response.body.payload[0].image).toBe(game.image);
    });
});
