import type { APIRoute } from "astro";

import { API_URL } from '../../consts';

export const POST: APIRoute = async ({request}) => {
    const data = await request.formData();
    const inputs = data.get("inputs");

    if (!inputs || typeof inputs !== "string" || inputs.length < 1) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    try {
        const summaryRequest = fetch(`${API_URL}/text-gen`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs }),
        }).then((res) => {
            if(!res.ok) throw new Error("Failed to fetch summary");
            return res.json()
        }).then((res) => {
            return res.summary as string;
        }).catch((err) => {
            console.error(err);
        });

        const headlineRequest = fetch(`${API_URL}/title-gen`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs }),
        }).then((res) => {
            if(!res.ok) throw new Error("Failed to fetch summary");
            return res.json()
        }).then((res) => {
            return res.headline as string;
        }).catch((err) => {
            console.error(err);
        });

        const keywords = await fetch(`${API_URL}/tokenizer`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs }),
            
        }).then((res) => {
            if(!res.ok) throw new Error("Failed to fetch tokens");
            return res.json();
        }).catch((err) => {
            console.error(err);
        });

        const data: ArrayBuffer = await fetch(`${API_URL}/image-gen`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            body: JSON.stringify({inputs: keywords}),
        }).then((res) => {
            if(!res.ok) throw new Error("Failed to fetch image");
            return res.arrayBuffer();
        }).catch((err) => {
            console.error(err);
            return new ArrayBuffer(0);
        });

        const img = Buffer.from(data).toString("base64");
        const plain = await summaryRequest;
        const headline = await headlineRequest;

        if (plain == null)
            throw new Error("Failed to fetch summary");
        
        const summary = plain.replace(/^./, plain[0].toUpperCase())
        
        return new Response(
            JSON.stringify({
                headline,
                summary,
                img
            }),
            { status: 200 }
        );
    } catch (error: Error | any) {
        return new Response(
            JSON.stringify({
                message: error?.message ?? "Internal Server Error",
            }),
            { status: 500 }
        );
    }
};