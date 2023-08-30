import {
	type DataFunctionArgs,
	json,
	type LinksFunction,
} from '@remix-run/node';
import { Link, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import BookListCards from '#app/components/books/book-list-card.tsx';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import bookListStyles from '#app/styles/book-list-item.css';
import { requireUserId } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: bookListStyles }];
};

export async function loader({ request }: DataFunctionArgs) {
	await requireUserId(request);

	const books = await prisma.book.findMany({
		select: {
			id: true,
			title: true,
			author: true,
			description: true,
			smallImageURL: true,
			goodreadsId: true,
			goodreadsRating: true,
			goodreadsRatings: true,
			publicationYear: true,
			user: true,
			status: true,
			genre: true,
			condition: true,
			swapRequests: true,
		},
	});
	return json({ books });
}

export default function BooksRoute() {
	const data = useRouteLoaderData('root');
	const { books } = useLoaderData<typeof loader>();

	return (
		<div className="container flex items-center justify-center p-5">
			<div className="flex flex-col gap-6">
				<BookListCards books={books} user={data.user} />
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
