const supertest = require("supertest");
const server = require("../server");
const db = require("../../database/dbConfig.js");
const baseEndPoint = "/api/auth";

describe("POST api/auth/register", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  it("adds a new user to an empty db", async () => {
    const users = await db("users");
    expect(users).toHaveLength(0);

    await supertest(server)
      .post(`${baseEndPoint}/register`)
      .send({ username: "nic", password: "password" });

    const newUsers = await db("users");
    expect(newUsers).toHaveLength(1);
  });

  it("returns 201 OK when user is created successfully", async () => {
    const res = await supertest(server)
      .post(`${baseEndPoint}/register`)
      .send({ username: "nic", password: "password" });

    expect(res.status).toBe(201);
  });

  it("returns 400 when user is not created due to no username", async () => {
    const res = await supertest(server)
      .post(`${baseEndPoint}/register`)
      .send({ password: "password" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when user is not created due to no password", async () => {
    const res = await supertest(server)
      .post(`${baseEndPoint}/register`)
      .send({ username: "nic" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when user creation failed due to no password+username", async () => {
    const res = await supertest(server).post(`${baseEndPoint}/register`).send();

    expect(res.status).toBe(400);
  });
});

describe("POST api/auth/login", () => {
  it("returns 400 when no username is provided", async () => {
    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ password: "pass" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when no password is provided", async () => {
    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "pass" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when no password + no username is provided", async () => {
    const res = await supertest(server).post("/api/auth/login").send({});

    expect(res.status).toBe(400);
  });

  it("returns 200 OK when logging in successfully", async () => {
    await supertest(server)
      .post("/api/auth/register")
      .send({ username: "nic", password: "password" });

    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "nic", password: "password" });

    expect(res.status).toBe(200);
  });

  it("returns json object when login is successful", async () => {
    await supertest(server)
      .post("/api/auth/register")
      .send({ username: "nic", password: "password" });

    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "nic", password: "password" });

    expect(res.body.message).toBe("Welcome to our API...");
  });

  it("returns jwt token when login is successful", async () => {
    await supertest(server)
      .post("/api/auth/register")
      .send({ username: "nic", password: "password" });

    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "nic", password: "password" });

    expect(res.body.token).not.toBeNull();
  });
});
