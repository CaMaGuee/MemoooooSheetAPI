export default async function handler(req, res) {
  /* ===============================
     CORS
  =============================== */
  res.setHeader("Access-Control-Allow-Origin", "https://camaguee.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed"
    });
  }

  try {
    const { userId, Memooooo } = req.body || {};

    /* ===============================
       최소 검증
    =============================== */
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId required"
      });
    }

    if (!Array.isArray(Memooooo)) {
      return res.status(400).json({
        success: false,
        error: "Memooooo must be an array"
      });
    }

    const appsScriptUrl =
      "https://script.google.com/macros/s/AKfycbx7Cy3szlMD9qx1qEarNntAxtCJ_Xsr050oRWwcgmS6s98dh-Pty8oU9HyI1ef7Z-bTYQ/exec";

    console.log("[Vercel] Save 요청 전달", {
      userId,
      count: Memooooo.length
    });

    /* ===============================
       Apps Script로 그대로 전달
    =============================== */
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        Memooooo
      })
    });

    const result = await response.json();

    console.log("[Vercel] Apps Script 응답:", result);

    return res.status(200).json(result);

  } catch (err) {
    console.error("[Vercel Save Error]", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error"
    });
  }
}
