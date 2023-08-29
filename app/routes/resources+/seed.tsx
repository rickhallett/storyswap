import { redirectWithToast } from '#app/utils/toast.server.ts';
import { seedDB } from '#prisma/seedDB.ts';

export const ROUTE_PATH = '/resources/seed';

export async function loader() {
	const seeded = await seedDB(); // run seed as usual

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
