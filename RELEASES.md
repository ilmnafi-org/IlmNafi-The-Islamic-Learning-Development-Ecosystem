# Releases and Deployment Management Guide

This document outlines the professional deployment releases, versioning pipelines, and automated branching strategies built for the **Ilm Nafi Portal** running on Google Cloud Run.

---

## 1. Branching Strategy

We enforce a modern, high-availability version control flow based on GitFlow/Github Flow:

```
[feature/xxx] --------> [master/main] (Automated PR checks)
                           │
                           ├──> CI/CD Compilation Validations
                           │
                           ├──> Release Version Tagging (vX.Y.Z)
                           │
                           └──> Production Cloud Run Instance
```

- **Feature Branches (`feature/*`)**: All edits are done on isolated feature branches. Edits must be merged via Pull Requests.
- **Main/Master Branch (`master` / `main`)**: Contains code representing the state of the production environment. Every push to this branch triggers the deploy sequence.

---

## 2. Dynamic Automations (Semantic Releases)

To manage stable production deployments, we follow **Semantic Versioning (SemVer)**:
- **Major (X.0.0)**: Backward incompatible API changes, schema migrations, or major suite updates.
- **Minor (0.Y.0)**: Backward compatible additions, new courses, or enhanced reciters.
- **Patch (0.0.Z)**: Backward compatible bug fixes, typo fixes, or audio stability improvements.

### Creating a Semantic Release Tag manually

To cut a official release version tag, execute the following commands in the workstation environment:

```bash
# 1. Pull latest verified production branch
git checkout main
git pull origin main

# 2. Tag current release version commit
git tag -a v1.2.0 -m "Release v1.2.0: Core Recitation Overlaps Resolution, Self-Healing Session Engine"

# 3. Synchronize tags upstream to Github
git push origin v1.2.0
```

---

## 3. Automated Release Rollback Checklist

Our serverless Google Cloud Run architecture supports instant zero-downtime traffic shifts and rapid rollbacks if any regression happens post-deployment:

1. Navigate to the Google Cloud Console.
2. Go to **Cloud Run** and select the service `ilm-nafi-service`.
3. Open the **Revisions** tab.
4. Locate the previous stable container revision (e.g., `ilm-nafi-service-00042`).
5. Select **Manage Traffic**.
6. Rollback instantly by routing **100% of incoming requests** to the stable revision, then click **Commit**.
7. The shift happens in `<100ms` with zero downtime or broken connection sockets.
