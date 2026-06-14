const BalanceCard = ({
  balance,
}) => {

  const positive =
    balance.balance > 0;

  return (

    <div
      className="
      bg-white
      rounded-2xl
      p-4
      shadow-sm
      "
    >

      <div
        className="
        flex
        items-center
        gap-3
        "
      >

        <div
          className={`
          w-10
          h-10
          rounded-full
          flex
          items-center
          justify-center

          ${
            positive
            ? "bg-green-100"
            : "bg-red-100"
          }
          `}
        >
          {
            balance.name?.[0]
          }
        </div>

        <div>

          <h3
            className="
            font-semibold
            "
          >
            {balance.name}
          </h3>

          <p
            className={`
            text-sm

            ${
              positive
              ? "text-green-700"
              : "text-red-700"
            }
            `}
          >
            {
              positive
              ? "Gets Back"
              : "Owes"
            }
          </p>

        </div>

      </div>

      <h2
        className="
        text-2xl
        font-bold
        mt-4
        "
      >
        ₹{
          Math.abs(
            balance.balance
          )
        }
      </h2>

    </div>

  );
};

export default BalanceCard;