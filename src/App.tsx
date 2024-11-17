import { Route, Switch, useLocation } from "wouter";
import HomePage from "./pages/home_page";
import Auth from "./pages/auth_page";
import NotFoundPage from "./pages/404_page";
import { useEffect, useState } from "react";
import { supabase } from "./supabase_client";

// const items = [
//   {
//     label: "Woot",
//     key: "/",
//   },
//   {
//     label: "Page A",
//     key: "/page_a",
//   },
//   {
//     label: "Page B",
//     key: "/page_b",
//   },
//   {
//     label: "Page C",
//     key: "/page_c",
//   },
// ];

const App = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      setUser(user?.data.user ?? null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);
  const [_, setLocation] = useLocation();
  // const [current, setCurrent] = useState("");
  //
  // const onClick: MenuProps["onClick"] = (e: any) => {
  //   setCurrent(e.key);
  //   setLocation(e.key);
  // };

  return (
    <div className="App">
      <div>
        {user ? (
          <div>
            <button onClick={() => setLocation("/auth")}>Admin</button>
          </div>
        ) : (
          <button onClick={() => setLocation("/auth")}>Admin</button>
        )}
      </div>
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/auth">
          <Auth user={user} />
        </Route>
        <Route path="/:anything*">
          <NotFoundPage />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
