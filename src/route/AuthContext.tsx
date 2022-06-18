import {createContext} from 'react';

export interface AuthContexDataObject {
  displayName?: string | any;
  email?: string | any;
  emailVerified?: boolean | any;
  isAnonymous?: boolean | any;
  metadata?: {creationTime?: number | any; lastSignInTime?: number | any};
  phoneNumber?: null | any;
  photoURL?: string | any;
  providerData?: [[Object]] | any;
  providerId?: string | any;
  tenantId?: null | any;
  uid?: string | any;
  accessToken?: string | any;
  accessTokenSource?: string | any;
  applicationID?: string | any;
  dataAccessExpirationTime?: number;
  declinedPermissions?: any[];
  expirationTime?: number;
  expiredPermissions?: any[];
  lastRefreshTime?: number;
  permissions?: string[];
  userID?: string;
}

export interface AuthContexDeviceArray {
  id: string;
  gardenName: string;
  location: string;
  scene?: string;
}

export interface SchedulParams {
  id: string;
  btn: string;
  time: string;
  duration: string;
  every: string;
  status: boolean;
}

export interface AuthContextProps {
  SignIn: (data?: AuthContexDataObject | any) => void;
  SignOut: () => void;
  AddDevice: (data: AuthContexDeviceArray) => void;
  RemoveDevice: (id: String) => void;
  Schedule: (data: SchedulParams) => void;
}

const AuthContextDefaultProps = {
  SignIn: () => {
    console.log('sign in');
  },
  SignOut: () => {
    console.log('sign out');
  },
  AddDevice: () => {},
  RemoveDevice: () => {},
  Schedule: () => {},
};
const AuthContex = createContext<AuthContextProps>(AuthContextDefaultProps);

export default AuthContex;