type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="bg-red-500 h-full">{children}</div>;
};

export default AuthLayout;
