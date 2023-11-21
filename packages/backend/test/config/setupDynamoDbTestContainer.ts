import { GenericContainer, StartedTestContainer } from 'testcontainers';

export class TestContainer {
  private static container: StartedTestContainer;
  static async init() {
    this.container = await new GenericContainer('amazon/dynamodb-local')
      .withExposedPorts(8000)
      .start();

    const mappedPort = this.container.getMappedPort(8000);
    const host = this.container.getHost();

    process.env.DYNAMO_DB_URL = `http://${host}:${mappedPort}`;
  }
  static async stop() {
    await this.container.stop();
  }
}
