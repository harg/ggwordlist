import { Route, Switch } from "wouter";
import HomePage from "./pages/home_page";
import PageA from "./pages/page_a";
import NotFoundPage from "./pages/404_page";

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
  // const [location, setLocation] = useLocation();
  // const [current, setCurrent] = useState("");
  //
  // const onClick: MenuProps["onClick"] = (e: any) => {
  //   setCurrent(e.key);
  //   setLocation(e.key);
  // };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">Layout</h1>
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/page_a">
          <PageA />
        </Route>
        <Route path="/:anything*">
          <NotFoundPage />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
