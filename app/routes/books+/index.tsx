import { json, type LinksFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import BookListItem from '#app/components/ui/book-list-item.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import bookListStyles from '#app/styles/book-list-item.css';
import { prisma } from '#app/utils/db.server.ts';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: bookListStyles }];
};

export async function loader() {
	return json(
		await prisma.book.findMany({
			include: {
				user: true,
				status: true,
				genre: true,
				condition: true,
			},
		}),
	);
}

export default function BooksRoute() {
	const books = useLoaderData<typeof loader>();
	console.log({ books });
	return (
		<div className="container flex items-center justify-center p-5">
			<div className="flex flex-col gap-6">
				{books.map((book) => (
					<BookListItem key={book.id} book={book} />
				))}
				<Link to="/" className="text-body-md underline">
					<Icon name="arrow-left">Back to home</Icon>
				</Link>
			</div>
		</div>
	);
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
