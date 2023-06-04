import {createClient} from '@supabase/supabase-js';
import {createReadStream} from 'fs';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// export async function storeAudio(path: string) {
//   const name = new Date().getTime() + '.wav';
//   const {data, error} = await supabase.storage
//     .from('transcripts')
//     .upload(name, createReadStream(path));

//   if (error) {
//     throw error;
//   }
//   const url = `${supabaseUrl}/storage/v1/object/public/transcripts/${name}`;

//   return {name, url};
// }

// export async function fetchAudio(name: string) {
//   const {data, error} = await supabase.storage
//     .from('transcripts')
//     .download(name);

//   if (error) {
//     throw error;
//   }
//   return {stream: data, size: data.size};
// }

export async function storeTranscript(transcript: string) {
  const name = new Date().getTime() + '.wav';

  const {error} = await supabase.storage
    .from('transcripts')
    .upload(`${name}.txt`, new Blob([transcript]));

  if (error) {
    throw error;
  }
  return name;
}

export async function fetchTranscript(name: string) {
  const {data, error} = await supabase.storage
    .from('transcripts')
    .download(`${name}.txt`);

  if (error) {
    throw error;
  }
  return new TextDecoder().decode(Buffer.from(await data.arrayBuffer()));
}
