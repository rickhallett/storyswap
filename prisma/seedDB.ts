import { faker } from '@faker-js/faker';
import { goodreads } from '#app/mockdata/goodreads.ts';
import { prisma } from '#app/utils/db.server.ts';
import { BOOK_CONDITIONS, BOOK_STATUSES } from '#constants/prisma.constants.ts';

import { createPassword, createUser, getNoteImages } from '#tests/db-utils.ts';

export async function seedDB() {
	console.log('🌱 Seeding...');
	console.time(`🌱 Database has been seeded`);

	console.time('🧹 Cleaned up the database...');
	await prisma.permission.deleteMany();
	await prisma.book.deleteMany();
	await prisma.bookStatus.deleteMany();
	await prisma.bookCondition.deleteMany();
	await prisma.swapRequest.deleteMany();
	await prisma.swapRequestStatus.deleteMany();
	await prisma.message.deleteMany();
	await prisma.review.deleteMany();
	await prisma.noteImage.deleteMany();
	await prisma.userImage.deleteMany();
	await prisma.password.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verification.deleteMany();
	await prisma.connection.deleteMany();
	await prisma.note.deleteMany();
	await prisma.genre.deleteMany();
	await prisma.role.deleteMany();
	await prisma.user.deleteMany();
	console.timeEnd('🧹 Cleaned up the database...');

	console.time('🔑 Created permissions...');
	const entities = [
		'user',
		'note',
		'genre',
		'book',
		'swapRequest',
		'message',
		'review',
	];
	const actions = ['create', 'read', 'update', 'delete'];
	const accesses = ['own', 'any'] as const;
	for (const entity of entities) {
		for (const action of actions) {
			for (const access of accesses) {
				await prisma.permission.create({ data: { entity, action, access } });
			}
		}
	}
	console.timeEnd('🔑 Created permissions...');

	console.time('👑 Created roles...');
	await prisma.role.create({
		data: {
			name: 'admin',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'any' },
				}),
			},
		},
	});
	await prisma.role.create({
		data: {
			name: 'user',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'own' },
				}),
			},
		},
	});
	console.timeEnd('👑 Created roles...');

	console.time('👑 Created superadmin');
	await prisma.user
		.create({
			data: {
				username: 'superadmin',
				name: 'Super Admin',
				email: 'rick.hallett@brandwatch.com',
				password: { create: createPassword('superadmin') },
				roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
			},
		})
		.catch((e) => console.error('Error creating user', e));
	console.timeEnd('👑 Created superadmin');

	if (process.env.MINIMAL_SEED) {
		console.log('👍 Minimal seed complete');
		console.timeEnd(`🌱 Database has been seeded`);
		return;
	}

	const totalUsers = 20;
	console.time(`👤 Created ${totalUsers} users...`);
	const noteImages = await getNoteImages();

	for (let index = 0; index < totalUsers; index++) {
		const userData = createUser();
		await prisma.user
			.create({
				data: {
					...userData,
					password: { create: createPassword(userData.username) },
					roles: { connect: { name: 'user' } },
					bio: faker.person.bio(),
					notes: {
						create: Array.from({
							length: faker.number.int({ min: 1, max: 10 }),
						}).map(() => ({
							title: faker.lorem.sentence(),
							content: faker.lorem.paragraphs(),
							images: {
								create: Array.from({
									length: faker.number.int({ min: 1, max: 3 }),
								}).map(() => {
									const imgNumber = faker.number.int({ min: 0, max: 9 });
									return noteImages[imgNumber];
								}),
							},
						})),
					},
				},
			})
			.catch((e) => {
				console.error('Error creating a user:', e);
				return null;
			});
	}
	console.timeEnd(`👤 Created ${totalUsers} users...`);

	console.time('🌱 Seeded book status');
	for (const status of Object.keys(BOOK_STATUSES)) {
		await prisma.bookStatus.create({
			data: {
				name: status,
			},
		});
	}
	console.timeEnd('🌱 Seeded book status');

	console.time('🌱 Seeded book conditions');
	for (const condition of Object.keys(BOOK_CONDITIONS)) {
		await prisma.bookCondition.create({
			data: {
				name: condition,
			},
		});
	}
	console.timeEnd('🌱 Seeded book conditions');

	console.time('🌱 Seeded book genres');

	for (const category of goodreads) {
		await prisma.genre.create({
			data: {
				name: category.genre.toUpperCase(),
			},
		});
	}
	console.timeEnd('🌱 Seeded book genres');

	console.time('🌱 Seeded books');
	const superadmin = await prisma.user.findUnique({
		where: { username: 'superadmin' },
	});
	const bookStatusAll = await prisma.bookStatus.findMany();
	const bookConditionsAll = await prisma.bookCondition.findMany();
	const condition =
		bookConditionsAll[
			faker.number.int({ min: 0, max: bookConditionsAll.length - 1 })
		];

	const status =
		bookStatusAll[faker.number.int({ min: 0, max: bookStatusAll.length - 1 })];

	for (const category of goodreads) {
		for (const book of category.books) {
			const genre = await prisma.genre.findUniqueOrThrow({
				where: { name: category.genre.toUpperCase() },
				select: { id: true },
			});
			await prisma.book.create({
				select: { id: true },
				data: {
					user: { connect: { id: superadmin?.id } },
					title: book.title,
					author: book.author,
					genre: { connect: { id: genre.id } },
					condition: { connect: { id: condition.id } },
					status: { connect: { id: status.id } },
					smallImageURL: book.smallImageURL,
					goodreadsId: book.id,
					goodreadsRating: book.rating,
					goodreadsRatings: book.ratings,
					publicationYear: book.publicationYear,
				},
			});
		}
	}
	console.timeEnd('🌱 Seeded books');

	console.timeEnd(`🌱 Database has been seeded`);

	return true;
}
