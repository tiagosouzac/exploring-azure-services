import jwt from "jsonwebtoken";

class JWTService {
  generateToken(payload, secret, options = {}) {
    return jwt.sign(payload, secret, options);
  }

  validateToken(token, secret) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export { JWTService };
