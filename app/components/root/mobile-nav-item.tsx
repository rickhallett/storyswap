import { Link } from '@remix-run/react';
import classnames from 'classnames';
import { Icon } from '../ui/icon.tsx';

export const MobileNavItem = ({
	href,
	name,
	hidden,
	logo,
	soon,
}: {
	href: string;
	name: string;
	hidden: boolean;
	logo: string;
	soon: boolean;
}): React.JSX.Element => (
	<Link
		hidden={hidden}
		to={href}
		className={classnames(
			'flex justify-between rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800',
			{ hidden },
		)}
	>
		<Icon className="text-body-md" name={logo}>
			<button>{name}</button>
		</Icon>
		{soon && (
			<span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-gray-600">
				Coming soon!
			</span>
		)}
	</Link>
);
