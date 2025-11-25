"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.protect = void 0;
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const sendResponse_1 = __importDefault(require("../utills/sendResponse"));
function checkIfEnvExists(key) {
    const env = process.env[key];
    if (!env)
        throw new Error(`Missing env var: ${key}`);
    return env;
}
const JWT_SECRET_KEY = checkIfEnvExists("JWT_SECRET_KEY");
const JWT_EXPIRES_IN_HOURS = Number(checkIfEnvExists("JWT_EXPIRES_IN")); // npr. 5 (sati)
function createJWT(student) {
    return jsonwebtoken_1.default.sign({ id: student._id }, JWT_SECRET_KEY, {
        expiresIn: +JWT_EXPIRES_IN_HOURS * 60 * 60, // JWT_EXPIRES su satima, trenutno je stavljeno na 5 sati
    });
}
function setJWTInHttpOnlyCookie(jwtToken, res) {
    const cookieOptions = {
        expires: new Date(Date.now() + +JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000), // sati su u pitanju
        sameSite: "none",
        secure: true,
        httpOnly: true,
    };
    res.cookie("jwt", jwtToken, cookieOptions);
}
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    // Za protect middleware bitno je proveriti sledece edge case-ove
    // - Provera da li je korisnik ulogovan (Da li postoji JWT token)
    // - Validacija JWT tokena
    // - Provera da li je korisniku u medjuvremenu obrisan nalog
    // - Provera da li je sifra i dalje validna, to jest ako je korisnik promenio sifru, onda ne bih trebao da moze da radi stari jwt token
    // - Izmeni req objekat i dodaj student-a iz baze req.student = currentstudent i na kraju next()
    // Kako idu koraci za proveri da li je korisnik ulogovan?
});
exports.signup = (0, catchAsync_1.default)(async (req, res, next) => {
    const student = await studentModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
    });
    if (!student) {
        return next(new appError_1.default("Error, please contact the developer.", 404));
    }
    const jwtToken = createJWT(student);
    setJWTInHttpOnlyCookie(jwtToken, res);
    (0, sendResponse_1.default)(res, 201, student);
});
