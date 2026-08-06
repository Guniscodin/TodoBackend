declare global {
    namespace Express {
        interface Request {
            user?: { 
                userId: string,
                type: "access" | "refresh"
            }
        }
    }
}

export {}