import type {NextApiRequest, NextApiResponse} from 'next';
import {fetchTranscript} from '~/lib/storage';

export default async function getAudio(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name as string;
  const buffer = await fetchTranscript(name);

  res.send({transcript: buffer});
}
