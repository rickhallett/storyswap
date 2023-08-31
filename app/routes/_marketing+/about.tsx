import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';

const profile = {
	name: 'Rick Hallett',
	email: 'rickhallett@icloud.com',
	avatar: 'https://avatars.githubusercontent.com/u/29977869?v=4',
	backgroundImage:
		'https://images.unsplash.com/photo-1567372704182-ec2ea042c937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80',
	fields: [
		['Phone', '+447375862225'],
		['Email', 'rickhallett@icloud.com'],
		['Title', 'Full Stack Developer'],
		['Location', 'Brighton, UK'],
		['Birthday', '8 Dec 1986'],
	],
};

export default function About() {
	return (
		<div className="h-screen">
			<div>
				<img
					className="h-32 w-full object-cover lg:h-48"
					src={profile.backgroundImage}
					alt=""
				/>
			</div>
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
				<div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
					<div className="flex">
						<img
							className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
							src={profile.avatar}
							alt=""
						/>
					</div>
					<div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
						<div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
							<h1 className="truncate text-2xl font-bold text-gray-900">
								{profile.name}
							</h1>
						</div>
						<div className="flex flex-row flex-wrap gap-2">
							{profile.fields.map(([key, value]) => (
								<span
									key={key}
									className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
								>
									{value}
								</span>
							))}
						</div>
						<div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
							<button
								type="button"
								className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								<EnvelopeIcon
									className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
								<span>Message</span>
							</button>
							<button
								type="button"
								className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								<PhoneIcon
									className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
								<span>Call</span>
							</button>
						</div>
					</div>
				</div>
				<div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
					<h1 className="truncate text-2xl font-bold text-gray-900">
						{profile.name}
					</h1>
				</div>
			</div>
		</div>
	);
}
