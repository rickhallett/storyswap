import { prisma } from '#app/utils/db.server.ts';
import { seedDB } from './seedDB.ts';

seedDB()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
