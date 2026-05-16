"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
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
            update: { type: prisma_1.RoomType.PUBLIC },
            create: {
                name,
                type: prisma_1.RoomType.PUBLIC,
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
