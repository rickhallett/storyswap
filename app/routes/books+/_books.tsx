import { type DataFunctionArgs, json, redirect } from '@remix-run/node';
import { useOutletContext, useRouteLoaderData } from '@remix-run/react';
import { z } from 'zod';
import BookListCards from '#app/components/books/book-list-card.tsx';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { ErrorList } from '#app/components/forms.tsx';
import { SearchBar } from '#app/components/search-bar.tsx';
import { type UserContextType } from '#app/root.tsx';
import { requireUserId } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';

const BookSearchResultSchema = z.object({
	id: z.string(),
	title: z.string().nullable(),
	author: z.string().nullable(),
	description: z.string().nullable(),
	smallImageURL: z.string().nullable(),
	goodreadsId: z.number().nullable(),
	goodreadsRating: z.number().nullable(),
	goodreadsRatings: z.number().nullable(),
	publicationYear: z.number().nullable(),
	createdAt: z.date(),
	user: z.object({
		id: z.string(),
		username: z.string().nullable(),
		name: z.string().nullable(),
		email: z.string().nullable(),
	}),
	status: z.object({
		name: z.string().nullable(),
	}),
	genre: z.object({
		name: z.string().nullable(),
	}),
	condition: z.object({
		name: z.string().nullable(),
	}),
	swapRequests: z.array(
		z.object({
			id: z.string(),
			createdAt: z.date(),
			status: z.object({
				name: z.string().nullable(),
			}),
		}),
	),
});

const BookSearchResultsSchema = z.array(BookSearchResultSchema);

// export const links: LinksFunction = () => {
// 	return [{ rel: 'stylesheet', href: bookListStyles }];
// };

export async function loader({ request }: DataFunctionArgs) {
	await requireUserId(request);
	const searchTerm = new URL(request.url).searchParams.get('search');
	if (searchTerm === '') {
		redirect('/books');
	}

	const filteredBooks = await prisma.book.findMany({
		where: {
			OR: [
				{
					title: { contains: searchTerm ?? '' },
				},
				{
					author: { contains: searchTerm ?? '' },
				},
			],
		},
		orderBy: {
			title: 'desc',
		},
		select: {
			id: true,
			title: true,
			author: true,
			description: true,
			smallImageURL: true,
			createdAt: true,
			goodreadsId: true,
			goodreadsRating: true,
			goodreadsRatings: true,
			publicationYear: true,
			user: { select: { id: true, username: true, name: true, email: true } },
			status: { select: { name: true } },
			genre: { select: { name: true } },
			condition: { select: { name: true } },
			swapRequests: {
				select: {
					id: true,
					createdAt: true,
					status: { select: { name: true } },
				},
			},
		},
		take: 10,
	});

	// TODO: temporarily bypass schema validation
	return json({ status: 'idle', books: filteredBooks } as const);

	// const result = BookSearchResultsSchema.safeParse(filteredBooks);
	// if (!result.success) {
	// 	console.error(JSON.stringify(result.error, null, 2));
	// 	return json({ status: 'error', error: result.error.message } as const, {
	// 		status: 400,
	// 	});
	// }

	// return json({ status: 'idle', books: result.data } as const);
}

export default function BooksRoute() {
	const data = useRouteLoaderData('routes/books+/_books');
	const user = useOutletContext<UserContextType>().user;

	if (data.status === 'error') {
		console.error(data.error);
	}

	console.log(data);

	return (
		<div className="container mb-48 mt-6 flex flex-col items-center justify-center gap-6">
			<h1 className="text-h5">StorySwap Books</h1>
			<div className="w-full max-w-[700px] ">
				<SearchBar
					status={data.status}
					formAction="/books"
					autoFocus
					autoSubmit
				/>
			</div>
			<main>
				{data.status === 'idle' ? (
					data.books.length ? (
						<BookListCards books={data.books} user={user} />
					) : (
						<p>No books found</p>
					)
				) : data.status === 'error' ? (
					<ErrorList errors={['There was an error parsing the results']} />
				) : null}
			</main>
		</div>
	);
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
