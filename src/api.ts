interface ImportMetaEnv {
    VITE_API_URL: string;
}

// Augment the global ImportMeta interface so TypeScript recognizes import.meta.env
declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

const API_URL = import.meta.env.VITE_API_URL as string;

function basicAuthHeader(username: string, password: string) {
    return "Basic " + btoa(`${username}:${password}`);
}


export async function login(username: string, password: string) {
    const res = await fetch(`${API_URL}/login`, {
        method: "GET",
        headers: {
            Authorization: basicAuthHeader(username, password),
        },
    });
    return res;
}


export async function signup(username: string, password: string, role: string) {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
    });
    return res;
}


export async function uploadDocs(
    username: string,
    password: string,
    file: File,
    roleForDoc: string
) {
    const fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("role", roleForDoc);


    const res = await fetch(`${API_URL}/upload_docs`, {
        method: "POST",
        headers: {
            Authorization: basicAuthHeader(username, password),
        },
        body: fd,
    });
    return res;
}


export async function chat(username: string, password: string, message: string) {
    // streamlit used requests.post(..., data={"message": msg}) so we send form-encoded
    const params = new URLSearchParams();
    params.append("message", message);


    const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            Authorization: basicAuthHeader(username, password),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });


    return res;
}