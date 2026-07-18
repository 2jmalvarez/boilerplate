const errorResponse = {
  description: 'Error response',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
    },
  },
};

const taskResponse = {
  description: 'Task',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['data'],
        properties: { data: { $ref: '#/components/schemas/Task' } },
      },
    },
  },
};

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Boilerplate API',
    version: '1.0.0',
    description: 'Minimal production-oriented auth and task API.',
  },
  servers: [{ url: '/' }],
  tags: [{ name: 'Health' }, { name: 'Auth' }, { name: 'Tasks' }],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Liveness probe',
        responses: { '200': { description: 'Process is alive' } },
      },
    },
    '/ready': {
      get: {
        tags: ['Health'],
        summary: 'Database readiness probe',
        responses: { '200': { description: 'Database is reachable' }, '503': errorResponse },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Registration' } } } },
        responses: { '201': { $ref: '#/components/responses/AuthSuccess' }, '400': errorResponse, '409': errorResponse },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Credentials' } } } },
        responses: { '200': { $ref: '#/components/responses/AuthSuccess' }, '400': errorResponse, '401': errorResponse },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Current user' }, '401': errorResponse },
      },
    },
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List visible tasks',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 } },
          { in: 'query', name: 'offset', schema: { type: 'integer', minimum: 0, default: 0 } },
          { in: 'query', name: 'status', schema: { $ref: '#/components/schemas/TaskStatus' } },
        ],
        responses: { '200': { description: 'Task list' }, '401': errorResponse },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a task',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } },
        responses: { '201': taskResponse, '400': errorResponse, '401': errorResponse },
      },
    },
    '/api/tasks/{id}': {
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
      get: {
        tags: ['Tasks'],
        summary: 'Get a task',
        security: [{ bearerAuth: [] }],
        responses: { '200': taskResponse, '401': errorResponse, '404': errorResponse },
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Update a task',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } },
        responses: { '200': taskResponse, '400': errorResponse, '401': errorResponse, '404': errorResponse },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        security: [{ bearerAuth: [] }],
        responses: { '204': { description: 'Deleted' }, '401': errorResponse, '404': errorResponse },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    responses: {
      AuthSuccess: {
        description: 'Authenticated',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    accessToken: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    schemas: {
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', maxLength: 254 },
          password: { type: 'string', minLength: 8, maxLength: 72, format: 'password' },
        },
      },
      Registration: {
        allOf: [
          { $ref: '#/components/schemas/Credentials' },
          {
            type: 'object',
            required: ['name'],
            properties: { name: { type: 'string', minLength: 2, maxLength: 120 } },
          },
        ],
      },
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TaskStatus: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
      TaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200 },
          description: { type: ['string', 'null'], maxLength: 5000 },
          status: { $ref: '#/components/schemas/TaskStatus' },
          dueDate: { type: ['string', 'null'], format: 'date-time' },
        },
      },
      Task: {
        allOf: [
          { $ref: '#/components/schemas/TaskInput' },
          {
            type: 'object',
            required: ['id', 'title', 'description', 'status', 'dueDate', 'userId', 'createdAt', 'updatedAt'],
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: {},
            },
          },
        },
      },
    },
  },
} as const;
