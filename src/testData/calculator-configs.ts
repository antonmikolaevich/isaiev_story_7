/**
 * Test data configuration for GCP Pricing Calculator tests
 * Contains predefined configurations, machine types, regions, and test scenarios
 */

export interface ComputeEngineConfig {
  machineType?: string;
  instances?: number;
  operatingSystem?: string;
  diskSize?: number;
  region?: string;
}

export interface CostExpectation {
  minCost?: number;
  maxCost?: number;
  expectedCost?: string;
}

export interface TestConfiguration {
  name: string;
  config: ComputeEngineConfig;
  expectedCost?: CostExpectation;
}

/**
 * Machine types available in GCP
 */
export const MACHINE_TYPES = {
  N1_STANDARD_1: 'n1-standard-1',
  N1_STANDARD_2: 'n1-standard-2',
  N1_STANDARD_4: 'n1-standard-4',
  E2_MEDIUM: 'e2-medium',
  E2_SMALL: 'e2-small',
  N2_STANDARD_2: 'n2-standard-2',
} as const;

/**
 * Operating systems available for Compute Engine
 */
export const OPERATING_SYSTEMS = {
  FREE: 'Free: Debian, CentOS, CoreOS, Ubuntu or BYOL',
  UBUNTU_PRO: 'Ubuntu Pro',
  WINDOWS_SERVER: 'Windows Server',
  RHEL: 'Red Hat Enterprise Linux',
  SUSE: 'SUSE Linux Enterprise Server',
} as const;

/**
 * GCP regions
 */
export const REGIONS = {
  US_CENTRAL1: 'Iowa (us-central1)',
  US_EAST1: 'South Carolina (us-east1)',
  EUROPE_WEST3: 'Frankfurt (europe-west3)',
  ASIA_NORTHEAST1: 'Tokyo (asia-northeast1)',
  AUSTRALIA_SOUTHEAST1: 'Sydney (australia-southeast1)',
} as const;

/**
 * Predefined test configurations
 */
export const TEST_CONFIGS: Record<string, TestConfiguration> = {
  BASIC_CONFIG: {
    name: 'Basic n1-standard-1 configuration',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 2,
      operatingSystem: OPERATING_SYSTEMS.UBUNTU_PRO,
      diskSize: 100,
      region: REGIONS.EUROPE_WEST3,
    },
    expectedCost: {
      minCost: 150,
      maxCost: 300,
    },
  },

  UPGRADED_CONFIG: {
    name: 'Upgraded n1-standard-2 configuration',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_2,
      instances: 2,
      operatingSystem: OPERATING_SYSTEMS.UBUNTU_PRO,
      diskSize: 100,
      region: REGIONS.EUROPE_WEST3,
    },
    expectedCost: {
      minCost: 200,
      maxCost: 500,
    },
  },

  MINIMAL_CONFIG: {
    name: 'Minimal configuration',
    config: {
      machineType: MACHINE_TYPES.E2_SMALL,
      instances: 1,
      operatingSystem: OPERATING_SYSTEMS.FREE,
      diskSize: 10,
      region: REGIONS.US_CENTRAL1,
    },
    expectedCost: {
      minCost: 0,
      maxCost: 50,
    },
  },

  PREMIUM_CONFIG: {
    name: 'Premium Windows configuration',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_4,
      instances: 5,
      operatingSystem: OPERATING_SYSTEMS.WINDOWS_SERVER,
      diskSize: 500,
      region: REGIONS.EUROPE_WEST3,
    },
    expectedCost: {
      minCost: 500,
      maxCost: 2000,
    },
  },

  HIGH_VOLUME_CONFIG: {
    name: 'High volume configuration',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 100,
      operatingSystem: OPERATING_SYSTEMS.FREE,
      diskSize: 100,
      region: REGIONS.US_CENTRAL1,
    },
    expectedCost: {
      minCost: 2000,
      maxCost: 10000,
    },
  },

  TOKYO_REGION_CONFIG: {
    name: 'Tokyo region configuration',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 1,
      operatingSystem: OPERATING_SYSTEMS.FREE,
      diskSize: 100,
      region: REGIONS.ASIA_NORTHEAST1,
    },
    expectedCost: {
      minCost: 20,
      maxCost: 100,
    },
  },

  LARGE_DISK_CONFIG: {
    name: 'Large disk configuration',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 1,
      operatingSystem: OPERATING_SYSTEMS.FREE,
      diskSize: 1000,
      region: REGIONS.US_CENTRAL1,
    },
    expectedCost: {
      minCost: 50,
      maxCost: 200,
    },
  },
};

/**
 * Invalid configurations for negative testing
 */
export const INVALID_CONFIGS = {
  ZERO_INSTANCES: {
    name: 'Zero instances',
    config: {
      instances: 0,
    },
  },

  NEGATIVE_INSTANCES: {
    name: 'Negative instances',
    config: {
      instances: -5,
    },
  },

  NEGATIVE_DISK_SIZE: {
    name: 'Negative disk size',
    config: {
      diskSize: -100,
    },
  },

  EXTREMELY_LARGE_INSTANCES: {
    name: 'Extremely large instance count',
    config: {
      instances: 999999,
    },
  },
};

/**
 * Test scenarios for comparison tests
 */
export const COMPARISON_SCENARIOS = {
  MACHINE_TYPE_COMPARISON: {
    name: 'Compare machine types',
    baseConfig: TEST_CONFIGS.BASIC_CONFIG.config,
    comparisonConfigs: [
      {
        ...TEST_CONFIGS.BASIC_CONFIG.config,
        machineType: MACHINE_TYPES.N1_STANDARD_2,
      },
      {
        ...TEST_CONFIGS.BASIC_CONFIG.config,
        machineType: MACHINE_TYPES.N1_STANDARD_4,
      },
    ],
  },

  REGION_COMPARISON: {
    name: 'Compare regions',
    baseConfig: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 1,
      operatingSystem: OPERATING_SYSTEMS.FREE,
      diskSize: 100,
      region: REGIONS.US_CENTRAL1,
    },
    comparisonConfigs: [
      {
        machineType: MACHINE_TYPES.N1_STANDARD_1,
        instances: 1,
        operatingSystem: OPERATING_SYSTEMS.FREE,
        diskSize: 100,
        region: REGIONS.EUROPE_WEST3,
      },
      {
        machineType: MACHINE_TYPES.N1_STANDARD_1,
        instances: 1,
        operatingSystem: OPERATING_SYSTEMS.FREE,
        diskSize: 100,
        region: REGIONS.ASIA_NORTHEAST1,
      },
    ],
  },

  OS_COMPARISON: {
    name: 'Compare operating systems',
    baseConfig: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 1,
      operatingSystem: OPERATING_SYSTEMS.FREE,
      diskSize: 100,
      region: REGIONS.US_CENTRAL1,
    },
    comparisonConfigs: [
      {
        machineType: MACHINE_TYPES.N1_STANDARD_1,
        instances: 1,
        operatingSystem: OPERATING_SYSTEMS.UBUNTU_PRO,
        diskSize: 100,
        region: REGIONS.US_CENTRAL1,
      },
      {
        machineType: MACHINE_TYPES.N1_STANDARD_1,
        instances: 1,
        operatingSystem: OPERATING_SYSTEMS.WINDOWS_SERVER,
        diskSize: 100,
        region: REGIONS.US_CENTRAL1,
      },
    ],
  },

  DISK_SIZE_COMPARISON: {
    name: 'Compare disk sizes',
    baseConfig: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 1,
      operatingSystem: OPERATING_SYSTEMS.FREE,
      diskSize: 100,
      region: REGIONS.US_CENTRAL1,
    },
    comparisonConfigs: [
      {
        machineType: MACHINE_TYPES.N1_STANDARD_1,
        instances: 1,
        operatingSystem: OPERATING_SYSTEMS.FREE,
        diskSize: 500,
        region: REGIONS.US_CENTRAL1,
      },
      {
        machineType: MACHINE_TYPES.N1_STANDARD_1,
        instances: 1,
        operatingSystem: OPERATING_SYSTEMS.FREE,
        diskSize: 1000,
        region: REGIONS.US_CENTRAL1,
      },
    ],
  },
};

/**
 * Edge case test data
 */
export const EDGE_CASES = {
  MINIMUM_VIABLE: {
    name: 'Minimum viable configuration',
    config: {
      machineType: MACHINE_TYPES.E2_SMALL,
      instances: 1,
      diskSize: 10,
    },
  },

  MAXIMUM_INSTANCES: {
    name: 'Maximum instance count',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 1000,
      diskSize: 100,
    },
  },

  MAXIMUM_DISK: {
    name: 'Maximum disk size',
    config: {
      machineType: MACHINE_TYPES.N1_STANDARD_1,
      instances: 1,
      diskSize: 10000,
    },
  },
};
