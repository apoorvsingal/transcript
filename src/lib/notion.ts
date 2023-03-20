import { Client, LogLevel } from "@notionhq/client";

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  logLevel: LogLevel.DEBUG,
});

export async function storeToNotion(
  name: string,
  audioFileUrl: string,
  transcript: string
): Promise<void> {
  try {
    // Create a new page with the audio URL and transcript
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID!,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: new Date(parseInt(name.split(".")[0])).toString(),
              },
            },
          ],
        },
        audio: {
          url: audioFileUrl,
        },
        transcript: {
          rich_text: [
            {
              text: {
                content: transcript,
              },
            },
          ],
        },
      },
    });

    console.log("Page created successfully!");
  } catch (error) {
    console.error("Error creating page:", error);
  }
}
