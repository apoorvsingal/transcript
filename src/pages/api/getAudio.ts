import type {NextApiRequest, NextApiResponse} from 'next';
// import {fetchAudio} from '~/lib/storage';

export default async function getAudio(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const name = req.query.name as string;
  // const {size, stream} = await fetchAudio(name);
  // res.writeHead(200, {
  //   'Content-Type': 'audio/wav',
  //   'Content-Length': size,
  // });
  // stream.a.pipe(res);
}
