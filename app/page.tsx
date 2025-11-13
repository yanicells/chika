import React from 'react';
import Home from '../components/Home';
import { LoginForm } from '@/components/LoginForm';

const HomePage = () => {
  return(
    <div>
      <Home />
      <LoginForm className="max-w-md mx-auto mt-8" />
    </div>
  )
};

export default HomePage;