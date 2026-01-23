const BASE_URL = "http://localhost:7366";

export async function fetchTraces() {
    const response = await fetch(`${BASE_URL}/events`);
    if (!response.ok) {
        throw new Error("Failed to fetch traces");
    }   
    return response.json();
}