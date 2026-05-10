module.exports = {
  PrismaClient: class PrismaClient {
    user = { findUnique: () => Promise.resolve(null) };
    workout = { findMany: () => Promise.resolve([]) };
    contract = { count: () => Promise.resolve(0) };
    interaction = { count: () => Promise.resolve(0) };
    badge = {
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve(null),
      updateMany: () => Promise.resolve(null),
    };
  },
};
