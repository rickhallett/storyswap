import * as Tabs from '@radix-ui/react-tabs';
import React from 'react';
import { Button } from '../ui/button.tsx';
import { Icon } from '../ui/icon.tsx';
import { Label } from '../ui/label.tsx';

const BookListItem = ({ book }: { book: any }) => (
	<Tabs.Root className="TabsRoot min-h-[170px] bg-slate-50" defaultValue="tab1">
		<Tabs.List className="TabsList" aria-label="Manage your account">
			<Tabs.Trigger className="TabsTrigger" value="tab1">
				Summary
			</Tabs.Trigger>
			<Tabs.Trigger className="TabsTrigger" value="tab2">
				Actions
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content className="TabContent p-2 text-sm" value="tab1">
			<div>
				<Label className="mr-2 inline">Title:</Label>
				<span>{book.title}</span>
			</div>
			<div>
				<Label className="mr-2 inline">Author:</Label>
				<span>{book.author}</span>
			</div>
			<div>
				<Label className="mr-2 inline">Desc:</Label>
				<span>{book.description}</span>
			</div>
			<div>
				<Label className="mr-2 inline">Bio:</Label>
				<span>{book.bio}</span>
			</div>
			<div>
				<Label className="mr-2 inline">Owner:</Label>
				<span>{book.user.name}</span>
			</div>
		</Tabs.Content>
		<Tabs.Content className="TabContent flex flex-col gap-2" value="tab2">
			<Button variant="secondary" size="sm">
				Wishlist
				<Icon name="bookmark" className="ml-2" />
			</Button>
			<Button variant="secondary" size="sm">
				Request Swap
				<Icon name="switch" className="ml-2" />
			</Button>
			<Button variant="secondary" size="sm">
				Message Owner
				<Icon name="avatar" className="ml-2" />
			</Button>
		</Tabs.Content>
	</Tabs.Root>
);

export default BookListItem;
