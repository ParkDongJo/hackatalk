import React, { useReducer } from 'react';

import { User } from '../types';
import createCtx from '../utils/createCtx';
import produce from 'immer';

interface Context {
  friendState: State;
  addFriend: (user: User) => void;
  deleteFriend: (user: User) => void;
}

const [useCtx, Provider] = createCtx<Context>();

export enum ActionType {
  AddFriend = 'add-friend',
  DeleteFriend = 'delete-friend',
}

export interface State {
  friends: User[];
}

interface Payload {
  user: User;
}

const MockInitialFriends = [
  {
    id: '0',
    nickname: 'hello',
    thumbURL: '',
    photoURL: '',
    statusMessage: 'I am fine today',
    isOnline: true,
  },
];

const initialState: State = {
  friends: [...MockInitialFriends],
};

type Action = { type: ActionType; payload: Payload };

interface Props {
  children?: React.ReactElement;
}

type Reducer = (state: State, action: Action) => State;

const addFriend = (dispatch: React.Dispatch<Action>) => (user: User): void => {
  dispatch({
    type: ActionType.AddFriend,
    payload: { user },
  });
};

const deleteFriend = (dispatch: React.Dispatch<Action>) => (
  user: User,
): void => {
  dispatch({
    type: ActionType.DeleteFriend,
    payload: { user },
  });
};

const reducer: Reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case ActionType.AddFriend: {
        if (!draft.friends.find((friend) => friend.id === payload.user.id)) {
          const index = draft.friends.findIndex(
            (friend) =>
              (payload.user?.nickname || '').toLowerCase() <
              (friend?.nickname || '').toLowerCase(),
          );
          draft.friends.splice(
            index === -1 ? draft.friends.length : index,
            0,
            payload.user,
          );
        }
        break;
      }
      case ActionType.DeleteFriend: {
        const index = draft.friends.findIndex(
          (friend) => friend.id === payload.user.id,
        );
        if (index !== -1) {
          draft.friends.splice(index, 1);
        }
        break;
      }
    }
  });
};

function FriendProvider(props: Props): React.ReactElement {
  const [friendState, dispatch] = useReducer<Reducer>(reducer, initialState);

  const actions = {
    addFriend: addFriend(dispatch),
    deleteFriend: deleteFriend(dispatch),
  };

  return (
    <Provider value={{ friendState, ...actions }}>{props.children}</Provider>
  );
}

export { useCtx as useFriendContext, FriendProvider };
