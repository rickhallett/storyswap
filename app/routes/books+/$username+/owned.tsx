import { type DataFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '#app/utils/db.server.ts';

export async function loader({ params }: DataFunctionArgs) {
	const ownedBooks = await prisma.book.findMany({
		where: {
			user: {
				username: params.username,
			},
		},
	});

	return json(ownedBooks);
}

export default function UsernameBooks() {
	const ownedBooks = useLoaderData<typeof loader>();
	console.log({ ownedBooks });
	return <div>User Books</div>;
}
