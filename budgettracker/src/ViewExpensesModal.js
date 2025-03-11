import { Modal, Button, Stack} from "react-bootstrap"
import { UNCATEGORISED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext"
import { currenctFormatter } from "./utils"

export default function ViewExpensesModal( {budgetId, handleClose} ) {

    const {getBudgetExpenses, budgets, deleteBudget, deleteExpense} = useBudgets()
    const budget = UNCATEGORISED_BUDGET_ID === budgetId ? { name: "Uncategorised", id: UNCATEGORISED_BUDGET_ID} : budgets.find(budget => budget.id === budgetId)
    const expenses = getBudgetExpenses(budgetId)

  return (
    <>
    <Modal show={budgetId != null} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>
                <Stack direction="horiozontal" gap={2}>
                    <div>Expenses = {budget?.name} </div>
                    {budgetId !== UNCATEGORISED_BUDGET_ID && (
                        <Button variant="outline-danger"onClick={() => {deleteBudget(budget); handleClose()}}>Delete</Button>
                    )}
                </Stack>
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Stack direction="vertical" gap={3}>
                {expenses.map(expense => (
                    <Stack direction="horizontal" gap={2} key={expense.id}>
                        <div className="me-auto fs-4">{expense.description}</div>
                        <div className="fs-5">{currenctFormatter.format(expense.amount)}</div>
                        <Button size="sm" variant="outline-danger" onClick={() => deleteExpense(expense)}>&times;</Button>
                    </Stack>
                ))}
            </Stack>
        </Modal.Body>
    </Modal>
    </>
  )
}
