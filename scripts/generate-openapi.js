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

  generate() {
    console.log('🔄 Generating OpenAPI schema...');
    console.log('This script is a placeholder. For accurate OpenAPI schema generation,');
    console.log('you should use drf-spectacular directly from your Django backend.');
    console.log('\nTo generate the OpenAPI schema, navigate to your `backend/` directory');
    console.log('and run the following command:');
    console.log('\n  python manage.py spectacular --file ../docs/api/openapi.yaml');
    console.log('\nThis will generate the `openapi.yaml` file based on your Django REST Framework views.');
    console.log('\nIf you need to update the `openapi.json` file, you can convert the YAML to JSON.');
    
    // This part is kept to ensure the script still produces a file, even if it's a placeholder.
    // In a real scenario, the user would run the python command.
    const outputPath = path.join(__dirname, '../docs/api/openapi.yaml');
    const jsonOutputPath = path.join(__dirname, '../docs/api/openapi.json');

    // If openapi.yaml doesn't exist, create a minimal one to avoid errors
    if (!fs.existsSync(outputPath)) {
      fs.writeFileSync(outputPath, yaml.dump(this.schema, { indent: 2 }));
      console.log(`📄 Created a placeholder: ${outputPath}`);
    } else {
      console.log(`📄 Existing OpenAPI schema found at: ${outputPath}`);
    }

    // If openapi.json doesn't exist, create a minimal one
    if (!fs.existsSync(jsonOutputPath)) {
      fs.writeFileSync(jsonOutputPath, JSON.stringify(this.schema, null, 2));
      console.log(`📄 Created a placeholder: ${jsonOutputPath}`);
    } else {
      console.log(`📄 Existing OpenAPI JSON found at: ${jsonOutputPath}`);
    }
    
    console.log('✅ OpenAPI schema generation process guided.');
  }
}

// Run the generator
if (require.main === module) {
  const generator = new OpenAPIGenerator();
  generator.generate();
}

module.exports = OpenAPIGenerator;