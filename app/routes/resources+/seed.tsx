import { type DataFunctionArgs } from '@remix-run/node';
import { redirectWithToast } from '#app/utils/toast.server.ts';
import { seedDB } from '#prisma/seedDB.ts';

export const ROUTE_PATH = '/resources/seed';

export async function loader({ request }: DataFunctionArgs) {
	const seeded = await seedDB();

	if (seeded) {
		return redirectWithToast('/', {
			title: 'Database seeded!',
			description: 'Let the testing commence!',
			type: 'success',
		});
	}

	return redirectWithToast('/', {
		title: 'Database seeded!',
		description: 'Let the testing commence!',
		type: 'error',
	});
}
