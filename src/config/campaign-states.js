// campaign states, this must be same in database
// adding this for avoinding sub queries
// we can figure our some way to seed this as it is, now we have a challenge while we run seeders
export const CAMPAIGN_STATES = {
    matched: { id: 1, name: "Matched", slug: "matched" },
    accepted: { id: 2, name: "Accepted", slug: "accepted" },
    offered: { id: 3, name: "Offered", slug: "offered" },
    contract: { id: 4, name: "Contract", slug: "contract" },
    briefed: { id: 5, name: "Briefed", slug: "briefed" },
    drafted: { id: 6, name: "Drafted", slug: "drafted" },
    approved: { id: 7, name: "Approved", slug: "approved" },
    published: { id: 8, name: "Published", slug: "published" },
    completed: { id: 9, name: "Completed", slug: "completed" }
};

// Static helper for quick access in your app
// Usage: StateIds.MATCHED => 1
export const StateIds = Object.keys(CAMPAIGN_STATES).reduce((acc, key) => {
    acc[key] = CAMPAIGN_STATES[key].id;
    return acc;
}, {});