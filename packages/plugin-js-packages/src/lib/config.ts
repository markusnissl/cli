import { z } from 'zod';
import { IssueSeverity, issueSeveritySchema } from '@code-pushup/models';

const packageCommandSchema = z.enum(['audit', 'outdated']);
export type PackageCommand = z.infer<typeof packageCommandSchema>;

const packageManagerSchema = z.enum([
  'npm',
  'yarn-classic',
  'yarn-modern',
  'pnpm',
]);
export type PackageManager = z.infer<typeof packageManagerSchema>;

const packageAuditLevelSchema = z.enum([
  'info',
  'low',
  'moderate',
  'high',
  'critical',
]);
export type PackageAuditLevel = z.infer<typeof packageAuditLevelSchema>;

const defaultAuditLevelMapping: Record<PackageAuditLevel, IssueSeverity> = {
  critical: 'error',
  high: 'error',
  moderate: 'warning',
  low: 'warning',
  info: 'info',
};

export function fillAuditLevelMapping(
  mapping: Partial<Record<PackageAuditLevel, IssueSeverity>>,
): Record<PackageAuditLevel, IssueSeverity> {
  return {
    critical: mapping.critical ?? defaultAuditLevelMapping.critical,
    high: mapping.high ?? defaultAuditLevelMapping.high,
    moderate: mapping.moderate ?? defaultAuditLevelMapping.moderate,
    low: mapping.low ?? defaultAuditLevelMapping.low,
    info: mapping.info ?? defaultAuditLevelMapping.info,
  };
}

export const jsPackagesPluginConfigSchema = z.object({
  checks: z
    .array(packageCommandSchema, {
      description:
        'Package manager commands to be run. Defaults to both audit and outdated.',
    })
    .min(1)
    .default(['audit', 'outdated']),
  packageManager: packageManagerSchema.describe('Package manager to be used.'),
  auditLevelMapping: z
    .record(packageAuditLevelSchema, issueSeveritySchema, {
      description:
        'Mapping of audit levels to issue severity. Custom mapping or overrides may be entered manually, otherwise has a default preset.',
    })
    .default(defaultAuditLevelMapping)
    .transform(fillAuditLevelMapping),
});

export type JSPackagesPluginConfig = z.input<
  typeof jsPackagesPluginConfigSchema
>;

export type FinalJSPackagesPluginConfig = z.infer<
  typeof jsPackagesPluginConfigSchema
>;

export type PackageDependencyType = 'prod' | 'dev' | 'optional';
