import axios from 'axios';
import { USER_LOGIN, GET_USER_AUTH } from './action-type';
import Util from '../../js/Util';

const token = Util.getToken();

const actionUserLoginCreator = (type, data) => {
  const { auth, username } = data;
  return {
    type,
    data: {
      isLogin: true, // 是否登录
      isAuth: auth === 1, // 是否有权限
      isAdminAuth: username === 'admin', // 是否是超级管理员
      username,
    },
  };
};

export const userLogin = (params) => {
  return (dispatch) => {
    return axios.post('http://localhost:8080/api/users/login', params).then((res) => {
      if (res.data.success) {
        dispatch(actionUserLoginCreator(USER_LOGIN, res.data.data));
        Util.setToken(res.data.data.token);
      }
    });
  };
};

export const getUserAuth = () => {
  return (dispatch) => {
    if (token) {
      return axios
        .get('http://localhost:8080/api/users/info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.success) {
            dispatch(actionUserLoginCreator(GET_USER_AUTH, res.data.data));
          }
        });
    } else {
      dispatch({
        type: GET_USER_AUTH,
        data: {
          isLogin: false,
          isAuth: false,
          isAdminAuth: false,
          username: null,
        },
      });
    }
  };
};
