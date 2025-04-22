import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };

      const result = await this.authService.register(userData);

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        status: "success",
        message: "User authenticated",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
