import formidable from 'formidable';
import {NextApiRequest, NextApiResponse, PageConfig} from 'next';
import {createWriteStream, readFileSync, unlinkSync} from 'fs';
import {exec} from 'child_process';
import {promisify} from 'util';

import {storeTranscript} from '~/lib/storage';

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 2_000_000_000,
  maxFieldsSize: 2_000_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(404).end();

  console.log('here');

  try {
    const path = 'tmp/' + Date.now().toString() + '.wav';
    const writeStream = createWriteStream(path, {flags: 'wx+'});

    const form = formidable({
      ...formidableConfig,
      fileWriteStreamHandler: () => writeStream,
    });
    await new Promise((res, rej) => {
      form.parse(req, err => (err ? rej(err) : res(null)));
    });
    await promisify(exec)(
      `cd ./whisper.cpp && ./main -f ../${path} --output-txt`
    );
    const transcript = readFileSync(path + '.txt', 'utf8');

    // const {name, url} = await storeAudio(path);
    const name = await storeTranscript(transcript);

    unlinkSync(path);
    unlinkSync(path + '.txt');

    return res.send({name, transcript});
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: 'Internal Server Error'});
  }
}

export const config: PageConfig = {
  api: {bodyParser: false},
};

export default handler;
