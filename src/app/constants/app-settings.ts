const BASE_URL = 'http://127.0.0.1:3000';

export enum AppSettings {
  GARAGE_PAGE_LIMIT = 7,
  WINNERS_PAGE_LIMIT = 10,
  RANDOM_CARS_COUNT = 100,
  GET_CARS_URL = `${BASE_URL}/garage`,
  GET_WINNERS_URL = `${BASE_URL}/winners`,
  CREATE_CAR_URL = `${BASE_URL}/garage`,
  UPDATE_CAR_URL = `${BASE_URL}/garage/`,
  DELETE_CAR_URL = `${BASE_URL}/garage/`,
  DELETE_WINNER_URL = `${BASE_URL}/winners/`,
}
