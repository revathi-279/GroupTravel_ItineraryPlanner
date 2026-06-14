import { Types } from "mongoose"
import { getTrip, isTripAdmin, isTripMember, getExpense } from "../utils/TripHelpers.js";
import Expense from "../models/ExpenseModel.js"
import Activity
from "../models/ActivityModel.js";

export const addExpense = async (req, res) => {
    try {
        const {
            tripId,
            title,
            payers,
            participants,
            notes
        } = req.body;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter trip ID"
            });
        }

        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            });
        }

        // Validate title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter title"
            });
        }
        // Validate payers
        if (
            !payers ||
            !Array.isArray(payers) ||
            payers.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide payers"
            });
        }
        // Validate participants
        if (
            !participants ||
            !Array.isArray(participants) ||
            participants.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide participants"
            });
        }
        // Find trip 
        const trip = await getTrip(tripId);
        // Check if trip exists
        // Check trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }
        // Logged-in user must be member
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only trip members can create expenses"
            });
        }
        // Unique payers validation
        const uniquePayers = new Set(
            payers.map(
                payer => payer.user.toString()
            )
        );

        if (uniquePayers.size !== payers.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate payers are not allowed"
            });
        }

        // Validate payers
        let totalPaid = 0;

        for (const payer of payers) {

            if (!Types.ObjectId.isValid(payer.user)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payer ID"
                });
            }

            if (!isTripMember(trip, payer.user)) {
                return res.status(400).json({
                    success: false,
                    message: "All payers must be trip members"
                });
            }

            if (
                isNaN(Number(payer.amount)) ||
                Number(payer.amount) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Payer amount must be greater than 0"
                });
            }

            totalPaid += Number(payer.amount);
        }
        if (totalPaid <= 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Total expense amount must be greater than 0"
            });
        }
        // Check duplicate participants
        const uniqueParticipants = new Set(
            participants.map(
                participant => participant.toString()
            )
        );
        if (uniqueParticipants.size !== participants.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate participants are not allowed"
            });
        }
        // Validate every participant
        for (const participant of participants) {
            // validate participant id
            if (!Types.ObjectId.isValid(participant)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid participant ID"
                });
            }
            // Validate if every participant is trip member
            if (!isTripMember(trip, participant)) {
                return res.status(400).json({
                    success: false,
                    message: "All participants must be trip members"
                });
            }
        }
        // Create expense
        const expense = await Expense.create({
            tripId,
            title: title.trim(),
            notes: notes?.trim() || "",
            payers,
            participants,
            createdBy: req.user._id
        })

        await Activity.create({
  trip: tripId,
  user: req.user._id,
  type: "expense_added",
  message:
    `${req.user.name} added expense "${title}"`
});

        // While creating we access ids but not names. Populate after creating
        const populatedExpense = await Expense.findById(expense._id)
            .populate("payers.user", "name")
            .populate("createdBy", "name")
            .populate("updatedBy", "name")
            .populate("participants", "name");
        return res.status(200).json({
            success: true,
            message: "Expense created successfully",
            expense: populatedExpense
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server side error"
        });
    }
}

export const getAllExpenses = async (req, res) => {
    try {
        const { tripId } = req.params;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter trip ID"
            });
        }

        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            });
        }
        // Find trip
        const trip = await getTrip(tripId);
        // Check trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }
        // Logged-in user must be member
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only trip members can view expenses"
            });
        }
        // Get all expenses of the trip
        const allExpenses = await Expense.find({ tripId })
            .populate("payers.user", "name")
            .populate("participants", "name")
            .populate("createdBy", "name profilePicture")
            .populate("updatedBy", "name profilePicture")
            .sort({ createdAt: -1 });
        // Send response
        return res.status(200).json({
            success: true,
            allExpenses
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server side error"
        });
    }
}

export const updateExpense = async (req, res) => {
    try {
        // Get details from body
        const {
            expenseId,
            title,
            payers,
            participants,
            notes
        } = req.body;
        // Validate expense ID
        if (!expenseId) {
            return res.status(400).json({
                success: false,
                message: "Please enter expense ID"
            });
        }

        if (!Types.ObjectId.isValid(expenseId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid expense ID"
            });
        }
        // Find expense
        const expense = await getExpense(expenseId);

        // Check expense exists
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        // Find trip
        const trip = await getTrip(expense.tripId);
        // Check user is creator
        const isCreator = expense.createdBy.toString() === req.user._id.toString();
        // Check user is admin
        const isAdmin = isTripAdmin(trip, req.user._id);

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                success: false,
                message:
                    "Only expense creator or trip admin can update expense"
            });
        }


        // Validate title
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty"
                });
            }
            expense.title = title.trim();
        }
        // Unique payers validation
        const uniquePayers = new Set(
            payers.map(
                payer => payer.user.toString()
            )
        );

        if (uniquePayers.size !== payers.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate payers are not allowed"
            });
        }

        // Validate payers
        if (payers !== undefined) {

            if (
                !Array.isArray(payers) ||
                payers.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide payers"
                });
            }

            let totalPaid = 0;

            for (const payer of payers) {

                if (!Types.ObjectId.isValid(payer.user)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid payer ID"
                    });
                }

                if (!isTripMember(trip, payer.user)) {
                    return res.status(400).json({
                        success: false,
                        message: "All payers must be trip members"
                    });
                }

                if (
                    isNaN(Number(payer.amount)) ||
                    Number(payer.amount) <= 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Payer amount must be greater than 0"
                    });
                }

                totalPaid += Number(payer.amount);
            }

            expense.payers = payers;
        }
        // Validate participants
        if (participants !== undefined) {

            if (
                !Array.isArray(
                    participants
                ) ||
                participants.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please provide participants"
                });
            }

            const uniqueParticipants =
                new Set(
                    participants.map(
                        participant =>
                            participant.toString()
                    )
                );

            if (
                uniqueParticipants.size !==
                participants.length
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Duplicate participants are not allowed"
                });
            }

            for (
                const participant
                of participants
            ) {

                if (
                    !Types.ObjectId.isValid(
                        participant
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Invalid participant ID"
                    });
                }

                if (
                    !isTripMember(
                        trip,
                        participant
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "All participants must be trip members"
                    });
                }
            }

            expense.participants =
                participants;
        }

        // Update notes
        if (notes !== undefined) {
            expense.notes =
                notes.trim();
        }

        // Update updatedBy
        expense.updatedBy =
            req.user._id;

        // Save expense
        await expense.save();
        // Populate
        const populatedExpense = await Expense.findById(expense._id)
            .populate("payers.user", "name")
            .populate("createdBy", "name")
            .populate("updatedBy", "name")
            .populate("participants", "name");

        // Send response
        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: populatedExpense,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server side error"
        });
    }
}

export const deleteExpense = async (req, res) => {
    try {

        const { expenseId } = req.params;

        // Validate expense ID
        if (!expenseId) {
            return res.status(400).json({
                success: false,
                message: "Please enter expense ID"
            });
        }

        if (!Types.ObjectId.isValid(expenseId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid expense ID"
            });
        }

        // Find expense
        const expense = await getExpense(expenseId);

        // Check expense exists
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // Find trip
        const trip = await getTrip(expense.tripId);

        // Check creator
        const isCreator =
            expense.createdBy.toString() ===
            req.user._id.toString();

        // Check admin
        const isAdmin =
            isTripAdmin(
                trip,
                req.user._id
            );

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                success: false,
                message:
                    "Only expense creator or trip admin can delete expense"
            });
        }

        // Delete expense
        await Expense.findByIdAndDelete(
            expenseId
        );

        // Send response
        return res.status(200).json({
            success: true,
            message:
                "Expense deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};

export const getExpenseSummary = async (req, res) => {
    try {

        const { tripId } = req.params;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter trip ID"
            });
        }

        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            });
        }

        // Find trip
        const trip = await getTrip(tripId);

        // Check trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        // Check member
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only trip members can view expense summary"
            });
        }

        // Get expenses
        const expenses = await Expense.find({ tripId })
            .populate("payers.user", "name")
            .populate("participants", "name");

        let totalSpent = 0;

        const balances = {};

        // Process expenses
        for (const expense of expenses) {

            const expenseAmount =
                expense.payers.reduce(
                    (sum, payer) =>
                        sum + payer.amount,
                    0
                );

            totalSpent += expenseAmount;

            const share =
                expenseAmount /
                expense.participants.length;

            // Add payer balances
            for (const payer of expense.payers) {

                const userId =
                    payer.user._id.toString();

                if (!balances[userId]) {
                    balances[userId] = {
                        user: payer.user,
                        balance: 0
                    };
                }

                balances[userId].balance +=
                    payer.amount;
            }

            // Subtract participant shares
            for (
                const participant
                of expense.participants
            ) {

                const userId =
                    participant._id.toString();

                if (!balances[userId]) {
                    balances[userId] = {
                        user: participant,
                        balance: 0
                    };
                }

                balances[userId].balance -=
                    share;
            }
        }

        // Separate creditors and debtors
        const creditors = [];
        const debtors = [];

        Object.values(balances).forEach(
            entry => {

                if (entry.balance > 0) {
                    creditors.push({
                        user: entry.user,
                        amount: entry.balance
                    });
                }

                if (entry.balance < 0) {
                    debtors.push({
                        user: entry.user,
                        amount:
                            Math.abs(
                                entry.balance
                            )
                    });
                }
            }
        );

        // Calculate settlements
        const settlements = [];

        let creditorIndex = 0;
        let debtorIndex = 0;

        while (
            creditorIndex <
            creditors.length &&
            debtorIndex <
            debtors.length
        ) {

            const creditor =
                creditors[creditorIndex];

            const debtor =
                debtors[debtorIndex];

            const amount =
                Math.min(
                    creditor.amount,
                    debtor.amount
                ).toFixed(2)

            settlements.push({
                from: debtor.user,
                to: creditor.user,
                amount
            });

            creditor.amount -= amount;
            debtor.amount -= amount;

            if (creditor.amount === 0) {
                creditorIndex++;
            }

            if (debtor.amount === 0) {
                debtorIndex++;
            }
        }

        return res.status(200).json({
            success: true,
            totalSpent,
            budget: trip.budget || 0,
            remainingBudget:
                (trip.budget || 0) -
                totalSpent,
            expenseCount:
                expenses.length,
            balances:
                Object.values(
                    balances
                ),
            settlements
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};