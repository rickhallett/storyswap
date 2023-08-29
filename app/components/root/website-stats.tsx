export type Stat = {
	name: string;
	value: string | number;
	unit?: string;
};

export function WebsiteStats({ stats }: { stats: Stat[] }) {
	return (
		<div className="bg-indigo-600 pb-2">
			<div className="mx-auto max-w-7xl sm:max-w-sm">
				<div className="grid grid-cols-4 gap-px bg-indigo-600 sm:grid-cols-4 lg:grid-cols-4">
					{stats?.map((stat: Stat) => (
						<div
							key={stat.name}
							className="bg-indigo-600 px-2 py-2 sm:px-6 lg:px-8"
						>
							<p className="text-center text-sm font-light leading-6 text-gray-400">
								{stat.name}
							</p>
							<p className="mt-2 flex items-center justify-center gap-x-2">
								<span className="text-center text-sm font-light tracking-tight text-white">
									{stat.value}
								</span>
								{stat.unit ? (
									<span className="text-sm text-gray-400">{stat.unit}</span>
								) : null}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
