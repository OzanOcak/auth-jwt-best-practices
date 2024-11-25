import { Request, Response } from "express";
import { getUserProfile } from "../featureControllers/getUserProfile";

export const user = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await getUserProfile(req, res); // fetch editor's profile

    res.status(200).json({
      profile: profile,
    });
  } catch (error) {
    console.error("Error fetching editor data:", error);
    if (!res.headersSent) {
      // Check if headers have already been sent
      res.status(500).json({ message: "Error fetching data" });
      // Error: Cannot set headers after they are sent to the client
    }
  }
};
