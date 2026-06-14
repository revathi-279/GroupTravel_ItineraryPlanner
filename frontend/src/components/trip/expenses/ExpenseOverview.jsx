import { theme }
from "../../../common/common";

const ExpenseOverview = ({
  summary,
}) => {

  const cards = [

    {
      icon: "💰",
      title: "Total Spent",
      value:
        `₹${summary.totalSpent}`,
    },

    {
      icon: "📄",
      title: "Expenses",
      value:
        summary.expenseCount,
    },

    {
      icon: "💳",
      title: "Budget Left",
      value:
        `₹${summary.remainingBudget}`,
    },

  ];

  return (

    <div
      className="
      grid
      md:grid-cols-3
      gap-4
      mb-8
      "
    >

      {cards.map(card => (

        <div
          key={card.title}
          className={
            theme.cards.tripSection
          }
        >

          <p className="text-3xl">
            {card.icon}
          </p>

          <p
            className="
            text-gray-500
            mt-2
            "
          >
            {card.title}
          </p>

          <h2
            className="
            text-3xl
            font-bold
            mt-2
            "
          >
            {card.value}
          </h2>

        </div>

      ))}

    </div>

  );
};

export default ExpenseOverview;