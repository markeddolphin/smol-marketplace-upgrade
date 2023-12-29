import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => (
  <>
    <main className="relative min-h-screen">
      {children}
    </main>
    <ToastContainer
      position="bottom-center"
      bodyClassName={() => 'font-mono text-white flex'}
      toastClassName={() =>
        'border-2 border-yellow bg-[#24261F]/[.97] relative flex p-4 min-h-16 rounded-md justify-between overflow-hidden cursor-pointer'
      }
      hideProgressBar
    />
  </>
);

export default Layout;
