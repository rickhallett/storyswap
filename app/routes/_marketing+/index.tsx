import { CheckIcon } from '@heroicons/react/20/solid';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { type V2_MetaFunction } from '@remix-run/node';

import { Icon } from '#app/components/ui/icon.tsx';
import { Link } from '@remix-run/react';

export const meta: V2_MetaFunction = () => [{ title: 'StorySwap' }];

const timeline = [
	{
		id: 1,
		content: 'Built',
		target: 'initial UI',
		date: 'Aug 2023',
		datetime: '2020-09-20',
		icon: CheckIcon,
		iconBackground: 'bg-green-500',
	},
	{
		id: 2,
		content: 'Built',
		target: 'register, login, logout',
		date: 'Aug 2023',
		datetime: '2020-09-22',
		icon: CheckIcon,
		iconBackground: 'bg-green-500',
	},
	{
		id: 3,
		content: 'Built',
		target: 'user profile settings',
		date: 'Aug 2023',
		datetime: '2020-09-22',
		icon: CheckIcon,
		iconBackground: 'bg-green-500',
	},
	{
		id: 4,
		content: 'Integrated',
		target: 'email service',
		date: 'Aug 2023',
		datetime: '2020-09-28',
		icon: CheckIcon,
		iconBackground: 'bg-green-500',
	},
	{
		id: 5,
		content: 'Built',
		target: 'user search',
		date: 'Aug 2023',
		datetime: '2020-09-30',
		icon: CheckIcon,
		iconBackground: 'bg-green-500',
	},
	{
		id: 6,
		content: 'Building',
		target: 'book search',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 7,
		content: 'Building',
		target: 'book upload',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 8,
		content: 'Building',
		target: 'user book shelf',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 9,
		content: 'Building',
		target: 'book swap system',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 10,
		content: 'Building',
		target: 'book recommendation system',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 11,
		content: 'Building',
		target: 'integration with Goodreads',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 12,
		content: 'Building',
		target: 'integration with courier service',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 13,
		content: 'Building',
		target: 'Ecological impact calculator',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 14,
		content: 'Building',
		target: 'user messaging system',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 15,
		content: 'Building',
		target: 'community history feed',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 16,
		content: 'Building',
		target: 'bug report system',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
	{
		id: 17,
		content: 'Building',
		target: 'onboarding guide',
		date: 'TBC',
		datetime: '2020-10-04',
		icon: QuestionMarkCircleIcon,
		iconBackground: 'bg-yellow-500',
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

function FeatureTimeline() {
	return (
		<div className="flow-root">
			<ul className="-mb-8">
				{timeline.map((event, eventIdx) => (
					<li key={event.id}>
						<div className="relative pb-8">
							{eventIdx !== timeline.length - 1 ? (
								<span
									className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
									aria-hidden="true"
								/>
							) : null}
							<div className="relative flex space-x-3">
								<div>
									<span
										className={classNames(
											event.iconBackground,
											'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
										)}
									>
										<event.icon
											className="h-5 w-5 text-white"
											aria-hidden="true"
										/>
									</span>
								</div>
								<div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
									<div>
										<p className="text-sm text-gray-500">
											{event.content}{' '}
											<Link to={'/'} className="font-medium text-gray-900">
												{event.target}
											</Link>
										</p>
									</div>
									<div className="whitespace-nowrap text-right text-sm text-gray-500">
										<time dateTime={event.datetime}>{event.date}</time>
									</div>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function Index() {
	return (
		<>
			<div className="container flex items-center justify-center p-2 text-h4 ">
				<div className="flex flex-col gap-6">
					<div className="flex gap-3">
						<h1 className="text-center align-middle text-indigo-500">
							Welcome to StorySwap
						</h1>
					</div>
				</div>
			</div>
			<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
				<div className="px-4 py-5 sm:px-6">
					{/* Content goes here */}
					<ul className="list grid grid-flow-row gap-4 text-center text-sm text-slate-600">
						<li>
							For just £1 a month, you can swap your read books with others.
						</li>
						<li>
							You only pay for postage! We'll send you a pre-paid labels and
							arrange for couriers if you need one.
						</li>
						<li>
							<Icon name="reader" size="md" className="text-green-600">
								Read more
							</Icon>
						</li>
						<li>
							<Icon name="globe" className="text-green-600" size="md">
								Save our trees
							</Icon>
						</li>
						<li>
							<Icon name="face" size="md" className="text-green-600">
								Connect
							</Icon>
						</li>
					</ul>
				</div>
				<div className="px-4 py-5 sm:p-6">
					<FeatureTimeline />
				</div>
				<div className="px-4 py-4 sm:px-6">
					{/* Content goes here */}
					{/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
				</div>
			</div>
			<div></div>
		</>
	);
}
