// routes/events.js
const express = require("express");
const router = express.Router();
const { db } = require("../db");

// 전체 위험 이벤트 로그 (최근 N개)
router.get("/", (req, res) => {
  const limit = Number(req.query.limit) || 10; // ?limit=20 형태로 불러올 로그 개수 조정 가능

  db.all(
    `SELECT 
      e.event_id,
      e.sensor_id,
      e.distance_m,
      e.detected_at,
      e.object_type,
      e.risk_label
    FROM risk_event e
    ORDER BY e.event_id DESC
    LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) {
        console.error("risk_event 조회 에러:", err);
        return res.status(500).json({ error: "DB error" });
      }
      res.json(rows);
    }
  );
});

// 특정 센서에 대한 로그만 보고 싶을 때: /api/events/sensor/1
router.get("/sensor/:sensorId", (req, res) => {
  const sensorId = req.params.sensorId;
  const limit = Number(req.query.limit) || 10;

  db.all(
    `SELECT 
      e.event_id,
      e.sensor_id,
      e.distance_m,
      e.detected_at,
      e.object_type,
      e.risk_label
    FROM risk_event e
    WHERE e.sensor_id = ?
    ORDER BY e.event_id DESC
    LIMIT ?`,
    [sensorId, limit],
    (err, rows) => {
      if (err) {
        console.error("risk_event sensor별 조회 에러:", err);
        return res.status(500).json({ error: "DB error" });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
