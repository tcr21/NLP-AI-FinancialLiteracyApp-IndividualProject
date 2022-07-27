import ErrorMessage from "../common/error-message";
import { PieChart } from "react-minimal-pie-chart";

function LoanCalculatorOutput({
  inputType,
  amountBorrowed,
  loanTerm,
  interestRate,
  fees,
  apr,
}) {
  console.log("Input type", inputType);

  // Functions
  const calcTotalCostOfLoan = (
    amountBorrowedFlt,
    loanTermMonths,
    interestOrAprFlt
  ) => {
    let remainderCapitalToRepay = amountBorrowedFlt;
    let totalCostOfLoan = 0;
    let monthlyCapitalRepayment = amountBorrowedFlt / loanTermMonths;
    for (let i = 0; i < loanTermMonths; i++) {
      totalCostOfLoan += (1 / 12) * interestOrAprFlt * remainderCapitalToRepay;
      remainderCapitalToRepay -= monthlyCapitalRepayment;
    }
    return totalCostOfLoan;
  };

  const calcTotalAmountToRepay = (totalCostOfLoan, amountBorrowedFlt) => {
    let totalAmountToRepay = totalCostOfLoan + amountBorrowedFlt;
    return totalAmountToRepay;
  };

  const calcTotalMonthlyRepayment = (totalAmountToRepay, loanTermMonths) => {
    let totalMonthlyRepayment = totalAmountToRepay / loanTermMonths;
    return totalMonthlyRepayment;
  };

  let contents;

  // Scenario 1: I have a loan------------------------------------------------------
  if (inputType === "Amount borrowed") {
    // Common
    let amountBorrowedFlt = parseFloat(amountBorrowed);
    let loanTermMonths = parseInt(loanTerm);
    let interestRateFlt = parseFloat(interestRate) / 100;
    let feesFlt = parseFloat(fees);
    let aprFlt = parseFloat(apr) / 100;

    let totalCostOfLoan;
    let totalAmountToRepay;
    let totalMonthlyRepayment;

    let missingFees = false;
    let missingInterestRate = false;

    // Set missing inputs (NaN) to 0
    if (isNaN(amountBorrowedFlt)) {
      amountBorrowedFlt = 0;
    }
    if (isNaN(loanTermMonths)) {
      loanTermMonths = 0;
    }
    if (isNaN(interestRateFlt)) {
      interestRateFlt = 0;
    }
    if (isNaN(feesFlt)) {
      feesFlt = 0;
    }
    if (isNaN(aprFlt)) {
      aprFlt = 0;
    }

    console.log("Amount borrowed", amountBorrowedFlt);
    console.log("Loan term", loanTermMonths);
    console.log("Interest rate", interestRateFlt);
    console.log("Fees", feesFlt);
    console.log("APR", aprFlt);

    // Handle missing essential inputs: loan amount or missing costs or missing loan term
    if (
      amountBorrowedFlt === 0 ||
      loanTermMonths === 0 ||
      (interestRateFlt === 0 && feesFlt === 0 && aprFlt === 0)
    ) {
      return (
        <div>
          <PieChart
            data={[
              {
                title: "Missing key inputs",
                value: 100,
                color: "#A9A9A9",
              },
            ]}
            lineWidth={40}
          />
          {/* TO DO: Format to fix */}
          <p class="text-red-700 text-sm italic">
            Please input 1 and 2, and at least one of
          </p>
          <p class="text-red-700 text-sm italic">
            {" "}
            3, 4 or 5 on the left hand side.
          </p>
        </div>
      );
    }

    // Handle cost calculation scenarios
    if (interestRateFlt !== 0 && feesFlt !== 0 && aprFlt === 0) {
      console.log("Test interest & fees condition");
      // Interest & fees
      totalCostOfLoan = calcTotalCostOfLoan(
        amountBorrowedFlt,
        loanTermMonths,
        interestRateFlt
      );
      totalCostOfLoan += feesFlt;
    } else if (interestRateFlt !== 0 && feesFlt === 0 && aprFlt === 0) {
      // Interest only
      totalCostOfLoan = calcTotalCostOfLoan(
        amountBorrowedFlt,
        loanTermMonths,
        interestRateFlt
      );
      missingFees = true;
    } else if (interestRateFlt === 0 && feesFlt !== 0 && aprFlt === 0) {
      // Fees only
      totalCostOfLoan = feesFlt;
      missingInterestRate = true;
    } else if ((interestRateFlt === 0 || feesFlt === 0) && aprFlt !== 0) {
      // Apr (if one of interest or fees are missing, apr takes precedence)
      totalCostOfLoan = calcTotalCostOfLoan(
        amountBorrowedFlt,
        loanTermMonths,
        aprFlt
      );
    } else if (interestRateFlt !== 0 && feesFlt !== 0 && aprFlt !== 0) {
      // All of APR, interest and fees are there
      // Interest & fees option
      let totalCostOfLoanInterest = calcTotalCostOfLoan(
        amountBorrowedFlt,
        loanTermMonths,
        interestRateFlt
      );
      totalCostOfLoanInterest += feesFlt;
      // Apr option
      let totalCostOfLoanApr = calcTotalCostOfLoan(
        amountBorrowedFlt,
        loanTermMonths,
        aprFlt
      );
      // Compare and choose highest cost
      totalCostOfLoan = Math.max(totalCostOfLoanInterest, totalCostOfLoanApr);
    }

    // Common to all cost calculation scenarios
    totalAmountToRepay = calcTotalAmountToRepay(
      totalCostOfLoan,
      amountBorrowedFlt
    );
    totalMonthlyRepayment = calcTotalMonthlyRepayment(
      totalAmountToRepay,
      loanTermMonths
    );

    // Set contents and handle warnings if missing interest or fees
    if (missingFees === true) {
      contents = (
        <div>
          <PieChart
            data={[
              {
                title: "Amount borrowed",
                value: Math.round(amountBorrowedFlt),
                color: "#32CD32",
              },
              {
                title: "Cost of loan",
                value: Math.round(totalCostOfLoan),
                color: "#DC143C",
              },
            ]}
            lineWidth={40}
          />

          <p>Amount borrowed: {Math.round(amountBorrowedFlt)}</p>
          <p>Total cost of loan: {Math.round(totalCostOfLoan)}</p>
          <p>Total amount to repay: {Math.round(totalAmountToRepay)}</p>
          <p>Total monthly repayment: {Math.round(totalMonthlyRepayment)}</p>
          <p class="italic">Note: You have not included fees.</p>
        </div>
      );
    } else if (missingInterestRate === true) {
      contents = (
        <div>
          <PieChart
            data={[
              {
                title: "Amount borrowed",
                value: Math.round(amountBorrowedFlt),
                color: "#32CD32",
              },
              {
                title: "Cost of loan",
                value: Math.round(totalCostOfLoan),
                color: "#DC143C",
              },
            ]}
            lineWidth={40}
          />

          <p>Amount borrowed: {Math.round(amountBorrowedFlt)}</p>
          <p>Total cost of loan: {Math.round(totalCostOfLoan)}</p>
          <p>Total amount to repay: {Math.round(totalAmountToRepay)}</p>
          <p>Total monthly repayment: {Math.round(totalMonthlyRepayment)}</p>
          <p class="italic">Note: You have not included interest</p>
        </div>
      );
    } else {
      contents = (
        <div>
          <PieChart
            data={[
              {
                title: "Amount borrowed",
                value: Math.round(amountBorrowedFlt),
                color: "#32CD32",
              },
              {
                title: "Cost of loan",
                value: Math.round(totalCostOfLoan),
                color: "#DC143C",
              },
            ]}
            lineWidth={40}
          />
          <p>Amount borrowed: {Math.round(amountBorrowedFlt)}</p>
          <p>Total cost of loan: {Math.round(totalCostOfLoan)}</p>
          <p>Total amount to repay: {Math.round(totalAmountToRepay)}</p>
          <p>Total monthly repayment: {Math.round(totalMonthlyRepayment)}</p>
        </div>
      );
    }
    // Scenario 2: I want a loan------------------------------------------------------
  } else if (inputType === "Monthly amount you can repay") {
    contents = <></>;
  } else {
    contents = (
      <ErrorMessage>
        Sorry, something went wrong. Please try again.
      </ErrorMessage>
    );
  }

  return contents;
}

export default LoanCalculatorOutput;
