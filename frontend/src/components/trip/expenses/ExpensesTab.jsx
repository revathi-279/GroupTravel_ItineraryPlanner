import {
  useEffect,
  useState,
} from "react";

import {
  expenseService
}
from "../../../services/expenseService";

import ExpenseOverview
from "./ExpenseOverview";

import BudgetHealthCard
from "./BudgetHealthCard";

import BalanceCard
from "./BalanceCard";

import SettlementCard
from "./SettlementCard";

import ExpenseCard from "./ExpenseCard";

import ExpenseDrawer
from "./ExpenseDrawer";

import ConfirmationModal
from "../../common/ConfirmationModel";

import EditExpenseModal from "./EditExpenseModal";

import EmptyExpenses
from "./EmptyExpenses";

import CreateExpenseModal
from "./CreateExpenseModal";

import {
  AnimatePresence
}
from "framer-motion";

const ExpensesTab = ({
  trip,
   currentUser,
}) => {

 const isAdmin =
  trip.admins?.some(
    admin => {

      const adminId =
        admin?._id || admin;

      return (
        String(adminId) ===
        String(currentUser?._id)
      );
    }
  );

  const [
    expenses,
    setExpenses
  ] = useState([]);

  const [
    summary,
    setSummary
  ] = useState(null);

  const [
  showCreateModal,
  setShowCreateModal
] = useState(false);

const [
  selectedExpense,
  setSelectedExpense
] = useState(null);

const [
  showEditModal,
  setShowEditModal
] = useState(false);

const [
  expenseToEdit,
  setExpenseToEdit
] = useState(null);

const [
  confirmation,
  setConfirmation
] = useState({
  open: false,
  title: "",
  message: "",
  action: null,
});


  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async () => {

      try {

        const [
          expensesResponse,
          summaryResponse,
        ] = await Promise.all([

          expenseService
            .getExpenses(
              trip._id
            ),

          expenseService
            .getSummary(
              trip._id
            ),

        ]);

       setExpenses(
  expensesResponse
    .allExpenses || []
);

setSummary(
  summaryResponse
);

      } catch (error) {

        console.log(error);
      }
    };

  if (!summary) {

    return (
      <p>
        Loading...
      </p>
    );
  }

if (
  expenses.length === 0
) {

  return (
    <>
      <EmptyExpenses
  onCreate={() =>
    setShowCreateModal(
      true
    )
  }
  isAdmin={isAdmin}
/>

      <CreateExpenseModal
        open={
          showCreateModal
        }
        trip={trip}
        onClose={() =>
          setShowCreateModal(
            false
          )
        }
        onCreated={
          fetchData
        }
      />
    </>
  );
}

const openDeleteExpenseModal =
  (expense) => {

    setConfirmation({
      open: true,

      title:
        "Delete Expense",

      message:
        `${expense.title} will be permanently removed.`,

      action:
        async () => {

          await expenseService
            .deleteExpense(
              expense._id
            );

          fetchData();

          setSelectedExpense(
            null
          );
        },
    });
  };

  const openEditExpenseModal =
  (expense) => {

    setExpenseToEdit(
      expense
    );

    setShowEditModal(
      true
    );
  };

  console.log(trip.members)

  return (

    <div>

  
      <div
  className="
  flex
  justify-between
  items-center
  mb-8
  "
>

  <div>

    <h1
      className="
      text-3xl
      font-bold
      "
    >
      Expense Tracker
    </h1>

    <p
      className="
      text-gray-500
      mt-1
      "
    >
      Track shared spending,
      balances and settlements.
    </p>

  </div>

 {isAdmin && (

  <button
    onClick={() =>
      setShowCreateModal(
        true
      )
    }
    className="
    bg-[#2F6F4E]
    text-white
    px-5
    py-3
    rounded-2xl
    "
  >
    + Add Expense
  </button>

)}

</div>


      <div
        className="
        grid
        md:grid-cols-3
        gap-4
        mb-8
        "
      >


      </div>

    


     <div
  className="
  flex
  items-center
  justify-between
  mt-10
  mb-4
  "
>

  <h2
    className="
    text-xl
    font-semibold
    "
  >
    Expense Activity
  </h2>

  <span
    className="
    text-sm
    text-gray-500
    "
  >
    {expenses.length} Expenses
  </span>

</div>
<div className="space-y-4">

  {expenses.map(
    expense => (

      <ExpenseCard
        key={expense._id}
        expense={expense}
        onClick={
          setSelectedExpense
        }
      />

    )
  )}

</div>

<AnimatePresence>

  {selectedExpense && (

   <ExpenseDrawer
  expense={selectedExpense}
  trip={trip}
  currentUser={currentUser}

  onClose={() =>
    setSelectedExpense(null)
  }

  onEdit={
    openEditExpenseModal
  }

  onDelete={
    openDeleteExpenseModal
  }
/>

  )}

</AnimatePresence>

<EditExpenseModal
  open={
    showEditModal
  }
  expense={
    expenseToEdit
  }
  trip={trip}
  onClose={() =>
    setShowEditModal(
      false
    )
  }
  onUpdated={
    fetchData
  }
/>

<ConfirmationModal
  open={
    confirmation.open
  }
  title={
    confirmation.title
  }
  message={
    confirmation.message
  }
  confirmText="Delete"
  onClose={() =>
    setConfirmation({
      open: false,
      title: "",
      message: "",
      action: null,
    })
  }
  onConfirm={async () => {

    await confirmation
      .action?.();

    setConfirmation({
      open: false,
      title: "",
      message: "",
      action: null,
    });

  }}
/>

<CreateExpenseModal
  open={
    showCreateModal
  }
  trip={trip}
  onClose={() =>
    setShowCreateModal(
      false
    )
  }
  onCreated={
    fetchData
  }
/>

    </div>

  );
};

export default ExpensesTab;