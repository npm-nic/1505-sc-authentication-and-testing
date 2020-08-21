const supertest = require("supertest");
const server = require("../server");

describe("/api/jokes", () => {
  it("returns 200 OK when logging in correctly", async () => {
    await supertest(server)
      .post(`/api/auth/register`)
      .send({ username: "nic", password: "password" });

    const res1 = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "nic", password: "password" });

    const token = res1.body.token;

    const res2 = await supertest(server)
      .get("/api/jokes")
      .set({ authorization: token });

    expect(res2.status).toBe(200);
  });

  it("returns jokes if user logged in", async () => {
    await supertest(server)
      .post("/api/auth/register")
      .send({ username: "nic", password: "password" });

    const res1 = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "nic", password: "password" });

    const token = res1.body.token;

    const res2 = await supertest(server)
      .get("/api/jokes")
      .set({ authorization: token });

    expect(res2.body).not.toBeNull();
  });
});
