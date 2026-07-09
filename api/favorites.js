import fs from "fs";
import path from "path";

const favoritesFile = path.resolve("./data/favorites.json");

function ensureFile() {
    const dir = path.dirname(favoritesFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(favoritesFile)) {
        fs.writeFileSync(favoritesFile, JSON.stringify({ favorites: [] }, null, 2));
    }
}

function readFavorites() {
    ensureFile();
    const raw = fs.readFileSync(favoritesFile, "utf8");
    return JSON.parse(raw);
}

function writeFavorites(data) {
    ensureFile();
    fs.writeFileSync(favoritesFile, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const data = readFavorites();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: "Unable to load favorites" });
        }
        return;
    }

    if (req.method === "POST") {
        try {
            const body = req.body || {};
            if (body.password !== process.env.VITE_FAVORITES_ADMIN_KEY && body.password !== "alexis-favorites-2026") {
                res.status(403).json({ error: "Only the owner can edit favorite songs" });
                return;
            }

            const data = readFavorites();
            data.favorites = Array.isArray(body.tracks) ? body.tracks : [];
            writeFavorites(data);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: "Unable to save favorites" });
        }
        return;
    }

    res.status(405).json({ error: "Method not allowed" });
}
