import { defineConfig } from 'allure-commandline';

export default defineConfig({
  resultsDir: 'allure-results',
  reportDir: 'allure-report',
  categories: [
    {
      name: 'Business Logic Errors',
      messageRegex: '.*uuid.*|.*expect.*',
      statusDetailsRegex: '.*'
    },
    {
      name: 'UI / Selector Flakiness',
      messageRegex: '.*timeout.*|.*waiting for.*',
      statusDetailsRegex: '.*'
    }
  ],
  environmentInfo: {
    OS: 'Linux',
    Node: 'v20.20.2',
    Project: 'BEFFA ERP High-Integrity Suite',
    Engine: 'Integrated-Allure-Reporter'
  }
});
