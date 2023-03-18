import {Writable} from 'stream';
import FormData from 'form-data';

import formidable from 'formidable';
import {NextApiRequest, NextApiResponse, PageConfig} from 'next';
import { readFileSync, unlink, unlinkSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { storeAudio, storeTranscript } from '@/lib/storage';

const formidableConfig = {
    keepExtensions: true,
    maxFileSize: 10_000_000,
    maxFieldsSize: 10_000_000,
    maxFields: 7,
    allowEmptyFiles: false,
    multiples: false,
};

function formidablePromise(
    req: NextApiRequest,
    opts?: Parameters<typeof formidable>[0]
): Promise<{fields: formidable.Fields; files: formidable.Files}> {
    return new Promise((accept, reject) => {
        const form = formidable(opts);

        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            return accept({fields, files});
        });
    });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
    const writable = new Writable({
        write: (chunk, _enc, next) => {
            acc.push(chunk);
            next();
        },
    });

    return writable;
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(404).end();

    try {
        const chunks: never[] = [];

        const {fields, files} = await formidablePromise(req, {
            ...formidableConfig,
            // consume this, otherwise formidable tries to save the file to disk
            fileWriteStreamHandler: () => fileConsumer(chunks),
        });

        const {file} = files;
        const fileData = Buffer.concat(chunks);

        // const form = new FormData();

        // form.append('my_field', 'my value');
        // form.append('my_file', fileData);

        const path = 'tmp/' + Date.now().toString() + '.wav';

        writeFileSync(path, fileData, { flag: "wx+", encoding: "binary" });
        execSync(`cd ../whisper.cpp && ./main -f ../transcript/${path} --output-txt`);

        const transcript = readFileSync(path + '.txt', 'utf8');

        unlinkSync(path);
        unlinkSync(path + ".txt");

        const name = await storeAudio(fileData);
        await storeTranscript(name, transcript);

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
