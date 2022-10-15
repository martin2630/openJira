import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    ok: boolean;
    message: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const {message = 'bad request'} = req.query
    res.status(404).json({ ok: false, message})
}