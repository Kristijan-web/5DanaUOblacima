"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.protect = exports.allowedTo = void 0;
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
// Treba da moze da se prosledi parametar allowedTo
// - Kako cu to da uradim?
const allowedTo = (...allowedRoles) => (req, res, next) => {
    if (req.student.isAdmin && allowedRoles.includes("admin")) {
        next();
    }
    return next(new appError_1.default("You are not allowed to perform this action", 401));
};
exports.allowedTo = allowedTo;
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    // Za protect middleware bitno je proveriti sledece edge case-ove
    // - Provera da li je korisnik ulogovan (Da li postoji JWT token)
    // - Validacija JWT tokena
    // - Provera da li je korisniku u medjuvremenu obrisan nalog
    // - Izmeni req objekat i dodaj student-a iz baze req.student = currentstudent i na kraju next()
    // Ovde je greska, ne saljem ajax-om zahtev sa credentials: "include", vec koristim authorization: bearer u Postman-u
    const jwtToken = req?.cookies?.jwt;
    console.log("EVO JWT-a", jwtToken);
    console.log("EVO JWT-a iz header-a", req.headers["jwt"]);
    if (!jwtToken) {
        return next(new appError_1.default("You are not logged in!", 401));
    }
    // jwt.verify ce vratiti payload jwt-a
    const jwtPayload = jsonwebtoken_1.default.verify(jwtToken, checkIfEnvExists("JWT_SECRET_KEY"));
    const student = await studentModel_1.default.findById(jwtPayload.id);
    if (!student) {
        return next(new appError_1.default("Student does not exist", 404));
    }
    req.Student = studentModel_1.default;
    next();
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
