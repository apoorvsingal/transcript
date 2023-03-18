import {Writable} from 'stream';

import formidable from 'formidable';
import {NextApiRequest, NextApiResponse, PageConfig} from 'next';
import { createWriteStream, readFileSync, unlink, unlinkSync, write, writeFileSync } from 'fs';
import { exec, execSync } from 'child_process';
import { storeAudio, storeTranscript } from '@/lib/storage';
import { promisify } from 'util';

const formidableConfig = {
    keepExtensions: true,
    maxFileSize: 10_000_000,
    maxFieldsSize: 10_000_000,
    maxFields: 7,
    allowEmptyFiles: false,
    multiples: false,
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(404).end();

    try {
        const path = 'tmp/' + Date.now().toString() + '.wav';
        const writeStream = createWriteStream(path, { flags: "wx+" });

        const form = formidable({
          ...formidableConfig,
          fileWriteStreamHandler: () => writeStream,
        });
        await new Promise((res, rej) => {
          form.parse(req, err => err ? rej(err) : res(undefined));
        });

        await promisify(exec)(`cd ./whisper.cpp && ./main -f ../${path} --output-txt`);

        const transcript = readFileSync(path + '.txt', 'utf8');

        const name = await storeAudio(path);
        await storeTranscript(name, transcript);

        unlinkSync(path);
        unlinkSync(path + ".txt");

        return res.send({ name });
    } catch (err) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};

export default handler;
