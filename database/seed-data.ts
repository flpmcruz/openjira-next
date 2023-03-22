
interface SeedData {
    entries: SeedEntry[]
}

interface SeedEntry {
    description: string
    status: string
    createdAt: number
}

export const seedData:SeedData = {
    entries: [
        {
            description: 'Pending - Incididunt dolor voluptate labore anim elit elit proident anim.',
            status: 'pending',
            createdAt: Date.now()
        },
        {
            description: 'In-Progres - Incididunt dolor voluptate labore anim elit elit proident anim.',
            status: 'in-progress',
            createdAt: Date.now() -1000000
        },
        {
            description: 'Finished - Incididunt dolor voluptate labore anim elit elit proident anim.',
            status: 'finished',
            createdAt: Date.now()-20000000
        },
    ]
}

export function getEntryById(id: string) {
    throw new Error('Function not implemented.')
}
