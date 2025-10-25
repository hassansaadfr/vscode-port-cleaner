# Publishing Guide

This document explains how to publish the Port Cleaner extension to the VS Code Marketplace using GitHub Actions.

## Prerequisites

### 1. Azure DevOps Personal Access Token (PAT)

1. Go to https://dev.azure.com
2. Sign in with your Microsoft account
3. Click on your profile icon → **User settings** → **Personal access tokens**
4. Click **+ New Token**
5. Configure the token:
   - **Name**: `vscode-marketplace-publishing`
   - **Organization**: Select **All accessible organizations**
   - **Expiration**: Set appropriate expiration (e.g., 1 year)
   - **Scopes**: Select **Custom defined**, then check:
     - **Marketplace** → **Manage** ✅
6. Click **Create** and **copy the token immediately** (you won't see it again!)

### 2. Publisher Account

1. Go to https://marketplace.visualstudio.com/manage
2. Sign in with the same Microsoft account
3. Create a publisher:
   - **Publisher ID**: `hassansaadfr` (already configured in package.json)
   - **Display Name**: Your preferred display name
   - **Description**: Optional description

### 3. GitHub Secret Configuration

1. Go to your GitHub repository: https://github.com/hassansaadfr/vscode-port-cleaner
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `VSCE_TOKEN`
   - **Value**: Paste your Azure DevOps PAT from step 1
5. Click **Add secret**

## Publishing Process

### Automatic Publishing (Recommended)

The extension is automatically published when you create a new version tag:

```bash
# Update version in package.json (1.0.0 → 1.1.0)
npm version patch   # For bug fixes (1.0.0 → 1.0.1)
# or
npm version minor   # For new features (1.0.0 → 1.1.0)
# or
npm version major   # For breaking changes (1.0.0 → 2.0.0)

# Push the tag to GitHub
git push && git push --tags
```

This will automatically:
1. ✅ Compile TypeScript
2. ✅ Package the extension (.vsix)
3. ✅ Publish to VS Code Marketplace
4. ✅ Create a GitHub Release with the .vsix file attached

### Manual Publishing

If you prefer to publish manually:

```bash
# Install vsce globally
npm install -g @vscode/vsce

# Login with your publisher ID
vsce login hassansaadfr
# Enter your Azure DevOps PAT when prompted

# Package and publish
vsce publish
```

## Updating the Extension

### Before Publishing a New Version

1. **Update CHANGELOG.md** with new features/fixes
2. **Test the extension locally** by pressing F5 in VS Code
3. **Update version** in package.json (or use `npm version`)
4. **Commit changes**:
   ```bash
   git add .
   git commit -m "Release v1.1.0: Add new features"
   git push
   ```
5. **Create and push tag**:
   ```bash
   git tag v1.1.0
   git push --tags
   ```

### Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

## Monitoring

After publishing:
- Monitor the GitHub Actions workflow: https://github.com/hassansaadfr/vscode-port-cleaner/actions
- Check the marketplace: https://marketplace.visualstudio.com/items?itemName=hassansaadfr.port-cleaner
- View installation stats in the marketplace dashboard

## Troubleshooting

### PAT Authentication Failed
- Verify the PAT has **Marketplace → Manage** scope
- Ensure the PAT hasn't expired
- Check the PAT is added as `VSCE_TOKEN` in GitHub Secrets

### Publisher Not Found
- Verify `publisher` field in package.json matches your publisher ID
- Ensure you've created the publisher at https://marketplace.visualstudio.com/manage

### Build Failures
- Check TypeScript compilation: `npm run compile`
- Verify all dependencies: `npm install`
- Test locally: `vsce package` to create a local .vsix file

## Resources

- [VS Code Publishing Documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce CLI Reference](https://github.com/microsoft/vscode-vsce)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
