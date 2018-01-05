import {
  GET_PROCESS_TPL_SELECT_DATA,
  GET_HOST_SELECT_DATA,
  GET_HOST_GROUP_TPL_SELECT_DATA,
  GET_HOST_GORUP_HOST_RELATION_SELECT_DATA,
  GET_SALT_PATH_SELECT_DATA,
  UPDATE_FIELD_SIDER,
} from '../actionTypes';

const defaultState = {
  processTplSelectData: [],
  hostSelectData: [],
  hostGroupSelectData: [],
  hostGroupHostRelationData: [],
  saltPathSelectData: [],
  timestamp: new Date().getTime(),
  selectedKeys: [],
  openKeys: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_PROCESS_TPL_SELECT_DATA:
      return { ...state, processTplSelectData: action.data, timestamp: new Date().getTime() };
    case GET_HOST_SELECT_DATA:
      return { ...state, hostSelectData: action.data, timestamp: new Date().getTime() };
    case GET_HOST_GROUP_TPL_SELECT_DATA:
      return { ...state, hostGroupSelectData: action.data, timestamp: new Date().getTime() };
    case GET_HOST_GORUP_HOST_RELATION_SELECT_DATA:
      return { ...state, hostGroupHostRelationData: action.data, timestamp: new Date().getTime() };
    case GET_SALT_PATH_SELECT_DATA:
      return { ...state, saltPathSelectData: action.data, timestamp: new Date().getTime() };
    case UPDATE_FIELD_SIDER:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}
