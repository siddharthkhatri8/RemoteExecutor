import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>RemoteExecutor</h1>

      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <p>{user.email}</p>

          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Welcome to RemoteExecutor</p>
      )}
    </div>
  );
};

export default Home;