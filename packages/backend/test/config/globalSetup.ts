import { TestContainer } from './database/setupDynamoDbTestContainer';

module.exports = async function () {
  await TestContainer.init();
};
