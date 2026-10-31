# Infrastructure as Code

This directory is the starting point for managing real cloud resources with Terraform. It contains no Terraform configuration, provider, backend, credentials, or resources yet. Add them when a product needs its first resource; do not apply an empty placeholder configuration.

## Structure

```text
infra/
├── environments/
│   ├── staging/       # Staging root configuration, when needed
│   └── production/    # Production root configuration, when needed
└── .gitignore
```

Keep each environment's Terraform root and state separate. Add shared modules only after a real configuration needs reuse. Do not put business logic here.

## Ownership

- Use Terraform for the actual cloud resources selected by the product, such as a Cloudflare Queue or Upstash Redis database. Choose and pin Terraform and provider versions when adding the first resource; commit the generated `.terraform.lock.hcl` files.
- Use each Worker's `wrangler.jsonc` as the source of truth for Worker runtime configuration and bindings, and Wrangler plus its worker-specific workflow for deployment. Define resource and binding ownership before implementation: do not let Terraform and Wrangler manage the same setting or consumer relationship. Follow the [Worker guide](../apps/workers/README.md).
- Keep web deployments on Vercel Git integration; follow the [deployment guide](../docs/deployment.md). Manage Vercel settings through Terraform only if a product explicitly adopts that ownership.

## State and secrets

Before provisioning shared resources, configure a remote backend that supports state locking, encryption, access control, and recovery. Use distinct state locations and environment-appropriate credentials for staging and production. Choose and document the backend and its bootstrap process for the real project; it is not configured by this starter.

Terraform state and saved plans may contain secrets even when values are marked sensitive. Never commit state, plans, `.terraform/`, secret variable files, or credentials. Supply secrets through the chosen provider's supported environment or secret manager; avoid putting backend credentials in configuration or command arguments. Restrict access to state and plans, and handle local recovery files securely if a remote state write fails. The `.gitignore` rules are a precaution, not a secret store.

## Workflow for a real change

1. Identify the target environment, account, resources, owners, and rollback or recovery strategy. Confirm that Terraform owns the settings being changed.
2. Add the real configuration and tests appropriate to the resources. Pin Terraform and provider versions, configure the protected remote backend, and initialize from that environment's directory. Review provider and lockfile changes.
3. Run `terraform fmt -check -recursive`, `terraform init` and `terraform validate`; run them only after the environment contains a real configuration. Verify the selected workspace, account, backend, and environment before planning.
4. Run `terraform plan` for that environment and review every addition, change, and deletion, including costs and data impact. Treat any saved plan as sensitive. If the configuration or target changes, generate and review a new plan.
5. Apply only the reviewed plan to the explicitly selected environment. Do not automatically apply production; follow the project's production change and approval process. Verify the resulting resources and deployment, then securely remove any local plan file.

Never run `terraform apply`, `destroy`, or state manipulation as part of routine tests. Use separate non-production resources for integration testing. Add CI validation or a deployment workflow only when a real Terraform configuration exists, and never place secrets in CI logs or artifacts.

## References

- [Terraform state storage and locking](https://developer.hashicorp.com/terraform/language/state/backends)
- [Terraform sensitive data](https://developer.hashicorp.com/terraform/language/manage-sensitive-data)
- [Cloudflare Workers infrastructure as code](https://developers.cloudflare.com/workers/platform/infrastructure-as-code/)
- [Upstash Terraform provider](https://upstash.com/docs/devops/terraform/overview)
