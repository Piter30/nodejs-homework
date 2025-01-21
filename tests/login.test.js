const request = require("supertest");
const { describe, beforeAll, it, expect, afterAll } = require("@jest/globals");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

describe("Login Controller", () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("password123", 8);
    await User.create({
      email: "test@test.com",
      password: hashedPassword,
    });
  });

  it("should return 200 status code and valid response structure", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "test@test.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("subscription");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });

  // Dodatkowe testy dla różnych scenariuszy
  it("should return 401 for incorrect password", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "test@test.com",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Email or password is wrong");
  });

  it("should return 401 for non-existent user", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "nonexistent@test.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Email or password is wrong");
  });

  it("should return 400 for invalid email format", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "invalidemail",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({});
  });
});
