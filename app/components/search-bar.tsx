import { Form, useSearchParams, useSubmit } from '@remix-run/react';

import { useDebounce, useIsPending } from '#app/utils/misc.tsx';

import { Icon } from './ui/icon.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { StatusButton } from './ui/status-button.tsx';

export function SearchBar({
	status,
	hideInput,
	autoFocus = false,
	autoSubmit = false,
	formAction,
	searchParam,
}: {
	status: 'idle' | 'pending' | 'success' | 'error';
	hideInput?: boolean;
	autoFocus?: boolean;
	autoSubmit?: boolean;
	formAction: string;
	searchParam: string;
}) {
	const [searchParams] = useSearchParams();
	const submit = useSubmit();
	const isSubmitting = useIsPending({
		formMethod: 'GET',
		formAction,
	});

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		submit(form);
	}, 400);

	return (
		<Form
			method="GET"
			action={formAction}
			className="flex flex-wrap items-center justify-center gap-2"
			onChange={(e) => autoSubmit && handleFormChange(e.currentTarget)}
		>
			<div className="flex-1">
				<Label htmlFor="search" className="sr-only">
					Search
				</Label>
				{!hideInput && (
					<Input
						type="search"
						name={searchParam}
						id={`search-${formAction}`}
						defaultValue={searchParams.get(searchParam) ?? ''}
						placeholder="Search"
						className="w-full"
						autoFocus={autoFocus}
					/>
				)}
			</div>
			<div>
				<StatusButton
					type="submit"
					status={isSubmitting ? 'pending' : status}
					className="flex w-full items-center justify-center"
					size="sm"
				>
					<Icon name="magnifying-glass" size="sm" />
					<span className="sr-only">Search</span>
				</StatusButton>
			</div>
		</Form>
	);
}
