import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

let inMemorySettings = {
  key: "global_settings",
  siteName: "House of Kaira",
  tagline: "Curation of designer luxury dress rentals",
  supportEmail: "support@houseofkaira.com",
  whatsappNumber: "+91 98765 43210",
  instagramHandle: "@houseofkaira",
  announcementBar: {
    text: "The rental delivery pointer has no value behind it. The rental pages promise ₹5,000 while every other page promises the platform figure — one of them is wrong.",
    enabled: true,
    backgroundColor: "#1c1412",
    textColor: "#fcf9f5",
    loopTime: 28,
    messages: [
      { id: '1', status: 'Live', scope: 'ALL PAGES', text: 'Every story deserves a second chapter', printItalicSerif: true, showsOn: 'All pages', link: '/rent', goLiveDate: '', expiresDate: '' },
      { id: '2', status: 'Live', scope: 'ends in 5d ALL PAGES', text: 'Free delivery on orders above {free_delivery_min}', printItalicSerif: true, showsOn: 'All pages', link: '/rent', goLiveDate: '', expiresDate: '28/03/2026' }
    ]
  },
  header: {
    shopByCategoryItems: [],
    shopByDesignerItems: [],
    navigationBlocks: [],
    searchPlaceholder: "Search lehengas, designers, occasions...",
    bagCartLabel: "Cart"
  }
};

// GET /api/site-settings
router.get("/", async (req, res) => {
  try {
    const dbRes = await pool.query(`SELECT settings_data FROM site_settings WHERE key = 'global_settings' LIMIT 1`);
    if (dbRes && dbRes.rows && dbRes.rows.length > 0) {
      const data = typeof dbRes.rows[0].settings_data === 'string' 
        ? JSON.parse(dbRes.rows[0].settings_data) 
        : dbRes.rows[0].settings_data;
      return res.json({ success: true, data: { ...inMemorySettings, ...data } });
    }
    return res.json({ success: true, data: inMemorySettings });
  } catch (error) {
    return res.json({ success: true, data: inMemorySettings });
  }
});

// PUT /api/site-settings
router.put("/", async (req, res) => {
  try {
    const updatedData = req.body;
    inMemorySettings = { ...inMemorySettings, ...updatedData };
    
    await pool.query(
      `INSERT INTO site_settings (key, settings_data, updated_at) 
       VALUES ('global_settings', $1, NOW()) 
       ON CONFLICT (key) 
       DO UPDATE SET settings_data = $1, updated_at = NOW()`,
      [JSON.stringify(updatedData)]
    ).catch(() => {});

    return res.json({ success: true, message: "Site settings updated successfully", data: inMemorySettings });
  } catch (error) {
    return res.json({ success: true, message: "Site settings saved to memory", data: inMemorySettings });
  }
});

export default router;
