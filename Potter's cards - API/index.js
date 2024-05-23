import express from "express";
import router from "./routes/start.js";
import cors from "cors";
import bodyParser from "body-parser";
import ip from "ip";
import prisma from "./config/prisma.js";



const app = express();

let lastHouseVisited = "Gryffindor";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.get("/", (req, res) => {
  res.json({ message: lastHouseVisited });
});

app.post("/", (req, res) => {
  lastHouseVisited = req.body.house;
  res.json({ message: lastHouseVisited });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", { email, password });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.password === password) {
      console.log("User authenticated", { userId: user.id });
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          ownedCards: user.ownedCards,
        },
        token: "dummy-token",
      });
    } else {
      console.log("Authentication failed");
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
}); 




app.listen(3000, () => {
  console.log("Server run : http://" + ip.address() + ":3000");
});
