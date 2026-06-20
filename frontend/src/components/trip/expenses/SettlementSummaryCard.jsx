
import { useEffect, useState } from "react";
import { expenseService } from "../../../services/expenseService";
import { ArrowRight } from "lucide-react";

const SettlementSummaryCard = ({
  settlements,
  onOpen
}) => {

 const totalOutstanding =
  settlements
    .filter(
      settlement =>
        settlement.status !==
        "Settled"
    )
    .reduce(
      (
        sum,
        settlement
      ) =>
        sum +
        Number(
          settlement.amount
        ),
      0
    );

    const pendingCount =
  settlements.filter(
    settlement =>
      settlement.status !==
      "Settled"
  ).length;

  return (

    <div
      className="
      bg-white
      border
      border-gray-200/60
      rounded-2xl
      p-6
      mb-6
      "
    >

      <h3
        className="
        text-xs
        uppercase
        tracking-widest
        font-bold
        text-gray-400
        "
      >
        Settlement Status
      </h3>

      <div
        className="
        mt-4
        "
      >

        <p
          className="
          text-2xl
          font-bold
          text-gray-900
          "
        >
          {pendingCount}
        </p>

        <p
          className="
          text-sm
          text-gray-500
          "
        >
          Pending Settlements
        </p>

      </div>

      <div
        className="
        mt-4
        "
      >

        <p
          className="
          text-lg
          font-semibold
          text-[#1E4631]
          "
        >
          ₹{
            totalOutstanding
          }
        </p>

        <p
          className="
          text-sm
          text-gray-500
          "
        >
          Outstanding Amount
        </p>

      </div>

      <button
  onClick={
    onOpen
  }
        className="
        mt-5
        flex
        items-center
        gap-2
        text-sm
        font-medium
        text-[#1E4631]
        "
      >

        View Details

        <ArrowRight
          size={15}
        />

      </button>

    </div>

  );

};

export default SettlementSummaryCard;