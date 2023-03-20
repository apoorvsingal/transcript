import Head from 'next/head'
import { getTransacipt } from "../lib/client";
import { useState } from 'react';
import Link from 'next/link';

export default function Home() { 
	const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);
	const [isFilePicked, setIsFilePicked] = useState(false);

  const [transcript, setTranscript] = useState<string>();
  const [name, setName] = useState<string>();

	const handleChange = (event: Event & { target: EventTarget & { files: FileList } }) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

  const handleSubmission = async () => {
    if(!isFilePicked) return;
    setLoading(true);

		const formData = new FormData();
		formData.append('File', selectedFile as Blob);

		const res = await fetch('/api/handle', {
      method: 'POST',
      body: formData,
    })
    const { name, transcript } = await res.json();

    setLoading(false);
    setTranscript(transcript);
    setName(name);
	};

  return (
    <>
      <Head>
        <title>transcript app</title>
        <meta name="description" content="ow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <input type="file" name="file" onChange={handleChange} />

        <button onClick={handleSubmission} disabled={loading || !isFilePicked}>
          {loading ? "loading": "send tx"}
        </button>

        {
          transcript && (
            <div>
              Transcript: {transcript}
            </div>
          )
        }
        {
          name && (
            <div>
              URLs: <br/>
                Audio: <Link href={`/api/getAudio?name=${name}`}>/api/getAudio?name={name}</Link>  <br/>
                Transcript: <Link href={`/api/getTranscript?name=${name}`}>/api/getTranscript?name={name}</Link>
            </div>
          )
        }
      </main>
    </>
  )
}
