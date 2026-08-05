// Environment configuration for multi-environment testing

export type Environment = {
  name: string;
  baseURL: string;
  description: string;
};


// All available environments
export const environments: Environment[] = [
  // Local Development Environment
  {
    name: 'QA',
    baseURL: 'https://www.saucedemo.com/',
    description: 'QA Development Environment',
  },
];

// Helper functions
export const getEnvironmentByName = (name: string): Environment | undefined => {
  return environments.find((env) => env.name === name);
};

export const getEnvironmentNames = (): string[] => {
  return environments.map((env) => env.name);
};

// Default environment
export const DEFAULT_ENVIRONMENT = 'qa';

// Get current environment from environment variable or default
export const getCurrentEnvironment = (): Environment => {
  const TEST_ENVIRONMENT = process.env.TEST_ENV || DEFAULT_ENVIRONMENT;

  const environment = getEnvironmentByName(TEST_ENVIRONMENT);

  if (!environment) {
    throw new Error(
      `Invalid environment: ${TEST_ENVIRONMENT}. Available environments: ${getEnvironmentNames().join(', ')}`,
    );
  }

  if (!environment.baseURL?.trim()) {
    throw new Error(`Environment '${environment.name}' has no baseURL configured.`);
  }

  return environment;
};
