// import { CaretDownIcon } from '@radix-ui/react-icons'
// import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { type LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import React from 'react';
import { Button } from '../components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from '../components/ui/dropdown-menu.tsx';
import { Icon } from '../components/ui/icon.tsx';

export const links: LinksFunction = () => {
	return [].filter(Boolean);
};

const Navbar = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button asChild variant="secondary">
					<Link
						to={`/users/`}
						// this is for progressive enhancement
						onClick={(e) => e.preventDefault()}
						className="flex items-center gap-2"
					>
						<Icon name="avatar" className="text-body-md" />
						<span className="text-body">Home</span>
					</Link>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent sideOffset={8} align="start">
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/`}>
							<Icon className="text-body-md" name="avatar">
								Settings
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/notes`}>
							<Icon className="text-body-md" name="pencil-2">
								Books
							</Icon>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
};

export default Navbar;
