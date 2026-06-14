// For reusing the validation blocks in apis 
import Trip from "../models/TripModel.js"
import Expense from "../models/ExpenseModel.js"


export const getTrip = async (tripId) => {
    return await Trip.findById(tripId);
};


export const isTripMember = (trip, userId) => {
    return trip.members.some(
        member => member.toString() === userId.toString()
    );
};

export const isTripAdmin = (trip, userId) => {
    return trip.admins.some(
        admin => admin.toString() === userId.toString()
    );
};

export const getExpense = async (expenseId) => {
    return await Expense.findById(expenseId);
};
