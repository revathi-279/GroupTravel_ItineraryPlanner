const EmptyExpenses = ({
   onCreate,
  isAdmin,
}) => {

  return (

    <div
      className="
      bg-white
      rounded-3xl
      p-12
      text-center
      "
    >

      <div className="text-6xl">
        💰
      </div>

      <h2
        className="
        text-2xl
        font-bold
        mt-4
        "
      >
        No expenses yet
      </h2>

      <p
        className="
        text-gray-500
        mt-2
        "
      >
        Track hotels, transport,
        food and activities.
      </p>

     {isAdmin && (

  <button
    onClick={onCreate}
    className="
    bg-[#2F6F4E]
    text-white
    px-5
    py-3
    rounded-2xl
    "
  >
    Add First Expense
  </button>

)}

    </div>

  );
};

export default EmptyExpenses;