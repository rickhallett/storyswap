import axios from 'axios';

const options = {
	method: 'GET',
	url: 'https://books17.p.rapidapi.com/subjects/cars',
	headers: {
		'X-RapidAPI-Key': 'e37f29562fmshdd85367e98b1a90p1222f0jsne4fddd7afac5',
		'X-RapidAPI-Host': 'books17.p.rapidapi.com',
	},
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}
