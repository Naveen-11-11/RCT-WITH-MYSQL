import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome Home &#128153;
 </h1>
     <button style ={{cursor : 'pointer'}} onClick={()=>navigate('/')}>Back</button>
    </div>
  );
};

export default Home;
