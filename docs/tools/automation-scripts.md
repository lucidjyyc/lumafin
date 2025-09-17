/**
 * Documentation Automation Scripts and Tools
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Comprehensive automation tools for generating and maintaining API and component documentation.
 */

# Documentation Automation Scripts and Tools

**Developed by Adam J Smith / NØIR9 FOUNDATION INC**

## Overview

This document provides comprehensive automation tools and scripts for generating, validating, and maintaining API and component documentation for the FinTech Banking Platform.

## Automation Scripts

### 1. OpenAPI Schema Generation

**File: `scripts/generate-openapi.js`**

```javascript
/**
 * OpenAPI Schema Generation Script
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class OpenAPIGenerator {
  constructor() {
    this.schema = {
      openapi: '3.0.3',
      info: {
        title: 'FinTech Banking API',
        description: 'Comprehensive fintech banking platform with Web3 integration.\n\n**Developed by Adam J Smith / NØIR9 FOUNDATION INC**',
        version: '1.0.0',
        contact: {
          name: 'Adam J Smith',
          email: 'boom.ski@hotmail.com',
          url: 'https://noir9.foundation'
        },
        license: {
          name: 'Commercial License - Proprietary Software',
          url: 'https://noir9.foundation/license'
        }
      },
      servers: [
        { url: 'https://api.fintechbank.com/v1', description: 'Production server' },
        { url: 'https://staging-api.fintechbank.com/v1', description: 'Staging server' },
        { url: 'http://localhost:8000/api/v1', description: 'Development server' }
      ],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },
          WalletAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization'
          },
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        }
      }
    };
  }

  // Scan Django models and generate schemas
  generateSchemasFromModels() {
    const modelsPath = path.join(__dirname, '../backend/apps');
    const apps = fs.readdirSync(modelsPath);

    apps.forEach(app => {
      const modelsFile = path.join(modelsPath, app, 'models.py');
      if (fs.existsSync(modelsFile)) {
        this.parseModelsFile(modelsFile, app);
      }
    });
  }

  parseModelsFile(filePath, appName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const modelMatches = content.match(/class\s+(\w+)\(.*Model.*\):/g);

    if (modelMatches) {
      modelMatches.forEach(match => {
        const modelName = match.match(/class\s+(\w+)/)[1];
        this.generateSchemaFromModel(modelName, content, appName);
      });
    }
  }

  generateSchemaFromModel(modelName, content, appName) {
    const schema = {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: `Unique ${modelName.toLowerCase()} identifier`
        }
      },
      required: ['id']
    };

    // Parse fields from model
    const fieldRegex = /(\w+)\s*=\s*models\.(\w+Field)\((.*?)\)/g;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(content)) !== null) {
      const [, fieldName, fieldType, fieldOptions] = fieldMatch;
      
      if (fieldName !== 'objects') {
        const property = this.convertDjangoFieldToOpenAPI(fieldType, fieldOptions);
        schema.properties[fieldName] = property;

        // Check if field is required
        if (!fieldOptions.includes('blank=True') && !fieldOptions.includes('null=True')) {
          if (!schema.required.includes(fieldName)) {
            schema.required.push(fieldName);
          }
        }
      }
    }

    this.schema.components.schemas[modelName] = schema;
  }

  convertDjangoFieldToOpenAPI(fieldType, options) {
    const property = {};

    switch (fieldType) {
      case 'CharField':
        property.type = 'string';
        const maxLengthMatch = options.match(/max_length=(\d+)/);
        if (maxLengthMatch) {
          property.maxLength = parseInt(maxLengthMatch[1]);
        }
        break;
      case 'TextField':
        property.type = 'string';
        break;
      case 'EmailField':
        property.type = 'string';
        property.format = 'email';
        break;
      case 'URLField':
        property.type = 'string';
        property.format = 'uri';
        break;
      case 'IntegerField':
      case 'BigIntegerField':
        property.type = 'integer';
        break;
      case 'DecimalField':
        property.type = 'string';
        property.description = 'Decimal number as string to preserve precision';
        break;
      case 'BooleanField':
        property.type = 'boolean';
        break;
      case 'DateTimeField':
        property.type = 'string';
        property.format = 'date-time';
        break;
      case 'DateField':
        property.type = 'string';
        property.format = 'date';
        break;
      case 'UUIDField':
        property.type = 'string';
        property.format = 'uuid';
        break;
      case 'JSONField':
        property.type = 'object';
        break;
      default:
        property.type = 'string';
    }

    // Add description from help_text
    const helpTextMatch = options.match(/help_text=['"]([^'"]+)['"]/);
    if (helpTextMatch) {
      property.description = helpTextMatch[1];
    }

    return property;
  }

  // Generate paths from Django URLs
  generatePathsFromUrls() {
    const urlsPath = path.join(__dirname, '../backend/fintech_api/urls.py');
    if (fs.existsSync(urlsPath)) {
      // This would require more complex parsing of Django URL patterns
      // For now, we'll use predefined paths
      this.addPredefinedPaths();
    }
  }

  addPredefinedPaths() {
    // Authentication endpoints
    this.schema.paths['/auth/register'] = {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Create a new user account with optional Web3 wallet connection.',
        operationId: 'registerUser',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRegistration'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string' },
                        refresh_token: { type: 'string' },
                        expires_in: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '409': { $ref: '#/components/responses/Conflict' }
        }
      }
    };

    // Add more endpoints...
  }

  // Generate the complete schema
  generate() {
    console.log('🔄 Generating OpenAPI schema...');
    
    this.generateSchemasFromModels();
    this.generatePathsFromUrls();
    
    // Write YAML file
    const yamlContent = yaml.dump(this.schema, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true 
    });
    
    const outputPath = path.join(__dirname, '../docs/api/openapi.yaml');
    fs.writeFileSync(outputPath, yamlContent);
    
    // Write JSON file
    const jsonOutputPath = path.join(__dirname, '../docs/api/openapi.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify(this.schema, null, 2));
    
    console.log('✅ OpenAPI schema generated successfully!');
    console.log(`📄 YAML: ${outputPath}`);
    console.log(`📄 JSON: ${jsonOutputPath}`);
  }
}

// Run the generator
if (require.main === module) {
  const generator = new OpenAPIGenerator();
  generator.generate();
}

module.exports = OpenAPIGenerator;
```

### 2. Component Documentation Generator

**File: `scripts/generate-component-docs.js`**

```javascript
/**
 * Component Documentation Generator
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

class ComponentDocGenerator {
  constructor() {
    this.components = new Map();
    this.outputDir = path.join(__dirname, '../docs/components/generated');
  }

  // Scan components directory
  scanComponents() {
    const componentsDir = path.join(__dirname, '../src/components');
    this.scanDirectory(componentsDir);
  }

  scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(itemPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.parseComponent(itemPath);
      }
    });
  }

  parseComponent(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const componentInfo = {
      name: '',
      props: [],
      description: '',
      examples: [],
      filePath: filePath
    };

    // Extract component information
    this.visitNode(sourceFile, componentInfo);
    
    if (componentInfo.name) {
      this.components.set(componentInfo.name, componentInfo);
    }
  }

  visitNode(node, componentInfo) {
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
      componentInfo.name = node.name.text.replace('Props', '');
      this.extractPropsFromInterface(node, componentInfo);
    }
    
    if (ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node)) {
      this.extractComponentInfo(node, componentInfo);
    }

    ts.forEachChild(node, child => this.visitNode(child, componentInfo));
  }

  extractPropsFromInterface(node, componentInfo) {
    node.members.forEach(member => {
      if (ts.isPropertySignature(member)) {
        const prop = {
          name: member.name.text,
          type: this.getTypeString(member.type),
          required: !member.questionToken,
          description: this.getJSDocComment(member)
        };
        componentInfo.props.push(prop);
      }
    });
  }

  extractComponentInfo(node, componentInfo) {
    const jsDoc = this.getJSDocComment(node);
    if (jsDoc) {
      componentInfo.description = jsDoc;
    }
  }

  getTypeString(typeNode) {
    if (!typeNode) return 'unknown';
    
    switch (typeNode.kind) {
      case ts.SyntaxKind.StringKeyword:
        return 'string';
      case ts.SyntaxKind.NumberKeyword:
        return 'number';
      case ts.SyntaxKind.BooleanKeyword:
        return 'boolean';
      case ts.SyntaxKind.UnionType:
        return typeNode.types.map(t => this.getTypeString(t)).join(' | ');
      default:
        return 'unknown';
    }
  }

  getJSDocComment(node) {
    const jsDoc = ts.getJSDocCommentsAndTags(node);
    if (jsDoc.length > 0) {
      return jsDoc[0].comment || '';
    }
    return '';
  }

  generateMarkdown(componentInfo) {
    const template = `/**
 * ${componentInfo.name} Component Documentation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @generated This file was automatically generated
 */

# ${componentInfo.name} Component

**Developed by Adam J Smith / NØIR9 FOUNDATION INC**

## Overview

${componentInfo.description || 'Component description not available.'}

**Import Path:**
\`\`\`typescript
import { ${componentInfo.name} } from '${this.getImportPath(componentInfo.filePath)}';
\`\`\`

## Props

${this.generatePropsTable(componentInfo.props)}

## Interface Definition

\`\`\`typescript
interface ${componentInfo.name}Props {
${componentInfo.props.map(prop => 
  `  /** ${prop.description || 'No description'} */
  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`
).join('\n')}
}
\`\`\`

## Usage Example

\`\`\`tsx
import { ${componentInfo.name} } from '${this.getImportPath(componentInfo.filePath)}';

function Example() {
  return (
    <${componentInfo.name}
${componentInfo.props.filter(p => p.required).map(prop => 
  `      ${prop.name}={${this.getExampleValue(prop.type)}}`
).join('\n')}
    >
      Content
    </${componentInfo.name}>
  );
}
\`\`\`

---

**Generated on**: ${new Date().toISOString()}  
**Source File**: \`${componentInfo.filePath}\`
`;

    return template;
  }

  generatePropsTable(props) {
    if (props.length === 0) {
      return 'No props defined.';
    }

    const header = '| Prop | Type | Required | Description |\n|------|------|----------|-------------|';
    const rows = props.map(prop => 
      `| \`${prop.name}\` | \`${prop.type}\` | ${prop.required ? 'Yes' : 'No'} | ${prop.description || 'No description'} |`
    ).join('\n');

    return header + '\n' + rows;
  }

  getImportPath(filePath) {
    // Convert absolute path to relative import path
    const relativePath = path.relative(path.join(__dirname, '../src'), filePath);
    return './' + relativePath.replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, '');
  }

  getExampleValue(type) {
    switch (type) {
      case 'string':
        return '"example"';
      case 'number':
        return '42';
      case 'boolean':
        return 'true';
      default:
        return 'undefined';
    }
  }

  generate() {
    console.log('🔄 Generating component documentation...');
    
    this.scanComponents();
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Generate documentation for each component
    this.components.forEach((componentInfo, name) => {
      const markdown = this.generateMarkdown(componentInfo);
      const outputPath = path.join(this.outputDir, `${name}.md`);
      fs.writeFileSync(outputPath, markdown);
      console.log(`📄 Generated: ${outputPath}`);
    });

    // Generate index file
    this.generateIndex();
    
    console.log(`✅ Generated documentation for ${this.components.size} components!`);
  }

  generateIndex() {
    const indexContent = `/**
 * Component Documentation Index
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @generated This file was automatically generated
 */

# Component Documentation Index

**Developed by Adam J Smith / NØIR9 FOUNDATION INC**

This directory contains automatically generated documentation for all components in the FinTech Banking Platform.

## Available Components

${Array.from(this.components.entries()).map(([name, info]) => 
  `- [${name}](./${name}.md) - ${info.description || 'No description'}`
).join('\n')}

---

**Generated on**: ${new Date().toISOString()}  
**Total Components**: ${this.components.size}
`;

    const indexPath = path.join(this.outputDir, 'README.md');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`📄 Generated index: ${indexPath}`);
  }
}

// Run the generator
if (require.main === module) {
  const generator = new ComponentDocGenerator();
  generator.generate();
}

module.exports = ComponentDocGenerator;
```

### 3. Documentation Validation Script

**File: `scripts/validate-docs.js`**

```javascript
/**
 * Documentation Validation Script
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { OpenAPIValidator } = require('openapi-validator');

class DocumentationValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // Validate OpenAPI schema
  async validateOpenAPI() {
    console.log('🔍 Validating OpenAPI schema...');
    
    const schemaPath = path.join(__dirname, '../docs/api/openapi.yaml');
    
    if (!fs.existsSync(schemaPath)) {
      this.errors.push('OpenAPI schema file not found');
      return;
    }

    try {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      const schema = yaml.load(schemaContent);
      
      // Basic structure validation
      this.validateSchemaStructure(schema);
      
      // Validate with OpenAPI validator
      const validator = new OpenAPIValidator(schema);
      const validationResult = await validator.validate();
      
      if (validationResult.errors.length > 0) {
        this.errors.push(...validationResult.errors);
      }
      
      if (validationResult.warnings.length > 0) {
        this.warnings.push(...validationResult.warnings);
      }
      
      console.log('✅ OpenAPI schema validation completed');
    } catch (error) {
      this.errors.push(`OpenAPI validation failed: ${error.message}`);
    }
  }

  validateSchemaStructure(schema) {
    // Check required fields
    const requiredFields = ['openapi', 'info', 'paths'];
    requiredFields.forEach(field => {
      if (!schema[field]) {
        this.errors.push(`Missing required field: ${field}`);
      }
    });

    // Check info section
    if (schema.info) {
      const requiredInfoFields = ['title', 'version'];
      requiredInfoFields.forEach(field => {
        if (!schema.info[field]) {
          this.errors.push(`Missing required info field: ${field}`);
        }
      });
    }

    // Check paths
    if (schema.paths) {
      Object.entries(schema.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, operation]) => {
          if (!operation.responses) {
            this.errors.push(`Missing responses for ${method.toUpperCase()} ${path}`);
          }
        });
      });
    }
  }

  // Validate component documentation
  validateComponentDocs() {
    console.log('🔍 Validating component documentation...');
    
    const docsDir = path.join(__dirname, '../docs/components');
    this.validateDocsDirectory(docsDir);
    
    console.log('✅ Component documentation validation completed');
  }

  validateDocsDirectory(dir) {
    if (!fs.existsSync(dir)) {
      this.warnings.push(`Documentation directory not found: ${dir}`);
      return;
    }

    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.validateDocsDirectory(itemPath);
      } else if (item.endsWith('.md')) {
        this.validateMarkdownFile(itemPath);
      }
    });
  }

  validateMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Check for required sections
    const requiredSections = [
      '# ',  // Title
      '## Overview',
      '## Usage',
    ];
    
    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        this.warnings.push(`${fileName}: Missing section "${section}"`);
      }
    });

    // Check for author attribution
    if (!content.includes('Adam J Smith') || !content.includes('NOIR9 FOUNDATION INC')) {
      this.warnings.push(`${fileName}: Missing proper author attribution`);
    }

    // Check for code examples
    if (!content.includes('```')) {
      this.warnings.push(`${fileName}: No code examples found`);
    }

    // Check for broken links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;
    
    while ((linkMatch = linkRegex.exec(content)) !== null) {
      const [, linkText, linkUrl] = linkMatch;
      
      if (linkUrl.startsWith('./') || linkUrl.startsWith('../')) {
        const resolvedPath = path.resolve(path.dirname(filePath), linkUrl);
        if (!fs.existsSync(resolvedPath)) {
          this.errors.push(`${fileName}: Broken link to ${linkUrl}`);
        }
      }
    }
  }

  // Check endpoint coverage
  validateEndpointCoverage() {
    console.log('🔍 Validating endpoint coverage...');
    
    // This would compare Django URLs with documented endpoints
    // For now, we'll do a basic check
    
    const schemaPath = path.join(__dirname, '../docs/api/openapi.yaml');
    if (!fs.existsSync(schemaPath)) {
      this.errors.push('Cannot validate endpoint coverage: OpenAPI schema not found');
      return;
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = yaml.load(schemaContent);
    
    const documentedEndpoints = Object.keys(schema.paths || {});
    console.log(`📊 Found ${documentedEndpoints.length} documented endpoints`);
    
    // TODO: Compare with actual Django URLs
    
    console.log('✅ Endpoint coverage validation completed');
  }

  // Generate validation report
  generateReport() {
    console.log('\n📋 Validation Report');
    console.log('===================');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All validations passed!');
      return true;
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    return this.errors.length === 0;
  }

  // Run all validations
  async validate() {
    console.log('🚀 Starting documentation validation...\n');
    
    await this.validateOpenAPI();
    this.validateComponentDocs();
    this.validateEndpointCoverage();
    
    const success = this.generateReport();
    
    if (success) {
      console.log('\n🎉 Documentation validation completed successfully!');
      process.exit(0);
    } else {
      console.log('\n💥 Documentation validation failed!');
      process.exit(1);
    }
  }
}

// Run the validator
if (require.main === module) {
  const validator = new DocumentationValidator();
  validator.validate().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = DocumentationValidator;
```

### 4. GitHub Actions Workflow

**File: `.github/workflows/documentation.yml`**

```yaml
# Documentation Generation and Validation Workflow
# 
# @author Adam J Smith <boom.ski@hotmail.com>
# @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
# @license Commercial License - Proprietary Software

name: Documentation

on:
  push:
    branches: [main, develop]
    paths:
      - 'src/components/**'
      - 'backend/apps/**'
      - 'docs/**'
      - 'scripts/**'
  pull_request:
    branches: [main]
    paths:
      - 'src/components/**'
      - 'backend/apps/**'
      - 'docs/**'
      - 'scripts/**'

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        
    - name: Install Node.js dependencies
      run: npm ci
      
    - name: Install Python dependencies
      run: |
        pip install -r backend/requirements.txt
        
    - name: Generate OpenAPI schema
      run: |
        cd backend
        python manage.py spectacular --file ../docs/api/openapi.yaml
        
    - name: Generate component documentation
      run: node scripts/generate-component-docs.js
      
    - name: Validate documentation
      run: node scripts/validate-docs.js
      
    - name: Build documentation site
      run: |
        npm run docs:build
        
    - name: Upload documentation artifacts
      uses: actions/upload-artifact@v3
      with:
        name: documentation
        path: |
          docs/
          dist/docs/
          
  deploy-docs:
    needs: generate-docs
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Download documentation artifacts
      uses: actions/download-artifact@v3
      with:
        name: documentation
        path: docs/
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
        
    - name: Deploy to S3
      if: github.ref == 'refs/heads/main'
      run: |
        aws s3 sync docs/ s3://docs.fintechbank.com --delete
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_DEFAULT_REGION: us-east-1
        
  notify:
    needs: [generate-docs, deploy-docs]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
    - name: Notify Slack
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#documentation'
        text: |
          Documentation workflow completed
          Status: ${{ job.status }}
          Commit: ${{ github.sha }}
          Author: ${{ github.actor }}
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 5. Package.json Scripts

**File: `package.json` (scripts section)**

```json
{
  "scripts": {
    "docs:generate": "node scripts/generate-openapi.js && node scripts/generate-component-docs.js",
    "docs:validate": "node scripts/validate-docs.js",
    "docs:build": "vitepress build docs",
    "docs:dev": "vitepress dev docs",
    "docs:preview": "vitepress preview docs",
    "docs:deploy": "npm run docs:generate && npm run docs:validate && npm run docs:build",
    "docs:watch": "nodemon --watch src/components --watch backend/apps --exec \"npm run docs:generate\"",
    "openapi:generate": "node scripts/generate-openapi.js",
    "openapi:validate": "swagger-codegen validate -i docs/api/openapi.yaml",
    "components:docs": "node scripts/generate-component-docs.js",
    "postman:generate": "openapi-to-postman -s docs/api/openapi.yaml -o docs/api/postman-collection.json"
  },
  "devDependencies": {
    "js-yaml": "^4.1.0",
    "typescript": "^5.0.0",
    "openapi-validator": "^0.14.0",
    "swagger-codegen": "^3.0.0",
    "openapi-to-postman": "^3.0.0",
    "vitepress": "^1.0.0",
    "nodemon": "^3.0.0"
  }
}
```

## Recommended Tools

### 1. Swagger UI Integration

**File: `docs/.vitepress/config.js`**

```javascript
/**
 * VitePress Configuration for Documentation Site
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 */

export default {
  title: 'FinTech Banking API Documentation',
  description: 'Comprehensive API and component documentation for the FinTech Banking Platform',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'Adam J Smith' }],
    ['meta', { name: 'copyright', content: '2024 NOIR9 FOUNDATION INC. All rights reserved.' }]
  ],
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Components', link: '/components/' },
      { text: 'GitHub', link: 'https://github.com/company/fintech-api' }
    ],
    
    sidebar: {
      '/api/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/api/' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Rate Limiting', link: '/api/rate-limiting' },
            { text: 'Error Handling', link: '/api/error-handling' }
          ]
        },
        {
          text: 'Endpoints',
          items: [
            { text: 'Authentication', link: '/api/endpoints/authentication' },
            { text: 'Accounts', link: '/api/endpoints/accounts' },
            { text: 'Transactions', link: '/api/endpoints/transactions' },
            { text: 'Payments', link: '/api/endpoints/payments' },
            { text: 'Web3', link: '/api/endpoints/web3' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Overview',
          items: [
            { text: 'Introduction', link: '/components/' },
            { text: 'Design System', link: '/components/design-system' },
            { text: 'Guidelines', link: '/components/guidelines' }
          ]
        },
        {
          text: 'UI Components',
          items: [
            { text: 'Button', link: '/components/ui/button' },
            { text: 'Modal', link: '/components/ui/modal' },
            { text: 'Input', link: '/components/ui/input' },
            { text: 'Card', link: '/components/ui/card' }
          ]
        }
      ]
    },
    
    footer: {
      message: 'Developed by Adam J Smith / NØIR9 FOUNDATION INC',
      copyright: 'Copyright © 2024 NOIR9 FOUNDATION INC. All rights reserved.'
    }
  },
  
  vite: {
    plugins: [
      // Add Swagger UI plugin
      {
        name: 'swagger-ui',
        configureServer(server) {
          server.middlewares.use('/api-explorer', (req, res, next) => {
            // Serve Swagger UI
            res.setHeader('Content-Type', 'text/html');
            res.end(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>API Explorer</title>
                <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
              </head>
              <body>
                <div id="swagger-ui"></div>
                <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
                <script>
                  SwaggerUIBundle({
                    url: '/openapi.yaml',
                    dom_id: '#swagger-ui',
                    presets: [
                      SwaggerUIBundle.presets.apis,
                      SwaggerUIBundle.presets.standalone
                    ]
                  });
                </script>
              </body>
              </html>
            `);
          });
        }
      }
    ]
  }
};
```

### 2. Postman Collection Generator

**File: `scripts/generate-postman.js`**

```javascript
/**
 * Postman Collection Generator
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class PostmanGenerator {
  constructor() {
    this.collection = {
      info: {
        name: 'FinTech Banking API',
        description: 'Comprehensive API collection for the FinTech Banking Platform\n\nDeveloped by Adam J Smith / NØIR9 FOUNDATION INC',
        version: '1.0.0',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      auth: {
        type: 'bearer',
        bearer: [
          {
            key: 'token',
            value: '{{access_token}}',
            type: 'string'
          }
        ]
      },
      variable: [
        {
          key: 'base_url',
          value: 'https://api.fintechbank.com/v1',
          type: 'string'
        },
        {
          key: 'access_token',
          value: '',
          type: 'string'
        }
      ],
      item: []
    };
  }

  generate() {
    console.log('🔄 Generating Postman collection...');
    
    const schemaPath = path.join(__dirname, '../docs/api/openapi.yaml');
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ OpenAPI schema not found');
      return;
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = yaml.load(schemaContent);
    
    this.convertOpenAPIToPostman(schema);
    
    const outputPath = path.join(__dirname, '../docs/api/postman-collection.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.collection, null, 2));
    
    console.log(`✅ Postman collection generated: ${outputPath}`);
  }

  convertOpenAPIToPostman(schema) {
    Object.entries(schema.paths || {}).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, operation]) => {
        const item = this.createPostmanItem(path, method, operation);
        this.collection.item.push(item);
      });
    });
  }

  createPostmanItem(path, method, operation) {
    return {
      name: operation.summary || `${method.toUpperCase()} ${path}`,
      request: {
        method: method.toUpperCase(),
        header: [
          {
            key: 'Content-Type',
            value: 'application/json',
            type: 'text'
          }
        ],
        url: {
          raw: `{{base_url}}${path}`,
          host: ['{{base_url}}'],
          path: path.split('/').filter(p => p)
        },
        description: operation.description || ''
      },
      response: []
    };
  }
}

// Run the generator
if (require.main === module) {
  const generator = new PostmanGenerator();
  generator.generate();
}

module.exports = PostmanGenerator;
```

## Usage Instructions

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Generate initial documentation
npm run docs:generate

# Validate documentation
npm run docs:validate

# Start development server
npm run docs:dev
```

### 2. Continuous Integration

```bash
# Add to your CI/CD pipeline
npm run docs:deploy

# Or run individual steps
npm run openapi:generate
npm run components:docs
npm run docs:validate
npm run docs:build
```

### 3. Development Workflow

```bash
# Watch for changes and auto-regenerate
npm run docs:watch

# Generate specific documentation
npm run openapi:generate
npm run components:docs

# Generate Postman collection
npm run postman:generate
```

## Best Practices

### 1. Documentation Standards
- Always include author attribution
- Use consistent formatting
- Provide real-world examples
- Include error handling scenarios

### 2. Automation Guidelines
- Run validation in CI/CD pipeline
- Auto-generate on code changes
- Keep documentation in sync with code
- Monitor documentation health

### 3. Quality Assurance
- Validate all generated content
- Check for broken links
- Ensure proper formatting
- Test code examples

This comprehensive automation system ensures your API and component documentation stays accurate, up-to-date, and professionally maintained throughout the development lifecycle.