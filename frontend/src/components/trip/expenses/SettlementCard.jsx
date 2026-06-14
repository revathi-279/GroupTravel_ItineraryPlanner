const SettlementCard = ({
  settlement,
}) => {

  return (

    <div
      className="
      bg-white
      rounded-2xl
      p-5
      shadow-sm
      text-center
      "
    >

      <p
        className="
        font-medium
        "
      >
        {
          settlement.from.name
        }
      </p>

      <div
        className="
        my-2
        text-gray-400
        "
      >
        ↓
      </div>

      <p
        className="
        font-medium
        "
      >
        {
          settlement.to.name
        }
      </p>

      <h2
        className="
        text-2xl
        font-bold
        mt-3
        "
      >
        ₹{
          settlement.amount
        }
      </h2>

    </div>

  );
};

export default SettlementCard;