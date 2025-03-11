import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Stack, Button, } from "react-bootstrap"
import BudgetCard from "./BudgetCard";
import AddBudgetModal from "./AddBudgetModal";
import { useState, } from "react";
import { UNCATEGORISED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext";
import AddExpenseModal from "./AddExpenseModal";
import UncategorisedBudgetCard from "./UncategorisedBudgetCard";
import TotalBudgetCard from "./TotalBudgetCard";
import ViewExpensesModal from "./ViewExpensesModal";

function App() {

  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setviewExpensesModalBudgetId] = useState()
  const [addExpenseModalBudgetID, setaddExpenseModalBudgetID] = useState()
  
  const {budgets, getBudgetExpenses} = useBudgets()

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setaddExpenseModalBudgetID(budgetId)
  }

  return (
    <>
      <Container className="my-4">
        <Stack direction="horizontal" gap={2} className="mb-4">
          <h1 className="me-auto">Budgets</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
          <Button variant="outline-primary" onClick={openAddExpenseModal}>Add Expense</Button>
        </Stack>

        <div style={{
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr)", 
          gap: "1rem", 
          alignItems: "flex-start"
          }}
          >
        {budgets.map(budget => {

          const amount = getBudgetExpenses(budget.id).reduce((total, expense) => total + expense.amount, 0)

           return (
           <BudgetCard 
           key={budget.id} 
           name={budget.name} 
           amount={amount} 
           max={budget.max} 
           onAddExpenseClick={() => openAddExpenseModal(budget.id)}
           onViewExpensesClick={() => setviewExpensesModalBudgetId(budget.id)}
           />
           )

        })}

          <UncategorisedBudgetCard onAddExpenseClick={openAddExpenseModal} onViewExpensesClick={() => setviewExpensesModalBudgetId(UNCATEGORISED_BUDGET_ID)}/>
          <TotalBudgetCard />
        </div>
      </Container>

      <AddBudgetModal show={showAddBudgetModal} handleClose={(() => setShowAddBudgetModal(false))}/>
      <AddExpenseModal show={showAddExpenseModal} handleClose={(() => setShowAddExpenseModal(false))} defaultBudgetID={addExpenseModalBudgetID}/>
      <ViewExpensesModal budgetId={viewExpensesModalBudgetId} handleClose={() => setviewExpensesModalBudgetId()} />

    </>
  );
}

export default App;
