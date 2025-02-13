import mongoose from 'mongoose';

export function createProjection(fields) {
  return fields.reduce((acc, field) => {
    acc[field] = 1;
    return acc;
  }, {});
}

export function optimizeQuery(query) {
  // Ajouter des index composites si nécessaire
  if (query.eventId && query.userId) {
    query.$hint = { eventId: 1, userId: 1 };
  }

  // Limiter les résultats par défaut
  if (!query.limit) {
    query.limit = 50;
  }

  return query;
}

export async function runOptimizedQuery(model, query, options = {}) {
  const {
    fields,
    populate,
    lean = true,
    timeout = 10000
  } = options;

  let queryBuilder = model.find(query);

  // Sélectionner uniquement les champs nécessaires
  if (fields) {
    queryBuilder = queryBuilder.select(createProjection(fields));
  }

  // Optimiser les populate
  if (populate) {
    populate.forEach(({ path, select }) => {
      queryBuilder = queryBuilder.populate({
        path,
        select: select ? createProjection(select) : undefined
      });
    });
  }

  // Ajouter un timeout
  queryBuilder = queryBuilder.maxTimeMS(timeout);

  // Convertir en objets simples pour de meilleures performances
  if (lean) {
    queryBuilder = queryBuilder.lean();
  }

  return queryBuilder;
} 