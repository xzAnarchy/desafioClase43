import { Router } from 'express';
import passport from 'passport';
import { Strategy } from "passport-local";
import path from 'path';
import UsuariosDao from '../../models/daos/Usuarios.Dao.js';
import objectUtils from '../../utils/objectUtils.js';
const LocalStrategy = Strategy;
const authWebRouter = new Router()
const sessionService = new UsuariosDao()

passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'emailUser',
        passwordField: 'passwordUser',
        passReqToCallback: true,
      },
      async (req, emailUser, passwordUser, done) => {
        const usuario = await sessionService.buscarUsuarioPorEmail(emailUser)
        if (!usuario) return done(null, false)
        if (!objectUtils.isValidPassword(usuario, passwordUser)) return done(null, false)
        return done(null, usuario)
      }
    )
  )
  // Serialize
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })
  // Deserialize
  passport.deserializeUser(async (email, done) => {
    const user = await sessionService.buscarUsuarioPorEmail(email)
    done(null, user)
  })


// -------------------------------- RUTAS ---------------------------------------------------------

authWebRouter.get('/', (req, res) => {
    res.redirect('/home')
})

authWebRouter.get('/login', (req, res) => {
    if(req.session.passport?.user){
        res.redirect('/home')
    }else{
    res.sendFile('login.html', {root: 'public'})
    }
})

authWebRouter.post(
    '/login',
    passport.authenticate('login', {
      successRedirect: '/home',
      failureRedirect: '/login-error',
      passReqToCallback: true,
    }),
    (req, res) => {
      res.cookie('userEmail', req.session.passport.user)
    }
  )

authWebRouter.get('/register', (req, res)=>{
    res.sendFile('register.html', {root: 'public'})
})

authWebRouter.post('/register', async(req, res)=>{
  const registerData = { email: req.body.registerEmail, password: req.body.registerPassword }
  const response = await sessionService.registrarUsuario(registerData)
  if (response) {
    console.log("registrado correctamente");
    res.redirect('/login')
  } else {
    res.redirect('/register-error')
  }
})

authWebRouter.get('/logout', (req, res) => {
    const nombre = req.session.passport?.user
    if (nombre) {
        req.session.destroy(err => {
            if (!err) {
                res.render(path.join(process.cwd(), '/views/pages/logout.ejs'), { nombre })
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
})

authWebRouter.get('/register-error', (req, res) =>{
    res.sendFile('register-error.html', {root: 'public'})
})

authWebRouter.get('/login-error', (req, res) =>{
    res.sendFile('login-error.html', {root: 'public'})
})
export default authWebRouter