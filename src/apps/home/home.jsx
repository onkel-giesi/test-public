import React from "react";
import './home.css';
import MyButton from "../../components/button/button";

const Home = () => {
  return (
    <>
      <h1>Hello World!</h1>
      <MyButton label="Drück mich!" onClick={() => { console.log('click!') }} />
    </>
  )
}

export default Home;
