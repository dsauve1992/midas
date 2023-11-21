import { TestContainer } from './setupDynamoDbTestContainer';

module.exports = async function () {
  await TestContainer.init();
};
