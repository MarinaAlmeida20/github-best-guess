import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [username, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [language, setLanguage] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setError] = useState("");

  // when click submit, this function will run
  function handleSubmit(e) {
    e.preventDefault();
    allRepos();
  }

  // console.log(repos);

  // function to get the API
  const allRepos = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}/repos`,
    })
      .then(async (response) => {
        const repos = await response.data;

        // all the repos go to the array
        setRepos(repos);

        // get the language
        calculateLanguage(repos);
      })
      .catch((error) => {
        console.log(error.response.request.status);
        if (error.response.request.status === 404) {
          setError("Sorry :( this user doesn't exist, Please try again!");
        }
      });
  };

  // function to get the language
  const calculateLanguage = (repos) => {
    let arr = [];
    // get all the languages and put inside the array
    repos.map((lang) => arr.push(lang.language)).filter((str) => str);

    // filter the array and remove the null from it
    const noNullValues = arr.filter((element) => {
      return element !== null;
    });

    // sum all the values that have the same key
    let likedLanguage = noNullValues.reduce(function (obj, b) {
      obj[b] = ++obj[b] || 1;
      return obj;
    }, {});

    // this function will get the array and
    // the obj (key and value) depend on the n
    function maxValues(obj, n) {
      // Get object values and sort descending
      const values = Object.values(obj).sort((a, b) => b - a);

      // Check if more values exist than number required
      if (values.length <= n) return obj;

      // Find the maximum value
      const maxNumber = values[n - 1];

      // Filter object to return only key/value pairs
      // where value >= maxNumber
      return Object.entries(obj).reduce(
        (obj, [key, value]) =>
          value >= maxNumber ? { ...obj, [key]: value } : obj,
        {}
      );
    }
    // get the highst language and value
    let max = maxValues(likedLanguage, 1);

    // get only the highst key language from the obj
    let language = Object.keys(max)[0];

    // set the language inside the state
    setLanguage(language);
  };

  // this will show a message when the username started to be typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("I'll show your which language you prefer more");
    }, 1000);
    return () => clearTimeout(timer);
  }, [username, repos]);

  return (
    <div className="App">
      <h1 className="title-site">
        Welcome to the Language Preferred finder for Github User!
      </h1>
      <div className="content">
        <form className="search-user">
          <input
            className="input"
            placeholder="@Enter the username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleSubmit}>
            {" "}
            {loading ? "Searchcing..." : "Search"}
          </button>
        </form>
        {errorMsg ? (
          <p className="errorMsg">{errorMsg}</p>
        ) : (
          <div className="user">
            <h1 className="username-greetings">{`Hello ${username}`}</h1>

            {username ? (
              <h2 className="message">{message}</h2>
            ) : (
              <h2>Please enter with an username.</h2>
            )}
            <h1 className="language">{language}</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
