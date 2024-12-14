const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
const port = 5000; // Define the port for the server

const cors = require("cors");

// Enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

/**
 * Extracts text content from a given URL.
 *
 * @param {string} url - The URL of the website to extract text from.
 * @returns {Promise<string>} - The extracted text content.
 */
async function extractTextFromWebsite(url) {
  console.log("[extractTextFromWebsite] Function called with URL:", url);
  if (!url) {
    console.error("[extractTextFromWebsite] Error: URL is required");
    throw new Error("URL is required");
  }

  try {
    console.log(`[extractTextFromWebsite] Fetching the webpage: ${url}`);

    // Fetch the HTML content of the website
    const response = await axios.get(url);
    const html = response.data;

    console.log("[extractTextFromWebsite] Successfully fetched HTML content");

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract textual content (ignoring scripts, styles, etc.)
    const textContent = $("body")
      .text()
      .replace(/\s+/g, " ") // Remove excessive whitespace
      .trim();

    console.log("[extractTextFromWebsite] Extracted text content successfully");

    return textContent;
  } catch (error) {
    console.error(
      `[extractTextFromWebsite] Error fetching or parsing the website: ${error.message}`
    );
    throw new Error("Failed to extract text from the website");
  }
}

// Define the /getwebsitecontent route as a POST request
app.post("/getwebsitecontent", async (req, res) => {
  console.log("[/getwebsitecontent] POST request received");
  console.log("[/getwebsitecontent] Request body:", req.body);

  const { url } = req.body; // Get the URL from the request body

  if (!url) {
    console.error(
      "[/getwebsitecontent] Error: URL is required in the request body"
    );
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    console.log(
      "[/getwebsitecontent] Calling extractTextFromWebsite with URL:",
      url
    );
    const text = await extractTextFromWebsite(url);
    console.log("[/getwebsitecontent] Successfully extracted text content");
    res.json({ content: text });
  } catch (error) {
    console.error(
      "[/getwebsitecontent] Error while extracting text content:",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

app.get("/hey", async (req, res) => {
  console.log("[/hey] GET request received");
  res.json({ content: "hey you are right" });
});

// Start the server
app.listen(port, () => {
  console.log(`[Server] Server is running at http://localhost:${port}`);
});
