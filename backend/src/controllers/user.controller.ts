import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();

      res.status(200).json({
        status: "success",
        message: "Users list retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      if (req.user?.id !== userId && req.user?.role !== "ATENDENTE") {
        return res.status(403).json({
          status: "error",
          message: "You do not have permission to access this resource",
        });
      }

      const user = await this.userService.getUserById(userId);

      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
