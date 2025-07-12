import { ChromaClient } from "chromadb";

const chromaclient = new ChromaClient();
export const COLLECTION_NAME = 'my-knowledge-db';

export let collection: any;

export async function createCollection() {  
    try {
        // First, try to delete the existing collection
        await chromaclient.deleteCollection({
            name: COLLECTION_NAME
        });
        console.log("Deleted existing collection");
    } catch (error) {
        console.log("Collection doesn't exist or couldn't be deleted");
    }
    
    // Now create a fresh collection (will use default embedding if @chroma-core/default-embed is installed)
    const youtubechroma = await chromaclient.createCollection({
        name: COLLECTION_NAME
    });
    
    console.log("YouTube collection created with default embedding");
    
    collection = youtubechroma;
    return youtubechroma;
}