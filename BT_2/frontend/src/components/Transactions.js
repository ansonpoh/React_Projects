import Navbar from "./Navbar";
import { useEffect, useMemo, useRef, useState } from "react";
import SideModal from "../modals/SlideModal.js";
import DatePicker from "react-datepicker";
import axios from "axios";
import {format} from "date-fns"

import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../context/UserContext.js";

export default function Transactions() {

    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categoryType, setCategoryType] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [delay, setDelay] = useState(false);

    const [sortKey, setSortKey] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");

    const [filteredDate, setFilteredDate] = useState(new Date())
    const [filteredAccount, setFilteredAccount] = useState("all")

    const {user} = useUser()
    const user_id = user.user_id;

    const categoryRef = useRef(null);
    const amountRef = useRef(null);
    const accountRef = useRef(null);
    const typeRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            user_id:user_id, 
            date: format(date,"yyyy-MM-dd"),
            amount: amountRef.current.value,
            account: accountRef.current.value,
            category: categoryRef.current.value,
            type: typeRef.current.value,
        }
        axios.post("http://localhost:3001/add_transaction", formData)
            .then((res) => {
                const status = res.data.status;
                if(status) setIsOpen(false);
            })
            .catch(err => console.error(err))
        setRefreshToggle(prev => !prev);
    }

    const handleDelete = (e) => {
        e.preventDefault();
        const toDelete = Object.keys(checkedItems)
        const data = {user_id: user_id, transactions: toDelete}
        axios.post("http://localhost:3001/delete_transactions", data)
        .catch(err => console.error(err))
        setRefreshToggle(prev => !prev)
    } 

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder((prev => (prev === "asc" ? "desc" : "asc")));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    }

    //Handles Checkboxes
    const handleCheckBoxChange = (transaction) => {
        setCheckedItems(prev => ({
            ...prev,
            [transaction.transaction_id]: !prev[transaction.transaction_id]
        }))
    }

    const handleSelectAll = () => {
        const allChecked = transactions.every(transaction => checkedItems[transaction.transaction_id]);
        const newCheckedState = {};
        transactions.forEach(transaction => {
            newCheckedState[transaction.transaction_id] = !allChecked;
        });
        setCheckedItems(prev => ({...prev, ...newCheckedState}))
    }

    const sortedItems = useMemo(() => {
        return [...transactions].sort((a,b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if(typeof aVal === "string" && typeof bVal === "string") {
                return aVal.localeCompare(bVal) * (sortOrder === "asc" ? 1 : -1)
            }
            
            return (aVal - bVal) * (sortOrder === "asc" ? 1 : -1);
        })
    }, [transactions, sortKey, sortOrder])

    const get_categories = async () => {
        try {
            const response = await axios.post("http://localhost:3001/get_categories_type", {user_id:user_id, type:categoryType});
            setCategories(response.data.categories);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

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

    useEffect(() => {
        const get_accounts = async () => {
            try {
                const response = await axios.post("http://localhost:3001/get_accounts", {user_id});
                setAccounts(response.data.accounts);
            } catch (err) {
                console.error(err);
            }
        }
        
        const timer = setTimeout(() => {
            setDelay(true);
        }, 100)
        
        get_accounts()
        return () => clearTimeout(timer)

    }, [])

    //UseEffect for type, income/expense.
    useEffect(() => {
        if(categoryType) {
            get_categories();
        }
    }, [categoryType])

    //Transactions useEffect.
    useEffect(() => {
        const fetch_transactions = async () => {
            const response = await get_transactions();
            setAllTransactions(response);
            setTransactions(response)
        }
        fetch_transactions();
    }, [refreshToggle, filteredDate])

    useEffect(() => {

        if(filteredAccount !== "all") {
            const filtered = allTransactions.filter((t) => t.account === filteredAccount)
            setTransactions(filtered);
        } else {
            setTransactions(allTransactions);
        }

    }, [refreshToggle, filteredAccount])

    const generate_transactions = () => {
        if(!delay) return null;
        if(transactions.length === 0) {
            return (
                <>
                    <thead>
                        <tr>
                            <th className="category_table_box">
                                <input type="checkbox" 
                                checked={isAllChecked} onChange={handleSelectAll}/>
                            </th>
                            <th onClick={() => handleSort("date")}>Date↑↓</th>
                            <th onClick={() => handleSort("category")}>Category↑↓</th>
                            <th onClick={() => handleSort("amount")}>Amount↑↓</th>
                            <th>Account</th>
                            <th onClick={() => handleSort("type")}>Type↑↓</th>
                        </tr>
                    </thead>  

                    <tbody>
                        <tr>
                            <td colSpan="6" style={{textAlign:"center"}}>None Found</td>
                        </tr>
                    </tbody>
                </>
            )
        }
        
        return (
            <>
            <thead>
                <tr>
                    <th className="category_table_box">
                        <input type="checkbox" 
                        checked={isAllChecked} onChange={handleSelectAll}/>
                    </th>
                    <th onClick={() => handleSort("date")}>Date↑↓</th>
                    <th onClick={() => handleSort("category")}>Category↑↓</th>
                    <th onClick={() => handleSort("amount")}>Amount↑↓</th>
                    <th>Account</th>
                    <th onClick={() => handleSort("type")}>Type↑↓</th>
                </tr>
            </thead>

            <tbody>
                {sortedItems.map((transaction ,i) => (
                    <tr key={i} style={{textAlign: "center"}}>
                        <td className="category_table_box">
                            <input type="checkbox" 
                            checked={!!checkedItems[transaction.transaction_id]}
                            onChange={() => {
                                handleCheckBoxChange(transaction)
                            }}/>
                        </td>
                        <td>{format(transaction.date, "dd-MM-yyyy")}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.account}</td>
                        <td>{transaction.type}</td>
                    </tr>
                ))}
            </tbody>
            </>
        )
    }

    const isAllChecked = transactions.length > 0 && transactions.every(transaction => checkedItems[transaction.transaction_id]);

    const isAnyChecked = Object.values(checkedItems).some(value => value);

    return (
        <>
            <Navbar />
            
            <SideModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="add_category_form">
                    <form >
                        <h3>Add Transaciton</h3>
                        <label>Date: </label> <br />
                        <DatePicker 
                            selected={date} 
                            onChange={(d) => setDate(d)} 
                            dateFormat="dd-MM-yyyy"
                        /> 
                        <br/><br/>

                        <label>Amount: </label> <br/>
                        <input type="number" ref={amountRef} required min="0" style={{height:"1.5rem", width:"12rem", fontSize:"1rem"}} />
                        <br/><br/>

                        <label>Account: </label><br/>
                        <select
                            style={{width:"13rem", height:"1.8rem", fontSize:"1rem"}}
                            ref={accountRef}
                            >
                            {accounts.map((account, i) => (
                                <option
                                    key={i}
                                    value={account.account}
                                    style={{height:"30vh", fontSize: "1rem"}}
                                >
                                    {account.account}
                                </option>
                            ))}
                        </select>
                        <br/><br/>

                        <label>Type: </label><br/>
                        <select 
                            ref={typeRef} 
                            style={{width:"13rem", height:"1.8rem", fontSize:"1rem"}}
                            onChange={(e) => {
                                setCategoryType(e.target.value);
                            }}
                        >
                            <option value="">Select Type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <br/><br/>

                        {categoryType && (
                            <>
                            <label>Category: </label> <br/>
                            <select ref={categoryRef} style={{width:"13rem", height:"1.8rem", fontSize:"1rem"}}>
                                {categories.map((category, i) => (
                                    <option 
                                        key={i} 
                                        value={category.category}
                                        style={{height:"30rem", fontSize: "1rem"}}
                                        >
                                            {category.category}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" onClick={handleSubmit} style={{fontSize:"1rem"}}>
                                Add
                            </button>
                            </>
                        )}
                    </form>
                </div>
            </SideModal>

            <div>
                <div className="transaction_header">
                    <div>Transaction History</div>
                    <div className="add_new" onClick={() => setIsOpen(true)}>+ Add New</div> 
                </div>

                <div className="transaction_search">
                    <div>
                        <label style={{paddingRight:"1rem", fontSize:"clamp(20px, 1vw, 1.5vw)"}}>Filter by Month:</label>
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
                    {isAnyChecked && (
                        <button onClick={handleDelete} className="category_delete">Delete</button>
                    )}
                </div>

                <div className="transaction_table">
                    <table>
                        {generate_transactions()}
                    </table>
                </div>
            </div>

        </>
    )
}