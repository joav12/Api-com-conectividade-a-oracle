const express = require('express');
const oracledb  = require('oracledb');
const cors = require('cors');
const e = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

async function getData(res){
    try{
        connection = await oracledb.getConnection({
            user: "USER",
            password: 'PASSWORD',
            connectString: "CONNECTION"
        });
        console.log("conectado com o banco");
        
        result = await connection.execute(`SELECT * FROM emails`);

    } catch (err){
        console.log(`Ocorreu um erro: ${err}`);

    } finally{
        if (connection) {
            try {
              // Always close connections
              await connection.close(); 
              console.log('close connection success');
              
            } catch (err) {
              console.error(err.message);

            }
        }
        if (result.rows.length == 0){
            return res.send('Sem emails cadastrados');
        }
        else{
            return res.send(result.rows);
        }
    }
}

async function createEmailData(req, res){
    try{
        connection = await oracledb.getConnection({
            user: "USER",
            password: 'PASSWORD',
            connectString: "CONNECTION"
        });
        console.log("conectado com o banco");
        var id = 1;
        const email = req.params.email;

        result = await connection.execute(`SELECT * FROM emails`);

        if(result.rows.length != 0){
            result.rows.reverse();
            id += result.rows[result.rows.length - 1][0];
        }

        const query = 'INSERT INTO emails (id, emailbody) VALUES(:emailID, :emailBody)'

        await connection.execute(query, {emailID: id, emailBody: email}, {autoCommit: true});

    } catch (err){
        console.log(`Ocorreu um erro: ${err}`);

    } finally{
        if (connection) {
            try {
              // Always close connections
              await connection.close(); 
              console.log('close connection success');
              
            } catch (err) {
              console.error(err.message);

            }
        }
        return res.send("Email cadastrado");
    }
}

async function deleteEmailData(req, res){
    try{
        connection = await oracledb.getConnection({
            user: "USER",
            password: 'PASSWORD',
            connectString: "CONNECTION"
        });
        console.log("conectado com o banco");
        const id = req.params.id;

        const query = 'DELETE FROM emails WHERE id= :emailID'

        await connection.execute(query, {emailID: id}, {
            autoCommit: true});

    } catch (err){
        console.log(`Ocorreu um erro: ${err}`);

    } finally{
        if (connection) {
            try {
              // Always close connections
              await connection.close(); 
              console.log('close connection success');
              
            } catch (err) {
              console.error(err.message);

            }
        }
        return res.send("Email deletado");
    }
}

app.get('/fetch', (req, res)=>{
    getData(res)
});

app.get('/create/:email', (req, res)=>{
    createEmailData(req, res);
})

app.get('/delete/:id', (req, res)=>{
    deleteEmailData(req, res);
})

app.listen(
    PORT,
    () => console.log(`funciona no http://localhost:${PORT}`)
)

