
import express from "express";
const router = express.Router();

import Mangasee from "../scrapers/mangasee";
import { setMangaProgress } from "../util/getMangaProgress";
import getReading from "../util/getReading";
import db from "../db";

router.get("/", async (req, res) => {
	
	let host = req.headers.host; // localhost:8080
	let protocol = req.headers.referer.split(":")[0];
	let url = `${protocol}://${host}/`;
	db.set("other.host", url).write();

	// Get popular manga
	let popular = await Mangasee.search("", {
		resultCount: 20
	}); // Empty search sorts by popular

	// Set progress for popular manga
	await Promise.all(popular.map(setMangaProgress));

	let reading = await getReading();

	res.render("home", {
		popular,
		reading
	});
});

export default router;