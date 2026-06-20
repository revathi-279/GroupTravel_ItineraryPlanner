import { useEffect, useMemo, useState } from "react";

import {
  AnimatePresence,
  motion
} from "framer-motion";

import {
  X,
  Search,
  ArrowRight
} from "lucide-react";

import {
  settlementService
}
from "../../../services/settlementService";



const SettlementDrawer = ({
  open,
  onClose,
  settlements,
  currentUser,
  refreshSettlements
}) => {

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("name");

      useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key === "Escape"
        ) {
          onClose();
        }

      };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );

  }, [onClose]);


    const totalOutstanding =
    settlements.reduce(
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

      const filteredSettlements =
  useMemo(() => {

    let results =
      settlements.filter(
        settlement => {

          const query =
            search.toLowerCase();

          if (!query)
            return true;

          return (

            settlement.from.name
              ?.toLowerCase()
              .includes(query)

            ||

            settlement.to.name
              ?.toLowerCase()
              .includes(query)

          );

        }
      );

    if (sortBy === "name") {

      results.sort(
        (a, b) =>
          a.from.name.localeCompare(
            b.from.name
          )
      );

    }

    if (sortBy === "high") {

      results.sort(
        (a, b) =>
          Number(b.amount) -
          Number(a.amount)
      );

    }

    if (sortBy === "low") {

      results.sort(
        (a, b) =>
          Number(a.amount) -
          Number(b.amount)
      );

    }

    return results;

  }, [
    settlements,
    search,
    sortBy
  ]);

  const handleMarkPaid =
async (settlementId) => {

  try {

    await settlementService
      .markPaid(
        settlementId
      );

    await refreshSettlements();

  } catch (error) {

    console.log(error);

  }

};

const handleConfirm =
async (settlementId) => {

  try {

    await settlementService
      .confirmPayment(
        settlementId
      );

    await refreshSettlements();

  } catch (error) {

    console.log(error);

  }

};

      if (!open)
    return null;

  


 return (

<AnimatePresence>

{open && (

<>

<motion.div
  initial={{
    opacity: 0
  }}
  animate={{
    opacity: 1
  }}
  exit={{
    opacity: 0
  }}
  onClick={onClose}
  className="
  fixed
  inset-0
  bg-black/30
  backdrop-blur-sm
  z-50
  "
/>

<motion.div
  initial={{
    x: 450
  }}
  animate={{
    x: 0
  }}
  exit={{
    x: 450
  }}
  transition={{
    type: "spring",
    damping: 28,
    stiffness: 260
  }}
  className="
  fixed
  right-0
  top-0
  h-screen
  w-[450px]
  bg-white
  shadow-2xl
  z-50
  flex
  flex-col
  "
>

<div
  className="
  p-6
  border-b
  border-gray-100
  "
>

<div
  className="
  flex
  justify-between
  items-center
  "
>

<div>

<h2
  className="
  text-xl
  font-bold
  "
>
  Settlement Summary
</h2>

<p
  className="
  text-sm
  text-gray-500
  mt-1
  "
>
  {
    settlements.length
  } payments pending
</p>

</div>

<button
  onClick={onClose}
  className="
  p-2
  rounded-lg
  hover:bg-gray-100
  "
>
  <X size={18}/>
</button>

</div>

<p
  className="
  mt-4
  text-lg
  font-semibold
  text-[#1E4631]
  "
>
  ₹{
    totalOutstanding.toFixed(
      2
    )
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

<div
  className="
  mt-4
  flex
  gap-2
  "
>

<div
  className="
  relative
  flex-1
  "
>

<Search
  size={15}
  className="
  absolute
  left-3
  top-1/2
  -translate-y-1/2
  text-gray-400
  "
/>

<input
  value={search}
  onChange={
    e =>
      setSearch(
        e.target.value
      )
  }
  placeholder="Search member..."
  className="
  w-full
  pl-9
  pr-3
  py-2
  border
  rounded-xl
  text-sm
  "
/>

</div>

<select
  value={sortBy}
  onChange={
    e =>
      setSortBy(
        e.target.value
      )
  }
  className="
  border
  rounded-xl
  px-3
  text-sm
  "
>
  <option value="name">
    A-Z
  </option>

  <option value="high">
    Highest
  </option>

  <option value="low">
    Lowest
  </option>
</select>

</div>

</div>

<div
  className="
  flex-1
  overflow-y-auto
  p-6
  space-y-4
  "
>

{filteredSettlements.length === 0 && (

<div
  className="
  text-center
  py-12
  text-gray-500
  "
>
  No settlements found
</div>

)}

{filteredSettlements.map(
  (
    settlement,
    index
  ) => {

    const fromName =
      String(
  settlement.from._id
) ===
String(
  currentUser._id
)

      ? `${settlement.from.name} (You)`

      : settlement.from.name;

  const toName =
  String(
    settlement.to._id
  ) ===
  String(
    currentUser._id
  )
    ? `${settlement.to.name} (You)`
    : settlement.to.name;

    return (

      <div
        key={index}
        className="
        border
        border-gray-100
        rounded-2xl
        p-4
        "
      >

        <div
          className="
          flex
          items-center
          justify-between
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
    className="
    flex
    items-center
    gap-2
    "
  >

    <div
      className="
      w-9
      h-9
      rounded-full
      overflow-hidden
      bg-gray-100
      "
    >

      {settlement.from.profilePicture ? (

        <img
          src={settlement.from.profilePicture}
          alt=""
          className="
          w-full
          h-full
          object-cover
          "
        />

      ) : (

        <div
          className="
          w-full
          h-full
          flex
          items-center
          justify-center
          text-sm
          "
        >
          {settlement.from.name?.[0]}
        </div>

      )}

    </div>

    <span className="font-medium">
      {fromName}
    </span>

  </div>

  <ArrowRight
    size={14}
    className="text-gray-400"
  />

  <div
    className="
    flex
    items-center
    gap-2
    "
  >

    <div
      className="
      w-9
      h-9
      rounded-full
      overflow-hidden
      bg-gray-100
      "
    >

      {settlement.to.profilePicture ? (

        <img
          src={settlement.to.profilePicture}
          alt=""
          className="
          w-full
          h-full
          object-cover
          "
        />

      ) : (

        <div
          className="
          w-full
          h-full
          flex
          items-center
          justify-center
          text-sm
          "
        >
          {settlement.to.name?.[0]}
        </div>

      )}

    </div>

    <span className="font-medium">
      {toName}
    </span>

  </div>

</div>

          <span
            className="
            font-bold
            text-[#1E4631]
            "
          >
            ₹{
              settlement.amount
            }
          </span>

          <div
  className="
  mt-3
  flex
  justify-between
  items-center
  "
>

{(() => {

  const isDebtor =
    String(
      settlement.from._id
    ) ===
    String(
      currentUser._id
    );

  const isReceiver =
    String(
      settlement.to._id
    ) ===
    String(
      currentUser._id
    );

  let statusText =
    settlement.status;

  if (
    settlement.status ===
    "AwaitingConfirmation"
  ) {

    if (isDebtor) {

      statusText =
        "Awaiting Confirmation";

    } else {

      statusText =
        "Pending";

    }

  }

  if (
    settlement.status ===
    "AwaitingConfirmation"
    &&
    isReceiver
  ) {
    return null;
  }

  return (

    <span
      className={`
        px-2.5
        py-1
        rounded-lg
        text-[10px]
        font-semibold

        ${
          settlement.status ===
          "Settled"

            ? "bg-green-50 text-green-700"

            : settlement.status ===
              "AwaitingConfirmation"

            ? "bg-blue-50 text-blue-700"

            : "bg-amber-50 text-amber-700"
        }
      `}
    >
      {statusText}
    </span>

  );

})()}

  {/* Debtor */}

  {settlement.status ===
    "Pending" &&

    String(
      settlement.from._id
    ) ===
    String(
      currentUser._id
    ) && (

      <button
        onClick={() =>
          handleMarkPaid(
            settlement._id
          )
        }
        className="
        px-3
        py-1.5
        rounded-lg
        text-xs
        font-medium
        bg-[#1E4631]
        text-white
        hover:bg-[#173826]
        "
      >
        Mark Paid
      </button>

  )}

  {/* Creditor */}

  {settlement.status ===
    "AwaitingConfirmation" &&

    String(
      settlement.to._id
    ) ===
    String(
      currentUser._id
    ) && (

      <button
        onClick={() =>
          handleConfirm(
            settlement._id
          )
        }
        className="
        px-3
        py-1.5
        rounded-lg
        text-xs
        font-medium
        bg-[#1E4631]
        text-white
        hover:bg-[#173826]
        "
      >
        Confirm
      </button>

  )}

</div>

        </div>

      </div>

    );

  }
)}

</div>

</motion.div>

</>

)}

</AnimatePresence>

);
};

export default SettlementDrawer;