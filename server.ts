import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

const startServer = async () => {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json());

  // API Route for Jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const q = req.query.q as string || "Data Engineer";
      const location = req.query.location as string || "";

      const apiKey = process.env.RAPIDAPI_KEY || "41e9c83284msh58530564f0bed38p19b300jsn6922bc7ecde5";
      const apiHost = process.env.RAPIDAPI_HOST || "active-jobs-db.p.rapidapi.com";
      
      console.log(`Using RapidAPI key. Host: ${apiHost}`);
      
      const titleFilter = encodeURIComponent(`"${q}"`);
      const locationFilter = location ? encodeURIComponent(`"${location}"`) : "";
      
      let url = `https://${apiHost}/active-ats-1h?offset=0&title_filter=${titleFilter}&description_type=text`;
      if (locationFilter) {
        url += `&location_filter=${locationFilter}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RapidAPI responded with ${response.status}: ${errorText}`);
      }

      const jobs = await response.json();
      res.json({ jobs: Array.isArray(jobs) ? jobs : [] });
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: error.message || "Failed to fetch jobs from RapidAPI" });
    }
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer();
