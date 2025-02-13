export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Events API',
    version: '1.0.0',
    description: 'API de gestion d\'événements'
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL,
      description: 'Serveur principal'
    }
  ],
  paths: {
    '/api/events': {
      get: {
        summary: 'Liste des événements',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer' }
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Liste des événements',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    events: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Event' }
                    },
                    totalPages: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}; 