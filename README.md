# API Segura usando Jason Web Tokens
# Jason Web Tokens (JWT)

JSON Web Token (JWT) es un estándar abierto (RFC 7519) que define 
una forma compacta y autónoma para transmitir información de forma
segura entre participantes  como un objeto JSON. Esta información puede 
ser verificada y confiable porque está firmada digitalmente. Los 
JWT se pueden firmar usando un secreto (con el algoritmo HMAC) o un 
par de claves pública / privada usando RSA o ECDSA.

En este tutorial aprenderemos a crear una API segura usando JWT.

##### Primero correremos el siguiente comando para crear el proyecto

```
npm init
```
 ![npminit](/imagenes/npminit.png)
 
 ![nombrenpm](/imagenes/nombrenpm.png)
 
Le ponemos un nombre y después damos enter hasta terminar

### A continuación intallamos el paquete de JWT y nodemon para levantar el servidor

```
npm i express jsonwebtoken
```
```
npm i nodemon
```

### Creamos un archivo index.js 

![nombrenpm](/imagenes/indexcreado.png)

con el siguiente código

``` typescript
const express = require('express');
const app = express();
app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenido a la API'
    });
});


app.listen(5000, () => console.log('Servidor escuchando en el pueto 5000'));
```

en la terminal corremos el siguiente comando para comprobar que el servidor se levante

```
nodemon
```

![nombrenpm](/imagenes/serverup.png)
 
y también lo comprobamos usando postman
 
 ![nombrenpm](/imagenes/postget.png)

### Ahora añadimos un post, el cual más adelante protegeremos y comprobamos su funcionamiento

``` typescript
app.post('/api/post', (req, res) => {
    res.json({
        message: 'Post realizado...'
    });
});
```
 ![nombrenpm](/imagenes/postpost.png)

### Implementación de JWT
Hasta ahora se puede realizar este post libremente por lo que no es seguro, ahora implementaremos
seguridad utilizando JWT.

Para esto crearemos la ruta /login para obtener el Token, en este caso el usuario esta quemado, pero lo podemos obtener de otra manera que si sea segura, esto es solo un ejemplo. 
La clave con la que generaremos el token es 'secreto'  

``` typescript
const jwt = require('jsonwebtoken');

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'Israel',
        email: 'israel@mail.com'
    }

    jwt.sign({user: user}, 'secreto', (err, token) => {
        res.json({
            token
        });
    });
});
``` 

Probamos que funcione el login  

 ![nombrenpm](/imagenes/postlogin.png)
 se puede ver que hemos obtenido el token

## Añadimos una función para verificar el token

``` typescript
function verificarToken(req, res, next) {
    // obtener la cabecera del auth
    const header = req.headers['autorizacion'];
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
```
### Modificamos el método post que hicimos anteriormente, para incluir la verificación del token para poder acceder a esta ruta

``` typescript
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
```
### Finalmente para utilizar el post ahora necesitamos 

**1.** Logearnos para obtener el token 

 ![nombrenpm](/imagenes/login1.png)

**2.** Enviar el token en la cabecera "autorizacion"  despues de la palabra "Bearer" 

 ![nombrenpm](/imagenes/postconaut.png)
