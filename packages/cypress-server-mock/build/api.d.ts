import type { NextApiRequest, NextApiResponse } from 'next';
declare type Data = {
    message: string;
};
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>): void;
export {};
