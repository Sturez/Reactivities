import { Fragment, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import ModalContainer from '../common/form/modals/ModalContainer';

function App() {
  const { commonStore, userStore } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);


  if (!commonStore.appLoaded)
    return (<LoadingComponent content='Loading app...' />)

  return (
    <>
      <ModalContainer />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {
        location.pathname === '/' ? <HomePage /> :
          (
            <>
              <NavBar />
              <Container style={{ marginTop: '7em' }}>
                <Outlet />
              </Container>
            </>
          )
      }
    </>
  );
}

export default observer(App);
