import Expense from "../models/ExpenseModel.js";
import Settlement from "../models/SettlementModel.js";

export const generateSettlements =
async (tripId) => {

  const expenses =
    await Expense.find({ tripId })
      .populate(
        "payers.user",
        "name profilePicture"
      )
      .populate(
        "participants",
        "name profilePicture"
      );

  const balances = {};

  for (
    const expense
    of expenses
  ) {

    const totalAmount =
      expense.payers.reduce(
        (sum, payer) =>
          sum + payer.amount,
        0
      );

    const share =
      totalAmount /
      expense.participants.length;

    for (
      const payer
      of expense.payers
    ) {

      const userId =
        payer.user._id.toString();

      if (
        !balances[userId]
      ) {

        balances[userId] = {
          user:
            payer.user._id,
          balance: 0
        };

      }

      balances[userId]
        .balance +=
        payer.amount;

    }

    for (
      const participant
      of expense.participants
    ) {

      const userId =
        participant._id.toString();

      if (
        !balances[userId]
      ) {

        balances[userId] = {
          user:
            participant._id,
          balance: 0
        };

      }

      balances[userId]
        .balance -= share;

    }

  }

  const creditors = [];
  const debtors = [];

  Object.values(
    balances
  ).forEach(
    entry => {

      if (
        entry.balance > 0
      ) {

        creditors.push({
          user:
            entry.user,
          amount:
            entry.balance
        });

      }

      if (
        entry.balance < 0
      ) {

        debtors.push({
          user:
            entry.user,
          amount:
            Math.abs(
              entry.balance
            )
        });

      }

    }
  );

  await Settlement.deleteMany({
    tripId
  });

  let creditorIndex = 0;
  let debtorIndex = 0;

  const settlements = [];

  while (

    creditorIndex <
      creditors.length &&

    debtorIndex <
      debtors.length

  ) {

    const creditor =
      creditors[
        creditorIndex
      ];

    const debtor =
      debtors[
        debtorIndex
      ];

    const amount =
      Number(
        Math.min(
          creditor.amount,
          debtor.amount
        ).toFixed(2)
      );

    settlements.push({

      tripId,

      from:
        debtor.user,

      to:
        creditor.user,

      amount,

      status:
        "Pending"

    });

    creditor.amount -=
      amount;

    debtor.amount -=
      amount;

    if (
      creditor.amount <
      0.01
    ) {

      creditorIndex++;

    }

    if (
      debtor.amount <
      0.01
    ) {

      debtorIndex++;

    }

  }

  if (
    settlements.length
  ) {

    await Settlement.insertMany(
      settlements
    );

  }

};