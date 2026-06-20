import express from "express";

import {
  getSettlements,
  markSettlementPaid,
  confirmSettlement
}
from "../controllers/SettlementController.js";

import {
  verifyToken
}
from "../middlewares/AuthMiddleware.js";

const router =
  express.Router();

router.get(
  "/get-settlements/:tripId",
  verifyToken,
  getSettlements
);

router.patch(
  "/mark-paid/:settlementId",
  verifyToken,
  markSettlementPaid
);

router.patch(
  "/confirm/:settlementId",
  verifyToken,
  confirmSettlement
);

export default router;