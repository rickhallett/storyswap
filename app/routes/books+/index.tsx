import { Link } from '@remix-run/react';
import { Icon } from '#app/components/ui/icon.tsx';

export default function BooksRoute() {
	return (
		<div className="container flex items-center justify-center p-20 text-h2">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<h2 className="text-sky-600">Coming soon...!</h2>
					<pre className="whitespace-pre-wrap break-all text-body-lg text-sky-300">
						{location.pathname}
					</pre>
				</div>
				<Link to="/" className="text-body-md underline">
					<Icon name="arrow-left">Back to home</Icon>
				</Link>
			</div>
		</div>
	);
}
