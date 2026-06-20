import React from "react";

// Premium minimalistic vectors matching our corporate design identity ✨
import { CreditCard, Users, ArrowRight } from "lucide-react";

const ExpenseCard = ({ expense, onClick }) => {
  // Safe calculation parsing to prevent fallback errors
  const totalAmount = expense?.payers?.reduce(
    (sum, payer) => sum + (Number(payer?.amount) || 0),
    0
  ) || 0;

  const formattedDate = expense?.createdAt
    ? new Date(expense.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

    const payerText = (() => {

  const payers =
    expense?.payers || [];

  if (
    payers.length === 0
  ) {
    return "No payer";
  }

  if (
    payers.length === 1
  ) {
    return `Paid by ${payers[0]?.user?.name}`;
  }

  if (
    payers.length === 2
  ) {
    return `${payers[0]?.user?.name} + ${payers[1]?.user?.name}`;
  }

  return `${payers[0]?.user?.name} + ${payers.length - 1} others`;

})();

  return (
   <div
  onClick={() => onClick?.(expense)}
  className="
  bg-white
  border
  border-gray-200/60
  rounded-2xl
  px-6
  py-4
  hover:shadow-sm
  hover:border-gray-300
  cursor-pointer
  transition-all
  duration-200
  group
  "
>

  <div
    className="
    flex
    items-center
    justify-between
    gap-6
    "
  >

   <div
  className="
  flex
  items-center
  gap-8
  min-w-0
  flex-1
  "
>

  <div
    className="
    w-10
    h-10
    rounded-xl
    bg-gray-50
    border
    border-gray-200/40
    flex
    items-center
    justify-center
    text-gray-500
    "
  >
    <CreditCard size={16} />
  </div>

  <div
    className="
    min-w-[220px]
    "
  >
    <h3
      className="
      text-sm
      font-semibold
      text-gray-900
      "
    >
      {expense?.title}
    </h3>
  </div>

  <div
    className="
    min-w-[120px]
    text-sm
    text-gray-500
    "
  >
    {formattedDate}
  </div>

  <div
    className="
    min-w-[180px]
    text-sm
    text-gray-600
    "
  >
    {payerText}
  </div>

  <div
    className="
    flex
    items-center
    gap-1
    min-w-[100px]
    text-sm
    text-gray-500
    "
  >
    <Users size={14} />

    <span>
      {
        expense?.participants
          ?.length || 0
      }
      {" "}
      Members
    </span>

  </div>

</div>

    <div
      className="
      flex
      items-center
      gap-5
      "
    >

      <div
        className="
        text-right
        "
      >
        <p
          className="
          text-lg
          font-bold
          text-gray-900
          "
        >
          ₹{totalAmount.toLocaleString("en-IN")}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="
        text-gray-300
        group-hover:text-gray-600
        transition-colors
        "
      />

    </div>

  </div>

</div>
  );
};

export default ExpenseCard;