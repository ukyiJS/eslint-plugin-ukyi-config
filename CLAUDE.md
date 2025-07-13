# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint plugin that provides pre-configured ESLint rules for JavaScript, TypeScript, React, and code formatting. The plugin is published as `@ukyijs/eslint-plugin-ukyi-config` on GitHub Packages.

## Essential Commands

### Development
```bash
# Start development mode with file watching
pnpm dev

# Build the plugin
pnpm build

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

### Release Process
```bash
# Automatic release (triggered by semantic commit messages)
pnpm semantic-release
```

The project uses semantic-release for automated versioning and publishing. Commits to the main branch with conventional commit messages will automatically:
- Determine version based on commit messages (fix: patch, feat: minor, BREAKING CHANGE: major)
- Update CHANGELOG.md
- Create git tags
- Publish to npm
- Create GitHub releases

## Architecture

### Core Structure
- **Entry Point**: `src/index.ts` - Exports the plugin with all available configs
- **Type Definitions**: `src/types.ts` - TypeScript interfaces for the plugin structure
- **Configurations**: `src/configs/` - Individual ESLint configurations
  - `format.ts` - Code formatting rules (indentation, quotes, line breaks)
  - `javascript.ts` - JavaScript quality rules (import sorting, ES6+ features)
  - `typescript.ts` - TypeScript-specific rules (type imports, any usage)
  - `react.ts` - React/JSX rules (component style, hooks, JSX formatting)

### Build System
- **Vite**: Used for building the plugin with dual ESM/CJS output
- **TypeScript**: Compiled with declaration files generation
- **Output**: `dist/` directory with index.js (ESM), index.cjs (CommonJS), and index.d.ts (types)

### Testing
- **Vitest**: Test runner with support for globals
- **Test Files**: Located in `src/__tests__/` directory
- Each config has its own test file plus integration tests

### Configuration Hierarchy
The plugin provides individual configs that can be used separately or combined:
- `format` - Base formatting rules
- `javascript` - JavaScript-specific rules
- `typescript` - TypeScript-specific rules  
- `react` - React/JSX rules
- `recommended` - Pre-combined config (format + javascript + typescript)

### Publishing
- Published to GitHub Packages registry (`npm.pkg.github.com`)
- Package name: `@ukyijs/eslint-plugin-ukyi-config`
- Requires authentication for publishing

## Key Implementation Details

1. **ESLint v9 Flat Config**: This plugin uses the new flat config format for ESLint v9+
2. **Peer Dependencies**: All ESLint plugins are peer dependencies to avoid version conflicts
3. **Modular Configs**: Each config is independent and can be mixed as needed
4. **Korean Documentation**: README is in Korean as this is a personal project for Korean development
5. **No Linting Setup**: The project itself doesn't have ESLint configured for its own code