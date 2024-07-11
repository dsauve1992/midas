import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

export class TestContainer {
  private static container: StartedPostgreSqlContainer;
  static async init() {
    console.log('------- INIT TEST CONTAINER -------');
    this.container = await new PostgreSqlContainer().start();

    global.__dbConfig__ = {
      host: this.container.getHost(),
      port: this.container.getPort(),
      user: this.container.getUsername(),
      password: this.container.getPassword(),
      database: this.container.getDatabase(),
    };
  }
  static async stop() {
    console.log('------- STOP TEST CONTAINER -------');
    await this.container.stop();
  }
}
