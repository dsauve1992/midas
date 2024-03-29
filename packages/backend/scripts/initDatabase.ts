import { setupTables } from '../test/config/database/dynamoDb-table-initializer';
import { watchlistTableParams } from '../src/modules/watchlist/infra/repository/watchlist-table.param';
import { screenerTableParams } from '../src/modules/screener/repository/screener-table.param';

void setupTables([watchlistTableParams, screenerTableParams]);
