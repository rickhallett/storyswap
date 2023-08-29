import { Link } from '@remix-run/react';
import classnames from 'classnames';
import { Icon } from '../ui/icon.tsx';

export const MobileNavItem = ({
	href,
	name,
	hidden,
	logo,
}: {
	href: string;
	name: string;
	hidden: boolean;
	logo: string;
}): React.JSX.Element => (
	<Link
		hidden={hidden}
		to={href}
		className={classnames(
			'block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800',
			{ hidden },
		)}
	>
		<Icon className="text-body-md" name={logo}>
			<button>{name}</button>
		</Icon>
	</Link>
);