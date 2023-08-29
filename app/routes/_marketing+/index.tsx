import { type V2_MetaFunction } from '@remix-run/node';

import { quitter } from './logos/logos.ts';

export const meta: V2_MetaFunction = () => [{ title: 'StorySwap' }];

export default function Index() {
	return (
		<div className="container flex items-center justify-center p-2 text-h4 ">
			<div className="flex flex-col gap-6">
				<div className="flex gap-3">
					<h1 className="text-center align-middle text-indigo-500">
						Welcome to StorySwap
					</h1>
				</div>
				<img src={quitter} alt="quit-meme" />
			</div>
		</div>
	);
}
