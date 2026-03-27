import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Transit Data Shell
  const transitData = {
    buses: [
      { id: "42", route: "Nigdi → Swargate", status: "GREEN", eta: 7 },
      { id: "17", route: "Pimpri → Shivajinagar", status: "GREEN", eta: 4 },
      { id: "88", route: "Wakad → Hinjewadi", status: "YELLOW", eta: 11 },
      { id: "05", route: "Chinchwad → Katraj", status: "RED", eta: 18 },
    ],
    alerts: [
      "BUS-33 breakdown reported — alternate via BUS-61",
      "Slight delay – traffic on FC Road",
    ]
  };

  // API Routes
  app.get("/api/transit", (req, res) => {
    res.json(transitData);
  });

  app.post("/api/report", (req, res) => {
    console.log("New Incident Report:", req.body);
    res.status(201).json({ status: "Report received securely" });
  });

  app.post("/api/sos", (req, res) => {
    console.log("EMERGENCY SOS RECEIVED:", req.body);
    res.status(201).json({ status: "Emergency services dispatched" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CODE_RED Server running at http://localhost:${PORT}`);
  });
}

startServer();
