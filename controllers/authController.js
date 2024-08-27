
import passport  from 'passport';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

const { OAuth2 } = google.auth;
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";


//------------ User Model ------------//
import User from '../models/User.js';
let websiteUrl;
if (process.env.ENVIRONMENT === "PROD") {
    websiteUrl = process.env.WEBSITE_URL_PROD;
} else if (process.env.ENVIRONMENT === "DEV") {
    websiteUrl = process.env.WEBSITE_URL_DEV;
  } else {
    websiteUrl = process.env.WEBSTIE_URL_DEFAULT;
}
const registerHandle = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        console.log("Missing fields detected");
        return res.json({ success: false, message: 'Veuillez remplir tous les champs' });
    }

    if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return res.json({ success: false, message: 'Les mots de passe ne correspondent pas' });
    }

    if (password.length < 8) {
        console.log("Password too short");
        return res.json({ success: false, message: 'Le mot de passe doit comporter au moins 8 caractères' });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email déjà enregistré' });
        }

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/auth/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "nodejsa@gmail.com",
                        clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                        clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                        refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"Auth Admin" <nodejsa@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Verification: NodeJS Auth ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.json({ success: false, message: 'Une erreur s\'est produite lors de l\'envoi de l\'email. Veuillez réessayer.' });
                    } else {
                        console.log('Email envoyé : %s', info.response);
                        return res.json({ success: true, message: 'Lien d\'activation envoyé à l\'email. Veuillez activer pour vous connecter.' });
                    }
                });
            } catch (err) {
                console.log(err);
                return res.json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
            }
        }

//------------ Activate Account Handle ------------//
const activateHandle = async (req, res) => {
    const token = req.params.token;

    if (!token) {
        req.flash('error_msg', "Erreur d'activation du compte !");
        return res.redirect(websiteUrl+":4001");
    }

    try {
        const decodedToken = jwt.verify(token, JWT_KEY);
        const { name, email, password } = decodedToken;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.flash('error_msg', "Email déjà enregistré ! Veuillez vous connecter.");
            return res.redirect(websiteUrl+":4001");
        }

        const newUser = new User({ name, email, password });
        const salt = await bcryptjs.genSalt(10);
        newUser.password = await bcryptjs.hash(newUser.password, salt);

        await newUser.save();

        req.flash('success_msg', "Compte activé. Vous pouvez maintenant vous connecter.");
        return res.redirect(websiteUrl+":4001");

    } catch (err) {
        console.log(err);
        req.flash('error_msg', "Lien incorrect ou expiré ! Veuillez vous enregistrer à nouveau.");
        return res.redirect('/auth/register');
    }
};


//------------ Forgot Password Handle ------------//
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
        errors.push({ msg: 'Please enter an email ID' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors, email });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            //------------ User does not exist ------------//
            return res.status(404).json({ success: false, message: 'User with Email ID does not exist!' });
        }

        const oauth2Client = new OAuth2(
            "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
            "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
            refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
        });
        const accessToken = oauth2Client.getAccessToken()

        const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
        const resetLink = websiteUrl+`:4001/reset-password/${token}`; 

        await User.updateOne({ resetLink });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: "nodejsa@gmail.com",
                clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                accessToken: accessToken
            },
        });

        const mailOptions = {
            from: '"Auth Admin" <nodejsa@gmail.com>', 
            to: email, 
            subject: "Account Password Reset: NodeJS Auth ✔", 
            html: `
                <h2>Please click on below link to reset your account password</h2>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
            `, 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent : %s', info.response);

        return res.status(200).json({ success: true, message: 'Password reset link sent to email ID. Please follow the instructions.', resetLink });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Something went wrong on our end. Please try again later.' });
    }
};


//------------ Redirect to Reset Handle ------------//
const gotoReset = async (req, res) => {
    const { token } = req.params;

    if (token) {
        try {
            const decodedToken = jwt.verify(token, JWT_RESET_KEY);
            const { _id } = decodedToken;

            try {
                const user = await User.findById(_id);
                res.redirect(`/auth/reset/${_id}`);
            } catch (err) {
                req.flash(
                    'error_msg',
                    'User with email ID does not exist! Please try again.'
                );
                res.redirect('/auth/login');
            }
        } catch (err) {
            req.flash(
                'error_msg',
                'Incorrect or expired link! Please try again.'
            );
            res.redirect('/auth/login');
        }
    } else {
        console.log("Password reset error!")
    }
}

const resetPassword = async (req, res) => {
    const { password, password2 } = req.body;
    const token = req.params.token;

    try {
        if (!password || !password2) {
            return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Le mot de passe doit comporter au moins 8 caractères.' });
        }

        if (password !== password2) {
            return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas.' });
        }

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token manquant.' });
        }

        // Décoder le jeton JWT pour obtenir l'ID utilisateur
        const decoded = jwt.verify(token,  JWT_RESET_KEY); 
        const userId = decoded._id;

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès !' });

    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe. Veuillez réessayer.' });
    }
};

const loginHandle = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
        }

        req.session.user = user;
        return res.status(200).json({ success: true, message: 'Connexion réussie.', user });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Erreur du serveur. Veuillez réessayer plus tard.' });
    }
};


//------------ Logout Handle ------------//
const logoutHandle = (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
}
//------------ Google OAuth Callback ------------//
const googleAuthHandle = (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.redirect('/auth/google'); 
        }
        req.logIn(user, (err) => {
            if (err) { 
                return next(err); 
            }
            return res.redirect('/'); 
        });
    })(req, res, next);
}

export default {    
    registerHandle,
    activateHandle, 
    forgotPassword,
    gotoReset, 
    resetPassword, 
    loginHandle, 
    logoutHandle,
    googleAuthHandle
};