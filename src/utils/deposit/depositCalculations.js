/**
 * House of Kaira - Deposit Worked Example Calculation Engine
 * Section 7.5 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import { DEPOSIT_SETTINGS } from '../../data/deposit/depositSettings.js';

/**
 * Formats a number in Indian rupee grouping (e.g. 25000 -> ₹25,000, 180000 -> ₹1,80,000)
 */
export const formatINR = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
};

/**
 * Worked example baseline inputs
 */
export const EXAMPLE_INPUTS = {
  piece: 'bridal lehenga',
  rentalLength: '4 days',
  dailyRate: 2500,
  deposit: 25000,
  replacementValue: 180000,
  stainTreatmentCost: 3200,
  gstRate: DEPOSIT_SETTINGS.gst_rate_decimal || 0.18
};

/**
 * Generates computed statement data for all 4 worked example tabs
 */
export const calculateWorkedExamples = (inputs = EXAMPLE_INPUTS, settings = DEPOSIT_SETTINGS) => {
  const { piece, dailyRate, deposit, replacementValue, stainTreatmentCost, gstRate } = inputs;

  // 1. Returned on time
  const returnedOnTime = {
    id: 'returned-on-time',
    label: 'Returned on time',
    lines: [
      { label: 'Deposit in safekeeping', amount: formatINR(deposit), isNegative: false, isZero: false },
      { label: 'Late return', amount: 'Nothing', isNegative: false, isZero: true },
      { label: 'Restoration', amount: 'Nothing', isNegative: false, isZero: true }
    ],
    totalLabel: 'Returned to you',
    totalAmount: formatINR(deposit),
    isBalanceDue: false,
    notes: [
      `Returned within ${settings.deposit_refund_window} of inspection, to the account it came from.`,
      'Gentle signs of wear, and our professional care after every rental, are never charged to you.'
    ]
  };

  // 2. One day late
  const extraDayCost = dailyRate;
  const gstExtraDay = Math.round(extraDayCost * gstRate);
  const totalExtraDayWithGst = extraDayCost + gstExtraDay;
  const returnedOneDayLate = deposit - totalExtraDayWithGst;

  const oneDayLate = {
    id: 'one-day-late',
    label: 'One day late',
    lines: [
      { label: 'Deposit in safekeeping', amount: formatINR(deposit), isNegative: false, isZero: false },
      { label: 'Late return: 1 extra day at the daily rate', amount: `(${formatINR(extraDayCost)})`, isNegative: true, isZero: false },
      { label: `GST on the extra day at ${Math.round(gstRate * 100)}%`, amount: `(${formatINR(gstExtraDay)})`, isNegative: true, isZero: false }
    ],
    totalLabel: 'Returned to you',
    totalAmount: formatINR(returnedOneDayLate),
    isBalanceDue: false,
    notes: [
      `You receive a GST invoice for the ${formatINR(totalExtraDayWithGst)} charged for the extra day.`,
      'Had the extra day been agreed before your Return Date, it would have cost exactly the same, so it is always worth asking.'
    ]
  };

  // 3. A stain to restore
  const returnedStain = deposit - stainTreatmentCost;

  const stainToRestore = {
    id: 'stain-to-restore',
    label: 'A stain to restore',
    lines: [
      { label: 'Deposit in safekeeping', amount: formatINR(deposit), isNegative: false, isZero: false },
      { label: 'Specialist stain care and hand finishing', amount: `(${formatINR(stainTreatmentCost)})`, isNegative: true, isZero: false },
      { label: 'GST on restoration', amount: 'None', isNegative: false, isZero: true }
    ],
    totalLabel: 'Returned to you',
    totalAmount: formatINR(returnedStain),
    isBalanceDue: false,
    notes: [
      `The ${formatINR(returnedStain)} not in question is returned within ${settings.deposit_refund_window} of inspection. The ${formatINR(stainTreatmentCost)} is settled only after you have had ${settings.deduction_reply_within} to reply.`,
      'No GST applies, because this amount restores the piece rather than paying for anything you receive.'
    ]
  };

  // 4. Lost or not returned
  const balanceDue = replacementValue - deposit;

  const lostOrNotReturned = {
    id: 'lost-or-not-returned',
    label: 'Lost or not returned',
    lines: [
      { label: `Replacement Value of the ${piece}`, amount: formatINR(replacementValue), isNegative: false, isZero: false },
      { label: 'Your deposit, applied towards it', amount: `(${formatINR(deposit)})`, isNegative: true, isZero: false },
      { label: 'GST on the balance', amount: 'None', isNegative: false, isZero: true }
    ],
    totalLabel: 'Balance to be settled',
    totalAmount: formatINR(balanceDue),
    isBalanceDue: true,
    notes: [
      `Settled within ${settings.balance_due} of our written statement, once we have talked it through with you.`,
      'The Replacement Value is shown in your booking summary before you pay, so it is never a surprise.'
    ]
  };

  return {
    tabs: [returnedOnTime, oneDayLate, stainToRestore, lostOrNotReturned],
    intro: `One piece, and four ways a rental can end. Here, a ${piece} is rented for ${inputs.rentalLength}, with a daily rate of ${formatINR(dailyRate)}, a deposit of ${formatINR(deposit)} and a Replacement Value of ${formatINR(replacementValue)}.`
  };
};

export default calculateWorkedExamples;
