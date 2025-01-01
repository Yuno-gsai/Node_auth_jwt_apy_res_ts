import bcrypt from 'bcrypt';
const SATL_ROUNDS:number = 10; 
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SATL_ROUNDS);
}
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}