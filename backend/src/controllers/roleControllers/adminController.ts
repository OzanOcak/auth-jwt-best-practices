import { Request, Response } from "express";
import { getAllUsers } from "../featureControllers/getAllUsers";
import { getUserProfile } from "../featureControllers/getProfile";

export const admin = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await getAllUsers(req, res); // this sends res
    const profile = await getUserProfile(req, res); // this sends res too, admin also sends res. multiple headers res error.

    //
    //res.status(200).json({users: allUsers,profile: profile});
  } catch (error) {
    console.error("Error fetching editor data:", error);
    if (!res.headersSent) {
      // Check if headers have already been sent
      res.status(500).json({ message: "Error fetching data" });
    }
  }
};
