// components
import Sidebar from "../../components/Sidebar/Sidebar";

// layouts
import Head from "../../layout/Head";
import Body from "../../layout/Body";
import Dashboard from "../../layout/dashboard/Dashboard";

import config from "../../lib/config";

const Login = () => {
  return (
    <>
      <Head />
      <Body>
        <div className="bg-dark-blood flex w-viewport min-h-viewport">
          <Sidebar />
          <Dashboard />
        </div>
      </Body>
    </>
  );
};

export default Login;
