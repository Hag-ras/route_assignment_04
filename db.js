import mysql2 from 'mysql2/promise'

const db = mysql2.createPool({
    host:'localhost',
    user:'root',
    password:'',
    port:'3306',
    database:'assignment04',
    
    waitForConnections:true,
    connectionLimit:4,
    queueLimit:0
}
)

async function bootstrap(app,port) {
    try {
        await db.query(`select 1+1 `)
        console.log('DB Connected!');
        app.listen(port, () => {})
    } catch (error) {
        throw new Error("DB connection failed");
                
    }
}

export {db, bootstrap}