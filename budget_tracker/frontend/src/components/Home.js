import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {LineChart, BarChart, PieChart} from "@mui/x-charts"
import { useRef } from "react";
import { useUser } from "../context/UserContext";

export default function Home() {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const [filteredDate, setFilteredDate] = useState(new Date());
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    
    const [xAxis, setXAxis] = useState([]);
    const [incomeYAxis, setIncomeYAxis] = useState([]);
    const [expenseYAxis, setExpenseYAxis] = useState([]);

    const [incomeCategories, setIncomeCategories] = useState();
    const [expenseCategories, setExpenseCategories] = useState();

    const [selectedGraph, setSelectedGraph] = useState("line");
    const [selectedChart, setSelectedChart] = useState("income");

    const [filteredAccount, setFilteredAccount] = useState("all")
    const [accounts, setAccounts] = useState([])

    const {user} = useUser()
    const username = user.username;
    const user_id = user.user_id;

    const graphRef = useRef("")
    const chartRef = useRef("")
    const month = months[filteredDate.getMonth()];
    const days = new Date(filteredDate.getFullYear(), filteredDate.getMonth()+1, 0).getDate()

    const get_transactions = async () => {
        try {
            const response = await axios.post("http://localhost:3001/get_transactions"
                , {user_id: user_id, month: filteredDate.getMonth()+1, year:filteredDate.getFullYear()});
            return response.data.transactions;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    const get_accounts = async () => {
        try {
            const response = await axios.post("http://localhost:3001/get_accounts" , 
                {user_id: user_id});
            return response.data.accounts;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    useEffect(() => {
        const fetch_transactions = async () => {
            const response = await get_transactions();
            setAllTransactions(response);
            setTransactions(response)
        }

        const fetch_accounts = async () => {
            const res = await get_accounts();
            setAccounts(res)
        }

        fetch_transactions();
        fetch_accounts();
    }, [filteredDate])

    useEffect(() => {
        if(filteredAccount !== "all") {
            const filtered = allTransactions.filter((t) => t.account === filteredAccount)
            setTransactions(filtered);
        } else {
            setTransactions(allTransactions)
        }
    }, [filteredAccount])

    useEffect(() => {
        let temp_income = 0;
        let temp_expense = 0;

        let temp_income_data = {}
        let temp_expense_data = {}

        let temp_income_categories = {}
        let temp_expense_categories = {}
        let temp_income_categories_arr = [];
        let temp_expense_categories_arr = [];

        for(let i = 1; i <= days; i++) {
            temp_income_data[i] = 0
            temp_expense_data[i] = 0
        }

        transactions.forEach(transaction => {
            const dateObj = new Date(transaction.date)
            const date = dateObj.getDate()
            const category = transaction.category
            if(transaction.type === "income") {
                temp_income += transaction.amount;
                temp_income_data[date] += transaction.amount;
                if(category in temp_income_categories) {
                    temp_income_categories[category] += transaction.amount;
                } else {
                    temp_income_categories[category] = transaction.amount;
                }
            } else {
                temp_expense += transaction.amount;
                temp_expense_data[date] += transaction.amount;
                if(category in temp_expense_categories) {
                    temp_expense_categories[category] += transaction.amount;
                } else {
                    temp_expense_categories[category] = transaction.amount
                }
            }
        })

        setIncome(temp_income);
        setExpense(temp_expense)
        setXAxis(Object.keys(temp_income_data))
        setIncomeYAxis(Object.values(temp_income_data))
        setExpenseYAxis(Object.values(temp_expense_data))

        Object.entries(temp_income_categories).forEach(([k, v]) => {
            temp_income_categories_arr.push({label: k, value: v})
        })
        Object.entries(temp_expense_categories).forEach(([k,v]) => {
            temp_expense_categories_arr.push({label: k, value: v})
        })

        setIncomeCategories(temp_income_categories_arr);
        setExpenseCategories(temp_expense_categories_arr)
    }, [transactions])


    return (
        <>

        <Navbar state={{username: username, user_id: user_id}}/>

        <div className="greeting">
            <div>Welcome back, {username}!</div>
            <div>
                <label 
                    style={{
                        paddingRight:"1rem", 
                        paddingLeft:"1rem", 
                    }}>
                    Filter by Month:
                </label>
                <DatePicker 
                        selected={filteredDate} 
                        dateFormat="MMMM-yyyy"
                        showMonthYearPicker
                        onChange={(d) => setFilteredDate(d)}
                /> 
                <label style={{paddingLeft:"1rem", paddingRight:"1rem", fontSize:"clamp(20px, 1vw, 1.5vw)"}}>Filter by Account: </label>
                <select onChange={(e) => setFilteredAccount(e.target.value)}>
                    <option value="all">All</option>
                    {accounts.map((account, i) => (
                        <option key={i} value={account.account}>{account.account}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="first_row">
            <div className="card">
                <div>Income</div>
                <div className="values">${income.toFixed(2)}</div>
            </div>

            <div className="card">
                <div>Expenses</div>
                <div className="values">${expense.toFixed(2)}</div>
            </div>

            <div className="card">
                <div>Remaining</div>
                <div className="values">${(income - expense).toFixed(2)}</div>
            </div>

            
        </div>

        <div className="second_row">
            <div className="graph_card">
                <div className="graph_card_header">
                    Transactions
                    <select ref={graphRef} onChange={(e) => setSelectedGraph(e.target.value)}>
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="area">Area Chart</option>
                    </select>
                </div>
                <div>
                    {xAxis.length > 0 && selectedGraph === "line" && (
                        <>
                        <LineChart
                            xAxis={[
                                { 
                                    data: xAxis, 
                                    valueFormatter: (value) => `${Math.round(value).toString()} ${month}`,
                                    min: 1,
                                    max: days, 
                                }
                            ]}

                            series={[
                                {
                                    label:"Income", 
                                    data: incomeYAxis, 
                                    color: "blue", 
                                    showMark:false,
                                    valueFormatter: (value) => `$${value}`
                                },
                                {
                                    label:"Expense", 
                                    data: expenseYAxis, 
                                    color: "red", 
                                    showMark:false,
                                    valueFormatter: (value) => `-$${value}`
                                }
                            ]}
                            height={300}
                        />
                        </>
                    )}

                    {xAxis.length > 0 && selectedGraph === "bar" && (
                        <>
                        <BarChart 
                            xAxis={[
                                { 
                                    data: xAxis, 
                                    valueFormatter: (value) => `${Math.round(value).toString()} ${month}`,
                                    min: 1,
                                    max: days, 
                                }
                            ]}

                            series={[
                                {
                                    label:"Income", 
                                    data: incomeYAxis, 
                                    color: "blue", 
                                    valueFormatter: (value) => `$${value}`
                                },
                                {
                                    label:"Expense", 
                                    data: expenseYAxis, 
                                    color: "red", 
                                    valueFormatter: (value) => `-$${value}`
                                }
                            ]}

                            height={300}
                        />
                        </>
                    )}

                    {xAxis.length > 0 && selectedGraph === "area" && (
                        <>
                        <LineChart
                            xAxis={[
                                { 
                                    data: xAxis, 
                                    valueFormatter: (value) => `${Math.round(value).toString()} ${month}`,
                                    min: 1,
                                    max: days, 
                                }
                            ]}

                            series={[
                                {
                                    label:"Income", 
                                    data: incomeYAxis, 
                                    color: "blue", 
                                    showMark:false,
                                    valueFormatter: (value) => `$${value}`,
                                    area:true,
                                },
                                {
                                    label:"Expense", 
                                    data: expenseYAxis, 
                                    color: "red", 
                                    showMark:false,
                                    valueFormatter: (value) => `-$${value}`,
                                    area:true,
                                }
                            ]}
                            height={300}
                        />
                        </>
                    )}
                </div>
            </div>


            <div className="charts_card">
                <div className="charts_card_header">
                    Categories
                    <select ref={chartRef} onChange={(e) => setSelectedChart(e.target.value)}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div>
                    {xAxis.length > 0 && selectedChart === "income" && (
                        <>
                        <PieChart 
                            series={[{
                                data: incomeCategories
                            }]}
                            width={200}
                            height={200}
                        />
                        </>
                    )}

                    {xAxis.length > 0 && selectedChart === "expense" && (
                        <>
                        <PieChart 
                            series={[{
                                data:expenseCategories
                            }]}
                            width={200}
                            height={200}
                        />
                        </>
                    )}
                </div>
            </div>

        </div>

        </>
    )
}