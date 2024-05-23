import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/bcrypt.js";

class UsersController {
  getMyProfile(req, res) {
    const user = req.user;
    return res.status(200).send(user);
  }

  async getOwnedCards(req, res) {
    try {
      const userId = req.params.userId;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { ownedCards: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const ownedCards = JSON.parse(user.ownedCards || "[]");
      const ownedCardsLength = ownedCards.length;

      return res.status(200).json({ ownedCards, ownedCardsLength });
    } catch (error) {
      console.error("Erreur pr récup ownedCards:", error);
      return res.status(500).json({ error: "Erreur pr récup ownedCards:" });
    }
  }

  async addObtainedCards(req, res) {
    try {
      const userId = req.params.userId;
      let deck = req.body.deck;

      // Delete les caractères indésirables & diviser la chaîne en un array de nb
      deck = deck.replace(/\[|\]|\s/g, "");
      deck = deck.split(",").map(Number);

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { ownedCards: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingOwnedCards = JSON.parse(user.ownedCards || "[]");

      const newCardsToAdd = deck.filter(
        (card) => !existingOwnedCards.includes(card)
      );

      const updatedOwnedCards = [...existingOwnedCards, ...newCardsToAdd];

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { ownedCards: JSON.stringify(updatedOwnedCards) },
      });

      return res.status(200).json({
        message: "Cartes ajoutéese",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erreur ds l'ajout de cartes:", error);
      return res.status(500).json({ error: "Envoi des cartes raté" });
    }
  }

  async deleteOwnedCards(req, res) {
    try {
      const userId = req.params.userId;

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { ownedCards: "[]" },
      });

      return res.status(200).json({
        message: "ownedCards vidé avec succès",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erreur ds suppression ownedCards", error);
      return res
        .status(500)
        .json({ error: "Erreur ds suppression ownedCards" });
    }
  }

  async updateTimer(req, res) {
    const userId = req.params.id;
    const { timeLeft } = req.body;

    if (typeof timeLeft === "undefined") {
      return res.status(400).send("timeLeft est undefined (erreur)");
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { timer: timeLeft },
      });

      res
        .status(200)
        .send({ status: "success", userId: userId, timeLeft: timeLeft });
    } catch (error) {
      console.error("Erreur pour la maj de timer:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async getTimer(req, res) {
    const userId = req.params.id;

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { timer: true },
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.status(200).send({ timer: user.timer });
    } catch (error) {
      console.error("Erreur pr récupe le timer:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async index(req, res) {
    AuthentificationMiddleware.authentification(req, res, async () => {
      const users = await prisma.user.findMany();
      return res.status(200).send(users);
    });
  }

  async store(req, res) {
    try {
      const body = req.body;

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

      return res.status(409).send("User already exists");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async show(req, res) {
    try {
      const id = req.params.id;
      const user = await prisma.user.findFirst({
        where: {
          id: parseInt(id),
        },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const body = req.body;
      let user = await prisma.user.findFirst({
        where: {
          id: parseInt(id),
        },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      user = await prisma.user.update({
        where: {
          id: parseInt(id),
        },
        data: body,
      });

      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async destroy(req, res) {
    try {
      const id = req.params.id;
      let user = await prisma.user.findFirst({
        where: {
          id: parseInt(id),
        },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
}


export default new UsersController();
