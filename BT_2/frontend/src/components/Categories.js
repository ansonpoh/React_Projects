import {useState } from "react";
import Navbar from "./Navbar";
import SideModal from "../modals/SlideModal";
import { useRef } from "react";
import axios from "axios"
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function Categories() {
    const [isOpen, setIsOpen] = useState(null);
    const [categories, setCategories] = useState([]);
    const [reverse, setReverse] = useState(false);
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState(categories);
    const [checkedItems, setCheckedItems] = useState({});
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [delay, setDelay] = useState(false);

    const {user} = useUser()

    const user_id = user.user_id;
    const categoryRef = useRef(null);
    const typeRef = useRef(null);

    //Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            user_id: user_id, 
            category: categoryRef.current.value, 
            type: typeRef.current.value
        }
        axios.post("http://localhost:3001/add_category", formData)
        .then((res) => {
            const status = res.data.status;
            if(status) setIsOpen(false);
            categoryRef.current.value = ""
        })
        .catch(err => console.error(err))
        setRefreshToggle(prev => !prev)
    }
    
    const handleDelete = (e) => {
        e.preventDefault();
        const toDelete = Object.keys(checkedItems)
        const data = {user_id: user_id, categories: toDelete}
        axios.post("http://localhost:3001/delete_categories", data)
        .catch(err => console.error(err))
        setRefreshToggle(prev => !prev)
    } 


    //Get categories from DB
    const get_categories = async () => {
        try {
            const res = await axios.post("http://localhost:3001/get_categories", {user_id: user_id})
            return res.data.categories
        } catch (err) {
            console.error(err)
        }
    }

    //Sort categories
    const sort_categories = (e) => {
        e.preventDefault();
        setReverse(prev => !prev)
    }

    useEffect(() => {
        const fetch_categories = async () => {
            const res = await get_categories();
            const cat_arr = res.map(e => e.category);
            setCategories(cat_arr);
        };
        fetch_categories();
    }, [refreshToggle])

    //Display categories
    useEffect(() => {
        if(query === "") {
            setFiltered(reverse ? [...categories].reverse() : categories);
        } else {
            const res = categories.filter(cat => cat.toLowerCase().includes(query.toLowerCase()));
            setFiltered(reverse ? res.reverse() : res);
        }
    }, [query, categories, reverse])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelay(true);
        }, 100)
        return () => clearTimeout(timer)
    }, []);

    const generate_categories = () => {
        if(!delay) return null;
        if(filtered.length === 0) {
            return (
                <>
                <thead>
                    <tr>
                        <th className="category_table_box">
                            <input type="checkbox" 
                            checked={isAllChecked} onChange={handleSelectAll}/>
                        </th>
                        <th className="category_table_name_header" onClick={sort_categories}>Name↑↓</th>
                        <th className="category_table_edit">. . .</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="category_table_box"><input type="checkbox" /></td>
                        <td className="category_table_name"> None Found </td>
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
                        <th className="category_table_box">
                            <input type="checkbox" 
                            checked={isAllChecked} onChange={handleSelectAll}/>
                        </th>
                        <th className="category_table_name_header" onClick={sort_categories}>Name↑↓</th>
                        <th className="category_table_edit">. . .</th>
                    </tr>
                </thead>
                
                <tbody>
                    {filtered.map((category,i) => (
                        <tr key={i}>
                            <td className="category_table_box">
                                <input type="checkbox" 
                                checked={!!checkedItems[category]}
                                onChange={() => {
                                    handleCheckBoxChange(category)
                                }}/>
                            </td>
                            <td className="category_table_name">{category}</td>
                            <td className="category_table_edit">. . .</td>
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
        console.log(checkedItems)
    }

    const handleSelectAll = () => {
        const allChecked = filtered.every(cat => checkedItems[cat]);
        const newCheckedState = {};
        filtered.forEach(cat => {
            newCheckedState[cat] = !allChecked;
        });
        setCheckedItems(prev => ({...prev, ...newCheckedState}))
    }

    const isAllChecked = filtered.length > 0 && filtered.every(cat => checkedItems[cat]);
    const isAnyChecked = Object.values(checkedItems).some(value => value);

    return (
        <>
            <Navbar />

            <SideModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="add_category_form">
                    <form >
                        <h3>Add Category</h3>
                        <input 
                            type="text" 
                            ref={categoryRef} 
                            autoComplete="off" 
                            style={{height:"1.5rem", width:"12rem", fontSize:"1rem"}} 
                            required/>
                        <br/><br/>

                        <select ref={typeRef} style={{width:"13rem", height:"1.8rem", fontSize:"1rem"}}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <button type="submit" onClick={handleSubmit}>Add</button>
                    </form>
                </div>
            </SideModal>

            <div>
                <div className="category_header">
                    <div>Categories</div>
                    <div className="add_new" onClick={() => setIsOpen(true)}>+ Add New</div> 
                </div>

                <div className="category_search">
                    <input type="text" className="category_searchbar" 
                    placeholder="Search..." autoComplete="off"
                    onChange={(e) => setQuery(e.target.value)}/>
                    {isAnyChecked && (
                        <button onClick={handleDelete} className="category_delete">Delete</button>
                    )}
                </div>

                <div className="category_table">
                    <table>
                        {generate_categories()}
                    </table>
                </div>
            </div>

        </>
    )
}
