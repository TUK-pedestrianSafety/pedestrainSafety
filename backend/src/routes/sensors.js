// routes/sensors.js
const express = require("express");
const router = express.Router();
const { db } = require("../db");

// 센서 정보 불러오기 (프론트에서 활용)
router.get("/", (req, res) => {
  db.all(
    `SELECT 
      s.id,
      s.map_x_px,
      s.map_y_px,
      s.is_active,
      h.is_faulty,
      h.consecutive_timeout_count
    FROM sensor s
    LEFT JOIN sensor_health h
      ON h.sensor_id = s.id
    ORDER BY s.id ASC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

module.exports = router;
