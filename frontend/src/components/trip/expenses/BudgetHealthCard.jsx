import { theme }
from "../../../common/common";

const BudgetHealthCard = ({
  summary,
}) => {

const percentage =
  summary.budget > 0
    ? (
        summary.totalSpent /
        summary.budget
      ) * 100
    : 0;

  return (

    <div
      className={`
      ${theme.cards.tripSection}
      mb-8
      `}
    >

      <h2
        className="
        text-xl
        font-semibold
        mb-4
        "
      >
        Budget Health
      </h2>

      <div
        className="
        flex
        justify-between
        mb-3
        "
      >

        <span>
          Budget
        </span>

        <span>
          ₹{summary.budget}
        </span>

      </div>

      <div
        className="
        flex
        justify-between
        mb-4
        "
      >

        <span>
          Spent
        </span>

        <span>
          ₹{summary.totalSpent}
        </span>

      </div>

      <div
        className="
        w-full
        h-3
        bg-gray-200
        rounded-full
        overflow-hidden
        "
      >

        <div
          className="
          h-full
          bg-[#2F6F4E]
          "
          style={{
            width:
              `${Math.min(
                percentage,
                100
              )}%`,
          }}
        />

      </div>

      <p
        className="
        mt-3
        text-sm
        text-gray-500
        "
      >
        {percentage}% Used
      </p>

      {summary.remainingBudget < 0 && (

        <div
          className="
          mt-4
          p-4
          rounded-xl
          bg-red-50
          text-red-700
          "
        >
          ⚠ Budget Exceeded
        </div>

      )}

    </div>

  );
};

export default BudgetHealthCard;