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
						to={'/'}
						// this is for progressive enhancement
						onClick={(e) => e.preventDefault()}
						className="flex items-center gap-2"
					>
						<Icon name="dashboard" className="text-body-md" />
						<span className="text-body">Menu</span>
					</Link>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent sideOffset={8} align="start">
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={'/'}>
							<Icon className="text-body-md" name="home">
								Homepage
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={'/users'}>
							<Icon className="text-body-md" name="camera">
								User Profiles
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={'/books'}>
							<Icon className="text-body-md" name="pencil-2">
								Book Listings
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={'/'}>
							<Icon className="text-body-md" name="bookmark">
								Search Books
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={'/'}>
							<Icon className="text-body-md" name="switch">
								Swap Requests
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={'/'}>
							<Icon className="text-body-md" name="pencil-1">
								Reviews
							</Icon>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
};

export default Navbar;
