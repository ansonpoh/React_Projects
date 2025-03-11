import BudgetCard from "./BudgetCard";
import { UNCATEGORISED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext";

export default function UncategorisedBudgetCard(props) {

    const { getBudgetExpenses } = useBudgets()
    const amount = getBudgetExpenses(UNCATEGORISED_BUDGET_ID).reduce(
        (total, expense) => total + expense.amount, 0
    )
    if(amount === 0) return null

  return <BudgetCard name="Uncategorised" amount={amount} gray {...props}/>

}
