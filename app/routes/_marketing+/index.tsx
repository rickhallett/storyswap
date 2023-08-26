import { type V2_MetaFunction } from '@remix-run/node';

import { quitter } from './logos/logos.ts';

export const meta: V2_MetaFunction = () => [{ title: 'StorySwap' }];

export default function Index() {
	return (
		<div className="container flex items-center justify-center p-20 text-h2">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<h2 className="text-slate-400">StorySwap!</h2>
				</div>
				<img src={quitter} alt="quit-meme" />
			</div>
		</div>
	);
}
