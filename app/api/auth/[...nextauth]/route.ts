import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const handler = NextAuth(authOptions);

export async function GET(req: Request, res: Response) {
  return handler(req, res);
}

export async function POST(req: Request, res: Response) {
  return handler(req, res);
}
