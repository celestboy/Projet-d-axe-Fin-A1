import prisma from "../config/prisma.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword } from "../utils/bcrypt.js";

class AuthentificationController {
  async login(req, res) {
    try {
      const body = req.body;

      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      
      if (user === null) {
        return res.status(404).json({ error: "User not found" });
      }

      const isSamePassword = await comparePassword(
        body.password,
        user.password
      );

      if (isSamePassword === false) {
        return res.status(401).send("Invalid password");
      }

      const token = generateToken(user);

      return res.status(200).send({ user, token });
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }

  async register(req, res) {
    try {
      const body = req.body;
      console.log(body)

      const existingUser = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (existingUser === null) {
        const user = await prisma.user.create({
          data: {
            name: body.name,
            email: body.email,
            password: await hashPassword(body.password),
          },
        });
        return res.status(201).send(user);
      }
      
      return res.status(409).json({ error: "User already exists" });

    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
}

export default new AuthentificationController();
