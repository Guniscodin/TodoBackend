type ErrorRes = {
    success: false,
    message: string
}

type Return =
    | {
        success: true;
        email: string;
        username: string;
        password: string;
    }
    | ErrorRes;

type ReturnLogIn = {
    success: true;
    email: string;
    password: string;
} | ErrorRes

const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalidInput = (): ErrorRes => ({
    success: false,
    message: "[ERROR]: Invalid inputs!"
});

const signUpCheck = (user: string , email: string , password: string): Return =>{
    if (
        typeof user !== "string" || 
        typeof email !== "string" || 
        typeof password !== "string"
    ){
        return invalidInput();
    }
    if (
        !user.trim() ||
        !password.trim() ||
        !email.trim()
    ){
        return invalidInput();
    }
    if(
        password.length < 8 ||
        email.length < 7
    ){
        return invalidInput();
    }
    if(
        !usernameRegex.test(user.trim()) ||
        !emailRegex.test(email.trim())
    ){
        return invalidInput();
    }
    return {
        success: true,
        email: email.trim(),
        password: password.trim(),
        username: user.trim()
    }
}

const LogInCheck = (email: string , password: string): ReturnLogIn =>{
    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ){
        return invalidInput();
    }
    if(
        !email.trim() || !password.trim()
    ){
        return invalidInput();
    }
    if(
        email.trim().length < 7 || password.trim().length < 8
    ){
        return invalidInput();
    }
    if (
        !emailRegex.test(email.trim())
    ){
        return invalidInput();
    }
    return {
        success: true,
        email: email.trim(),
        password: password.trim()
    }
}

export {
    signUpCheck,
    LogInCheck
}