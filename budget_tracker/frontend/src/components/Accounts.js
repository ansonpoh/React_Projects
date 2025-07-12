import {useState } from "react";
import Navbar from "./Navbar";
import SideModal from "../modals/SlideModal";
import { useRef } from "react";
import axios from "axios"
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function Accounts() {
    const [isOpen, setIsOpen] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [reverse, setReverse] = useState(false);
    const [query, setQuery] =  useState("");
    const [filtered, setFiltered] = useState(accounts);
    const [checkedItems, setCheckedItems] = useState({});
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [delay, setDelay] = useState(false);

    const {user} = useUser()
    const user_id = user.user_id;
    const accountRef = useRef(null);

    //Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {user_id: user_id, account: accountRef.current.value}
        axios.post("http://localhost:3001/add_account", formData)
        .then((res) => {
            const status = res.data.status;
            if(status) setIsOpen(false);
            accountRef.current.value = ""
        })
        .catch(err => console.error("Error: ", err))
        setRefreshToggle(prev => !prev)
    }
    
    const handleDelete = (e) => {
        e.preventDefault();
        const toDelete = Object.keys(checkedItems)
        const data = {user_id: user_id, accounts: toDelete}
        axios.post("http://localhost:3001/delete_accounts", data)
        .catch(err => console.error(err))
        setRefreshToggle(prev => !prev)
    } 


    //Get categories from DB
    const get_accounts = async () => {
        try {
            const res = await axios.post("http://localhost:3001/get_accounts", {user_id: user_id})
            return res.data.accounts
        } catch (err) {
            console.error("Error: ", err)
        }
    }

    //Sort categories
    const sort_accounts = (e) => {
        e.preventDefault();
        setReverse(prev => !prev)
    }

    //UseEffects
    useEffect(() => {
        const fetch_accounts = async () => {
            const res = await get_accounts();
            const acc_arr = res.map(e => e.account);
            setAccounts(acc_arr);
        };
        fetch_accounts();
    }, [refreshToggle])

    //Display categories
    useEffect(() => {
        if(query === "") {
            setFiltered(reverse ? [...accounts].reverse() : accounts)
        } else {
            const res = accounts.filter(cat => cat.toLowerCase().includes(query.toLowerCase()));
            setFiltered(reverse ? res.reverse() : res)
        }
    }, [query, accounts, reverse])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelay(true);
        }, 100)
        return () => clearTimeout(timer)
    }, []);

    const generate_accounts = () => {
        if(!delay) return null;
        if(filtered.length === 0) {
            return (
                <>
                <thead>
                    <tr>
                        <th className="account_table_box">
                            <input type="checkbox" 
                            checked={isAllChecked} onChange={handleSelectAll}/>
                        </th>
                        <th className="account_table_name_header" onClick={sort_accounts}>Name↑↓</th>
                        <th className="account_table_edit">. . .</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="account_table_box"><input type="checkbox" /></td>
                        <td className="account_table_name"> None Found </td>
                        <td></td>
                    </tr>
                </tbody>
                </>
            )
        } else {
            return (
                <>
                <thead>
                    <tr>
                        <th className="account_table_box">
                            <input type="checkbox" 
                            checked={isAllChecked} onChange={handleSelectAll}/>
                        </th>
                        <th className="account_table_name_header" onClick={sort_accounts}>Name↑↓</th>
                        <th className="account_table_edit">. . .</th>
                    </tr>
                </thead>
                
                <tbody>
                    {filtered.map((account,i) => (
                        <tr key={i}>
                            <td className="account_table_box">
                                <input type="checkbox" 
                                checked={!!checkedItems[account]}
                                onChange={() => {
                                    handleCheckBoxChange(account)
                                }}/>
                            </td>
                            <td className="account_table_name">{account}</td>
                            <td className="account_table_edit">. . .</td>
                        </tr>
                    ))}
                </tbody>

                </>
            )
        }
    }

    //Handles Checkboxes
    const handleCheckBoxChange = (category) => {
        setCheckedItems(prev => ({
            ...prev,
            [category]: !prev[category]
        }))
    }

    const handleSelectAll = () => {
        const allChecked = filtered.every(cat => checkedItems[cat]);
        const newCheckedState = {};
        filtered.forEach(cat => {
            newCheckedState[cat] = !allChecked;
        });
        setCheckedItems(prev => ({...prev, ...newCheckedState}))
    }

    const isAllChecked = filtered.length > 0 && filtered.every(acc => checkedItems[acc]);
    const isAnyChecked = Object.values(checkedItems).some(value => value);


    return (
        <>
            <Navbar />

            <SideModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="add_account_form">
                    <form >
                        <h3>Add Account</h3>
                        <input type="text" ref={accountRef} autoComplete="off"/>
                        <button type="submit" onClick={handleSubmit}>Add</button>
                    </form>
                </div>
            </SideModal>

            <div>
                <div className="account_header">
                    <div>Accounts</div>
                    <div className="add_new" onClick={() => setIsOpen(true)}>+ Add New</div> 
                </div>

                <div className="account_search">
                    <input type="text" className="account_searchbar" 
                    placeholder="Search..." autoComplete="off"
                    onChange={(e) => setQuery(e.target.value)}/>
                    {isAnyChecked && (
                        <button onClick={handleDelete} className="account_delete">Delete</button>
                    )}
                </div>

                <div className="account_table">
                    <table>
                        {generate_accounts()}
                    </table>
                </div>
            </div>

        </>
    )
}
