import { PrismaClient, RoomType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const publicRooms = [
        "React Help",
        "Startup Chat",
        "AI Discussion",
        "General Chat",
        "Programming Help"
    ];

    console.log("Seeding public rooms...");

    for (const name of publicRooms) {
        await prisma.room.upsert({
            where: { name },
            update: { type: RoomType.PUBLIC },
            create: {
                name,
                type: RoomType.PUBLIC,
            },
        });
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
