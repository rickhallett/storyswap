import classnames from 'classnames';

export const DesktopNavBar = ({ navigationItems }) => (
	<div className="hidden border-t border-white border-opacity-20 py-5 lg:block">
		<div className="grid grid-cols-3 items-center gap-8">
			<div className="col-span-2">
				<nav className="flex space-x-4">
					{navigationItems.map((item) => {
						return (
							<a
								key={item.name}
								href={item.href}
								className={classnames(
									'min-w-fit rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10',
									{ 'text-white': item.current },
									{ 'text-emerald-100': !item.current },
									{ hidden: item.hidden },
								)}
								aria-current={item.current ? 'page' : undefined}
							>
								{item.name}
							</a>
						);
					})}
				</nav>
			</div>
		</div>
	</div>
);
