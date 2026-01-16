process.env.SERVICE_ENVIRONMENT = 'eu_development';
process.env.AWS_REGION = 'eu-central-1';
process.env.SERVICE_CONFIG_SECRET_ID = 'service-config';
process.env.DOCDB_CREDENTIALS_SECRET_ID = 'docdb-credentials';

process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

// this sets a random port for the server to run on, which is useful for testing
process.env.SERVER_PORT = '0';
