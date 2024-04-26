import { json } from '@sveltejs/kit';

const backendURL = "http://127.0.0.1:5000";

export const POST = async ({ request }) => {
	const data = await request.json();
	const { url, imageb64 } = data;
	console.log('url: ', url);

	const res = await fetch(backendURL + '/imageSimilarity', {
		method: 'POST',
		body: JSON.stringify({ url: url, imageb64: imageb64 }),
		headers:{
			'Content-Type': 'application/json',
		},
	});

	const obj = await res.json();
	return json({sim: obj.sim});
};
