import { JWTService } from "../services/jwt.service.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

function authorize(requiredRole = null) {
  const jwtService = new JWTService();

  return (req, _, next) => {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader?.startsWith("Bearer ")) {
        throw new UnauthorizedException("Authentication required");
      }

      const token = authorizationHeader.split(" ")[1];
      const decoded = jwtService.validateToken(token, process.env.JWT_SECRET);

      if (requiredRole && decoded.role !== requiredRole) {
        throw new UnauthorizedException("Insufficient permissions");
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export { authorize };
