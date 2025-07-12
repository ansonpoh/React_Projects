import mysql from "mysql2"

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "bt",
})

export async function signup(id, username, password, email) {
    try {
        const[rows] = await pool.promise().query(`insert into users values (?, ?, ?, ?)`
            , [id, username, password, email]
        );
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function get_email(email) {
    try {
        const[rows] = await pool.promise().query(`select email from users where email=?`
            , [email]
        );
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function validate_username(username) {
    try {
        const[rows] = await pool.promise().query(`select * from users where username = ?`
            , [username]
        );
        return rows;
    } catch (err) {
        console.error(err)
        throw err;
    }
}

export async function get_username(user_id) {
    try {
        const [rows] = await pool.promise().query(`select username from users where user_id = ?`
            , [user_id]
        )
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_username_2(username) {
    try {
        const [rows] = await pool.promise().query(`select * from users where username = ?`
            , [username]
        )
        return rows
    } catch (err) {
        console.error(err)
        throw err;
    }
}

export async function get_user_id(username) {
    try {
        const [rows] = await pool.promise().query(`select user_id from users where username = ?`
            , [username]
        );
        return rows;
    } catch(err) {
        console.error(err)
        throw err;
    }
}

export async function get_password(user_id) {
    try {
        const [rows] = await pool.promise().query(`select password from users where user_id = ?`
            , [user_id]
        )
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function change_password(user_id, password) {
    try {
        const [rows] = await pool.promise().query(`update users set password = ? where user_id = ?` 
            ,[password, user_id]
        )
        return rows ;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function change_username(user_id, username) {
    try {
        const [rows] = await pool.promise().query(`update users set username = ? where user_id = ?`
            , [username, user_id]
        )
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

//Categories
export async function validate_category(user_id, category) {
    try {
        const [rows] = await pool.promise().query(`select category from categories where user_id = ? and category = ?`
            , [user_id, category]
        )
        return rows;
    } catch(err) {
        console.error(err)
        throw err;
    }
}

export async function get_categories(user_id) {
    try {
        const [rows] = await pool.promise().query(`select category from categories where user_id = ? order by category asc`
            , [user_id]
        );
        return rows;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

export async function get_categories_type(user_id, type) {
    try {
        const [rows] = await pool.promise().query(`select category from categories where user_id = ? and type = ? order by category asc`
            , [user_id, type]
        )
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function add_category(user_id, category, type) {
    try {
        const [rows] = await pool.promise().query(`insert into categories values (?, ?, ?)`
            , [user_id, category, type]
        )
        return rows;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

export async function delete_categories(user_id, category) {
    try {
        const [rows] = await pool.promise().query(`delete from categories where user_id = ? and category = ?`
            , [user_id, category]
        )
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }

}

//Accounts
export async function validate_account(user_id, account) {
    try {
        const [rows] = await pool.promise().query(`select account from accounts where user_id = ? and account = ?`
            , [user_id, account]
        );
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_accounts(user_id) {
    try {
        const [rows] = await pool.promise().query(`select account from accounts where user_id = ?`
            , [user_id]
        );
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function add_account(user_id, account) {
    try {
        const [rows] = await pool.promise().query(`insert into accounts values (?, ?)`
            , [user_id, account]
        );
        return rows;
    } catch (err){
        console.error(err);
        throw err;
    }
}

export async function delete_account(user_id, account) {
    try {
        const [rows] = await pool.promise().query(`delete from accounts where user_id = ? and account = ?`
            ,[user_id, account]
        );
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

//Transactions
export async function add_transaction(transaction_id, user_id, date, amount, account, category, type) {
    try {
        const [rows] = await pool.promise().query(`insert into transactions values (?, ?, ?, ?, ?, ?, ?)`
            , [transaction_id, user_id, date, amount, account, category, type]
        );
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_transactions(user_id, month, year) {
    try {
        const [rows] = await pool.promise().query(`select * from transactions where user_id = ? and MONTH(date) = ? 
            and YEAR(date) = ? order by date asc` 
            , [user_id, month, year]
        );
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function delete_transaction(user_id, transaction_id) {
    try {
        const [rows] = await pool.promise().query(`delete from transactions where user_id = ? and transaction_id = ?`
            , [user_id, transaction_id]
        );
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}