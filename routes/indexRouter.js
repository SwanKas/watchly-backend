<<<<<<< HEAD
import express from 'express';

const router = express.Router();

import auth from '../config/checkAuth.js';

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', auth.ensureAuthenticated, (req, res) => res.render('dash', {
    name: req.user.name
}));

export default router;
=======
import express from 'express';

const router = express.Router();

import auth from '../config/checkAuth.js';

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', auth.ensureAuthenticated, (req, res) => res.render('dash', {
    name: req.user.name
}));

export default router;
>>>>>>> origin/feature/auth
