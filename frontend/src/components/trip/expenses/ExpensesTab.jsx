import { useEffect, useState } from "react";
import { expenseService } from "../../../services/expenseService";
import { settlementService } from "../../../services/settlementService";


import ExpenseCard from "./ExpenseCard";
import ExpenseDrawer from "./ExpenseDrawer";
import ConfirmationModal from "../../common/ConfirmationModel";
import EditExpenseModal from "./EditExpenseModal";
import EmptyExpenses from "./EmptyExpenses";
import CreateExpenseModal from "./CreateExpenseModal";
import SettlementSummaryCard from "./SettlementSummaryCard";
import SettlementDrawer from "./SettlementDrawer";
import { AnimatePresence } from "framer-motion";
import { Loader2, Plus } from "lucide-react";

const ExpensesTab = ({ trip, currentUser }) => {
  const isAdmin = trip.admins?.some((admin) => {
    const adminId = admin?._id || admin;
    return String(adminId) === String(currentUser?._id);
  });

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [showSettlementDrawer, setShowSettlementDrawer] = useState(false);
  const [settlements, setSettlements] = useState([]);
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const fetchData = async () => {
    try {
      const [expensesResponse, summaryResponse, settlementsResponse] = await Promise.all([
        expenseService.getExpenses(trip._id),
        expenseService.getSummary(trip._id),
        settlementService.getSettlements(trip._id),
      ]);

      setExpenses(expensesResponse.allExpenses || []);
      setSummary(summaryResponse);
      setSettlements(settlementsResponse.settlements || []);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshSettlements = async () => {
    try {
      const [settlementsResponse, summaryResponse] = await Promise.all([
        settlementService.getSettlements(trip._id),
        expenseService.getSummary(trip._id),
      ]);

      setSettlements(settlementsResponse.settlements || []);
      setSummary(summaryResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trip]);

  if (!summary) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-400 select-none font-sans antialiased">
        <Loader2 size={24} className="animate-spin text-[#2D6A4F]" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading ledger balances...</span>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <>
        <EmptyExpenses onCreate={() => setShowCreateModal(true)} isAdmin={isAdmin} />
        <CreateExpenseModal
          open={showCreateModal}
          trip={trip}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchData}
        />
      </>
    );
  }

  const openDeleteExpenseModal = (expense) => {
    // Instantly collapse the expense details side drawer panel sheet
    setSelectedExpense(null);

    setConfirmation({
      open: true,
      title: "Delete Expense",
      message: `"${expense.title}" will be permanently removed from this ledger.`,
      action: async () => {
        await expenseService.deleteExpense(expense._id);
        fetchData();
      },
    });
  };

  const openEditExpenseModal = (expense) => {
    setExpenseToEdit(expense);
    setShowEditModal(true);
    setSelectedExpense(null);
  };

  return (
    <div className="p-8 w-full max-w-5xl font-sans antialiased text-slate-900 mx-auto">
      
      {/* Tab Heading Branding Control Container Row */}
      <div className="flex justify-between items-center mb-10 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Expense Tracker
          </h1>
          <p className="text-xs font-medium text-stone-400 mt-1.5 leading-relaxed">
            Track shared group spend dynamics, balances, and real-time crew settlement paths.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Expense</span>
          </button>
        )}
      </div>

      {/* Aggregate Settlement Window Metadata Banner Row Card */}
      <div className="mb-10">
        <SettlementSummaryCard
          settlements={settlements}
          onOpen={() => setShowSettlementDrawer(true)}
        />
      </div>

      {/* Action Ledger Section Header Metric Row */}
      <div className="flex items-center justify-between mt-10 mb-4 select-none">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">
          Expense Activity
        </h2>
        <span className="text-[10px] font-bold bg-[#FAF8F5] text-stone-400 px-2 py-0.5 rounded-md border border-[#EFE9DC]">
          {expenses.length} {expenses.length === 1 ? "Expense" : "Expenses"}
        </span>
      </div>

      {/* Feed Stack Wrapper Grid List */}
      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense._id}
            expense={expense}
            onClick={setSelectedExpense}
          />
        ))}
      </div>

      {/* Lifecycle Modal Overlays Canvas Layer Track Assemblies */}
      <AnimatePresence>
        {selectedExpense && (
          <ExpenseDrawer
            expense={selectedExpense}
            trip={trip}
            currentUser={currentUser}
            onClose={() => setSelectedExpense(null)}
            onEdit={openEditExpenseModal}
            onDelete={openDeleteExpenseModal}
          />
        )}
      </AnimatePresence>

      <EditExpenseModal
        open={showEditModal}
        expense={expenseToEdit}
        trip={trip}
        onClose={() => setShowEditModal(false)}
        onUpdated={fetchData}
      />

      <CreateExpenseModal
        open={showCreateModal}
        trip={trip}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchData}
      />

      <SettlementDrawer
        open={showSettlementDrawer}
        settlements={settlements}
        currentUser={currentUser}
        refreshSettlements={refreshSettlements}
        onClose={() => setShowSettlementDrawer(false)}
      />

      <ConfirmationModal
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
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
          await confirmation.action?.();
          setConfirmation({
            open: false,
            title: "",
            message: "",
            action: null,
          });
        }}
      />
    </div>
  );
};

export default ExpensesTab;