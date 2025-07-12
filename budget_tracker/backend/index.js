import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"
import {signup, get_email, validate_username, get_user_id, add_category, 
    validate_category, get_categories, 
    delete_categories,
    get_accounts,
    validate_account,
    add_account,
    delete_account,
    add_transaction,
    get_categories_type,
    get_transactions,
    delete_transaction,
    get_username,
    get_username_2,
    get_password,
    change_password,
    change_username} from "./sql.js";
import util from "util"

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.listen(3001, () => {
    console.log("3001");
});

//For BCrypt
const saltRounds = 10;

app.post("/signup", (req, res) => {
    const data = req.body
    const username = data.username
    const email = data.email
    const password = data.password
    const errors = [];

    // Password minimum length 8.
    if(password.length < 8) {
        errors.push("Password needs to be at least 8 characters.")
        res.json({errors: errors, success: false})
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if(err) {
            console.error( err)
            return
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if(err) {
                console.error(err)
                return
            }

            (async () => {
                try {
                    const check_email = await get_email(email)
                    const check_username = await validate_username(username)
                    if (check_email.length > 0) {
                        errors.push("Email is already in use.")
                        res.json({errors: errors, success: false})
                    } else if (check_username.length > 0) {
                        errors.push("Username already in use.")
                        res.json({errors: errors, success: false})
                    } else {
                        const id = uuid()
                        signup(id, username, hash, email)
                        res.json({errors: errors, success: true, user_id:id})
                    }
                } catch (err) {
                    console.log(err)
                }
            })();

        })
    })
    
})

app.post("/login", (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password.toString();
    const errors = [];

    (async () => {
        try {
            const user = await get_username_2(username);
            if(user.length > 0) {
                const hashed_password = user[0].password.toString()
                const bcrypt_compare = util.promisify(bcrypt.compare);
                const result = await bcrypt_compare(password, hashed_password);
                if(result) {
                    const temp_id = await get_user_id(username)
                    const user_id = temp_id[0].user_id
                    return res.json({errors: errors, success: true, user_id: user_id})
                } else {
                    errors.push("Invaid username or password. Wrong PW")
                    return res.json({errors: errors, success: false})
                }

            } else {
                errors.push("Invaid username or password. None User")
                return res.json({errors: errors, success: false})
            }
        } catch (err) {
            console.error(err);
        }
    })();
})

//Categories
app.post("/get_categories", async (req,res) => {
    const {user_id} = req.body;

    try {
        const categories = await get_categories(user_id);
        return res.json({categories});
    } catch(err) {
        console.error(err);
        throw err;
    }
})

app.post("/get_categories_type", async (req,res) => {
    const {user_id, type} = req.body;

    try {
        const categories = await get_categories_type(user_id, type)
        return res.json({categories})
    } catch (err) {
        console.error(err);
        throw err;
    }
})

app.post("/add_category", async (req,res) => {
    const { user_id, category, type } = req.body;

    try {
        const existing_category = await validate_category(user_id, category);
        if(existing_category.length > 1) {
            return res.json({status: false, message: "Category already exists."})
        } else {
            const status = await add_category(user_id, category, type)
            if(status) return res.json({status: true})
            else return res.json({status: false})
        }
    } catch (err) {
        console.error(err)
        throw err;
    }
})

app.post("/delete_categories", async (req, res) => {
    const { user_id, categories } = req.body;

    try {
        const statusPromises = categories.map(category => {
            delete_categories(user_id, category)
        });
        const statuses = await Promise.all(statusPromises)
        return res.json({statuses});
    } catch (err) {
        console.error(err);
        throw err;
    }
})

//Accounts
app.post("/get_accounts", async (req, res) => {
    const {user_id} = req.body;

    (async () => {
        try {
            const accounts = await get_accounts(user_id);
            return res.json({accounts})
        } catch (err) {
            console.error(err);
            throw err;
        }
    })();
})

app.post("/add_account", async (req,res) => {
    const {user_id, account} = req.body;

    try {
        const existing_account = await validate_account(user_id, account)
        if(existing_account.length > 1) {
            return res.json({status: false, message: "Account already exists."})
        } else {
            const status = await add_account(user_id, account);
            if(status) return res.json({status: true})
            else return res.json({status: false})
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
})

app.post("/delete_accounts", async (req,res) => {
    const {user_id, accounts} = req.body;

    try {
        const statusPromises = accounts.map(account => {
            delete_account(user_id, account)
        });
        const statuses = await Promise.all(statusPromises)
        return res.json({statuses}) 
    } catch (err) {
        console.error(err);
        throw err;
    }
})

//Transactions
app.post("/add_transaction", async (req,res) => {
    const transaction_id = uuid()
    const {user_id, date, amount, account, category, type} = req.body;

    try {
        const status = await add_transaction(transaction_id, user_id, date, amount, account, category, type)
        return res.json({status})
    } catch (err) {
        console.error(err);
        throw err;
    }
})

app.post("/get_transactions", async(req,res) => {
    const {user_id, month, year} = req.body;
    try {
        const transactions = await get_transactions(user_id, month, year);
        return res.json({transactions})
    } catch (err) {
        console.error(err);
        throw err;
    }
})

app.post("/delete_transactions", async(req,res) => {
    const {user_id, transactions} = req.body;
    try {
        const statusPromises = transactions.map(transaction => {
            delete_transaction(user_id, transaction)
        });
        const statuses = await Promise.all(statusPromises);
        return res.json({statuses})
    } catch (err) {
        console.error(err);
        throw err;
    }
})

// Settings
app.post("/get_username" , async (req,res) => {
    const {user_id} = req.body;
    try {
        const username = await get_username(user_id);
        return res.json({username});
    } catch (err) {
        console.error(err);
        throw err;
    }
})

app.post("/change_username", async (req,res) => {
    const {user_id, username} = req.body;
    try {
        const response = await change_username(user_id, username)
        console.log(await change_username(user_id, username))
        if(response.affectedRows > 0) {
            return res.json({status:true})
        } else {
            return res.json({status:false})
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
})
 
app.post("/change_password", async (req,res) => { 
    const data = req.body;
    const user_id = data.user_id
    const current_password = data.currentPassword.toString()
    const new_password = data.newPassword.toString()

    try {
        const hashed_password = await get_password(user_id);
        const result = await bcrypt.compare(current_password, hashed_password[0].password.toString());
        if(result) {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if(err) {
                    console.error(err);
                    throw err;
                }
                bcrypt.hash(new_password, salt, (err, hash) => {
                    if(err) {
                        console.error(err);
                        return
                    }
                    (async () => {
                        try {
                            const response = await change_password(user_id, hash)
                            return res.json({status:response})
                        } catch (err) {
                            console.error(err);
                            throw err;
                    }
                    })();
                })
            })
        } else {
            return res.json({status: false})
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
})
  