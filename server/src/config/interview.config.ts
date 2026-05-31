export interface ScenarioRule {
  scope: string;
  avoid?: string[];
  focus?: string[];
}

export interface ScenarioDefinition {
  title: string;
  description: string;
  rules: ScenarioRule;
  isLocked: boolean;
}

export const MAX_INTERVIEW_QUESTIONS = 10;

export const SCENARIO_DEFINITIONS: ScenarioDefinition[] = [
  {
    title: 'Autenticação',
    description: 'Autenticação stateless para APIs REST usando JWT.',
    rules: {
      scope: 'API REST tradicional, login de usuários, JWT stateless, sem sessions no servidor.',
      avoid: ['microsserviços', 'service-to-service', 'OAuth', 'OIDC'],
    },
    isLocked: false,
  },
  {
    title: 'Problema N+1',
    description: 'Diagnóstico e correção de queries repetitivas em ORMs.',
    rules: {
      scope: 'API REST com ORM listando entidades relacionadas.',
      focus: ['diagnóstico', 'queries geradas', 'eager loading seletivo', 'batching', 'paginação'],
    },
    isLocked: false,
  },
  {
    title: 'Deploy sem Downtime',
    description: 'Deploy seguro com banco relacional e tráfego ativo.',
    rules: {
      scope: 'Aplicação web com banco relacional em produção.',
      focus: ['compatibilidade de schema', 'rollout', 'rollback', 'migrações seguras'],
    },
    isLocked: false,
  },
];
