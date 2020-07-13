const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenido a la API'
    });
});


app.post('/api/post', verificarToken, (req, res) => {
    jwt.verify(req.token, 'secreto', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post realizado...',
                authData
            });
        }
    })

});

app.post('/api/login', (req, res) => {
    // user
    const user = {
        id: 1,
        username: 'Israel',
        email: 'israel.mail.com'
    }

    jwt.sign({user: user}, 'secreto',{expiresIn: '30s'}, (err, token) => {
        res.json({
            token
        });
    });
});
// Formato del token
// Autorización: Bearer <access_token>

function verificarToken(req, res, next) {
    // obtener la cabecera del auth
    const header = req.headers['authorization'];
    // Verificar si el header es indefinido
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        // Obtener el token
        const bearerToken = bearer[1];
        // Setear el token
        req.token = bearerToken;
        next();
    } else {
        // Prohibido
        res.sendStatus(403)
    }

}

app.listen(5000, () => console.log('Servidor escuchando en el pueto 5000'));