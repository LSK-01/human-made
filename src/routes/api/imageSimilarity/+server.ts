import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const data = await request.json();
	const { url, imageb64 } = data;

	const res = await fetch('http://127.0.0.1:5000/imageSimilarity', {
		method: 'POST',
		body: JSON.stringify({ url: url, imageb64: imageb64 }),
		headers:{
			'Content-Type': 'application/json',
		},
	});

	const obj = await res.json();
	console.log('json: ', obj);
	return json({sim: obj.sim});
};
