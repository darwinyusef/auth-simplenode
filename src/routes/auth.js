// validation
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');


// constraseña
const bcrypt = require('bcrypt');

const validateRegister = require('../validations/validateRegister');

router.post('/register', async (req, res) => {
    // validate user
    const { error } = validateRegister.validate(req.body);

    if (error) {
        return res.status(400).json(
            { error: error.details[0].message }
        )
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(400).json(
            { error: 'Email ya esta registrado' }
        )
    }

    const isUserExist = await User.findOne({ user: req.body.user });
    if (isUserExist) {
        return res.status(400).json(
            { error: 'Usuario ya esta registrado' }
        )
    }

    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        user: req.body.user,
        email: req.body.email,
        age: req.body.age,
        password: password,
        status: 1
    });

    try {
        const savedUser = await user.save();
        res.json({
            error: null,
            data: savedUser,
            msj: 'el usuario ha sido registrado correctamente',
        })
    } catch (error) {
        res.status(400).json({ error: error, msj: 'Error al registrarse' })
    }
})


const validateLogin = require('../validations/validateLogin');

router.post('/login', async (req, res) => {
    // validaciones


    const nameCookie = Object.keys(req.cookies)[0];

    // se obtiene el jwt en linea para validar si se encuentra logueado
    let cookie = req.cookies[nameCookie];
    if (cookie == undefined) {
        const { error } = validateLogin.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message })
        let user = null;
        // se valida connect puede contenter user or @.com
        await User.find().or([{ email: req.body.connect }, { user: req.body.connect }])
            .then(users => {
                user = users[0];
            })
            .catch(error => {
                return res.status(400).json({
                    error: error,
                    msj: 'Error al encontrar el usuario'
                });
            })

        if (user != null) {

            // si existe user se valida pass
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(400).json({ error: null, error: 'contraseña no válida' })

            // create token
            const token = jwt.sign({
                name: user.name,
                email: user.email,
                id: user._id
            }, process.env.TOKEN_SECRET);

            res.header('auth-token', token).json({
                error: null,
                datas: { token }
            });

            return res.status(200).json({
                error: null,
                msj: 'Bienvenido'
            });
        } else {
            return res.status(400).json({
                error: null,
                msj: 'Error al encontrar el usuario'
            });
        }

    } else {
        return res.status(401).json({
            error: null,
            msj: 'Actualmente ya se encuentra logueado'
        });
    }

})


router.post('/logout', async (req, res) => {
    res.clearCookie(Object.keys(req.cookies)[0]);
    return res.status(200).json({
        error: null,
        msj: 'Su session ha cerrado correctamente'
    });
});








module.exports = router;