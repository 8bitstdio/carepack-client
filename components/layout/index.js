import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import styles from "./layout.module.scss";

function Layout({ children }) {
  return (
    <>
      <main className={styles.main}>{children}</main>
      <ToastContainer
        position='bottom-left'
        autoClose={2000}
        hideProgressBar={false}
        theme='dark'
      />
    </>
  );
}

export default Layout;
