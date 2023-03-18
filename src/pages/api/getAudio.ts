import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAudio } from '@/lib/storage';

export default async function getAudio(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name as string;
  const buffer = await fetchAudio(name);

  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': buffer[0].byteLength
  });
  res.write(buffer[0]);
  res.end();
};

