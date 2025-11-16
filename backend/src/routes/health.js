// routes/health.js
const express = require("express");
const router = express.Router();
const { db } = require("../db");

// 센서별 현재 헬스 상태 + 마지막 ping 시간 같이 조회
router.get("/", (req, res) => {
  db.all(
    `SELECT
      s.id AS sensor_id,
      s.map_x_px,
      s.map_y_px,
      s.is_active,
      h.consecutive_timeout_count,
      h.is_faulty,
      h.updated_at,
      (
        SELECT ping_at
        FROM sensor_ping_log p
        WHERE p.sensor_id = s.id
        ORDER BY p.ping_id DESC
        LIMIT 1
      ) AS last_ping_at
    FROM sensor s
    LEFT JOIN sensor_health h
      ON h.sensor_id = s.id
    ORDER BY s.id ASC`,
    (err, rows) => {
      if (err) {
        console.error("health 조회 에러:", err);
        return res.status(500).json({ error: "DB error" });
      }
      res.json(rows);
    }
  );
});

// 필요하면 특정 센서의 ping 로그도 별도로
router.get("/ping/:sensorId", (req, res) => {
  const sensorId = req.params.sensorId;
  const limit = Number(req.query.limit) || 10;

  db.all(
    `SELECT
      ping_id,
      sensor_id,
      ping_at,
      response_ms,
      status
    FROM sensor_ping_log
    WHERE sensor_id = ?
    ORDER BY ping_id DESC
    LIMIT ?`,
    [sensorId, limit],
    (err, rows) => {
      if (err) {
        console.error("ping 로그 조회 에러:", err);
        return res.status(500).json({ error: "DB error" });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
