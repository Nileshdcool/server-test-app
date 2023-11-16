import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
// import { HashRouter as Router } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Dsa from '../src/modules/DSA/Dsa';
import DsaCheker from '../src/modules/DSA/DsaCheker';
import DsaMaker from '../src/modules/DSA/DsaMaker';
import DashBoard from '../src/modules/management/DashBoard';
import RoleManagement from '../src/modules/management/RoleManagement';
import UserManagement from '../src/modules/management/UserManagement';
import ChangePassword from '../src/Pages/ChangePassword';
import ResetPassword from './Pages/ResetPassword';
import Login from '../src/Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import ForgotPasswordOTP from './Pages/ForgotPasswordOTP';
import RoleModuleAccess from './modules/management/RoleModuleAccess';
import Hierarchies from './modules/Hierarchies/';
import { ToastContainer } from 'react-toastify';
import Header from './Components/Header';
import LeftMenu from './Components/LeftMenu';
import Access from './modules/management/Access';
import Master from './modules/Master/master';
import DealerMaster from './modules/DealerMaster/dealerMaster';
import VehicleMaster from './modules/VehicleMaster/vehicleMaster';
import SchemeMaster from './modules/SchemeMaster/schemeMaster';
import DsaMakers from './modules/DSA/DSACheckerForm';
import FaqMaster from './modules/FaqMaster/faqMaster';
import CaraouselMaster from './modules/CaraouselMaster/caraouselMaster';

const PrivateRouteUser = ({ component: Component }) => {
  return (
    <Route
      render={(props) =>
        sessionStorage.getItem('userName') ? (
          <div className='dash_grid'>
            <ToastContainer />
            <LeftMenu />
            <main className='bg-white'>
              <Header {...props} />
              <Component {...props} />
            </main>
          </div>
        ) : (
          <Redirect to={{ pathname: '/admin/login/' }} />
        )
      }
    />
  );
};

function App() {
  return (
    <Router>
      <Switch>
        {/* Authorization Routing */}
        <Redirect exact from='/' to='/admin/login/' />
        <Route exact path='/admin/login/' component={Login} />
        <Route exact path='/resetpassword' component={ResetPassword} />
        <Route exact path='/forgotpasswordOtp' component={ForgotPasswordOTP} />
        <Route exact path='/forgotpassword' component={ForgotPassword} />
        {/* Sidebar Components Routing */}
        <PrivateRouteUser
          exact
          path='/:modeName/dashboard'
          component={DashBoard}
        />
        <PrivateRouteUser
          exact
          path='/hierarchy/:hierarchyName/:senior/:junior/:modeName'
          component={Hierarchies}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/role-management'
          component={RoleManagement}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/user-management'
          component={UserManagement}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/change-password'
          component={ChangePassword}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/access-management'
          component={Access}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/role-module-access-managemnt'
          component={RoleModuleAccess}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/dsa-maker'
          component={DsaMaker}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/dsa-checker'
          component={DsaCheker}
        />
        <PrivateRouteUser exact path='/:modeName/dsa' component={Dsa} />
        <PrivateRouteUser exact path='/:modeName/master' component={Master} />
        <PrivateRouteUser
          exact
          path='/:modeName/dealerMaster'
          component={DealerMaster}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/vehicleMaster'
          component={VehicleMaster}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/schemeMaster'
          component={SchemeMaster}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/faqMaster'
          component={FaqMaster}
        />
        <PrivateRouteUser
          exact
          path='/:modeName/caraouselMaster'
          component={CaraouselMaster}
        />
        <PrivateRouteUser exact path='/dsaMaker' component={DsaMakers} />
      </Switch>
    </Router>
  );
}

export default App;
