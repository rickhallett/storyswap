import { Link } from '@remix-run/react';

export const Logo = () => (
	<div className="absolute left-0 flex-shrink-0 lg:static">
		<Link to="/">
			<span className="sr-only">Your Company</span>
			<img
				className="h-8 w-auto"
				src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=300"
				alt="Your Company"
			/>
		</Link>
	</div>
);
