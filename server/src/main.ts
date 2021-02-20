import { init as initDatabase } from "./database";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(
    function (request, response, next) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        response.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    }
);

app.use(bodyParser.json());

async function init() {
    const db = await initDatabase();

    app.get('/pessoa', async (req, res) => {
        const responseData = await db.all("SELECT * FROM pessoa");
        res.json(responseData);
    });

    app.post('/pessoa', async (req, res) => {
        if (!req.body.nome || !req.body.sobrenome || !req.body.apelido) {
            res.status(422); // Unprocessable Entity
            res.json({ error: "dados incompletos." });
            return;
        }

        try {
            const responseData = await db.run(
                "INSERT INTO pessoa(nome, sobrenome, apelido) VALUES(:nome, :sobrenome, :apelido)",
                {
                    ":nome": req.body.nome,
                    ":sobrenome": req.body.sobrenome,
                    ":apelido": req.body.apelido
                }
            );
            res.json(responseData);
        }
        catch (e) {
            res.status(500); // Internal Server Error
            res.json({ error: "database error", detail: e });
        }
    });

    app.put('/pessoa:id', async (req, res) => {
        if (!req.body.nome || !req.body.sobrenome || !req.body.apelido) {
            res.status(422); // Unprocessable Entity
            res.json({ error: "dados incompletos." });
            return;
        }

        try {
            const responseData = await db.run(
                "UPDATE pessoa SET nome=:nome, sobrenome=:sobrenome, apelido=:apelido WHERE id=:id",
                {
                    ":id": req.params.id,
                    ":nome": req.body.nome,
                    ":sobrenome": req.body.sobrenome,
                    ":apelido": req.body.apelido
                }
            );

            if (responseData == undefined) {
                res.status(404); // Not Found
                res.json({ error: "Pessoa não encontrada." });
            } else {
                res.json(responseData);
            }
        }

        catch (e) {
            res.status(500); // Internal Server Error
            res.json({ error: "database error", detail: e });
        }
    });

    app.delete('/pessoa:id', async (req, res) => {
        const responseData = await db.run("DELETE FROM pessoa WHERE id=?", req.params.id);
 
        if(responseData.changes == 0) {
            res.status(404); // Not Found
            res.json({ error: "Pessoa não encontrada." });
        } else {
            res.json(responseData);
        }
    });

    app.listen(8081, () => console.log("running..."));
}

init();