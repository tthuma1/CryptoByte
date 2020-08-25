import React from 'react';

class LoadingScreen extends React.Component {
  render() {
    return (
      <div>
        <style>{`
.container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
}
.c1 {
    background: linear-gradient(to bottom, #bdc3c7, #2c3e50);
}
.loader1 {
    height: 100px;
    width: 100px;
}
.l1 {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    border: 10px solid transparent;
    border-top: 10px solid white;
    border-bottom: 10px solid white;
    position: relative;
    animation: spin1 2s infinite;
    -webkit-animation: spin1 2s infinite;
}
.l2 {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: 10px solid transparent;
    border-left: 10px solid white;
    border-right: 10px solid white;
    position: relative;
    bottom: 65px;
    left: 15px;
    animation: spin2 2s infinite;
    -webkit-animation: spin2 2s infinite;
}
@keyframes spin1 {
    50% {
        transform: rotate(360deg);
    }
}
@keyframes spin2 {
    50% {
        transform: rotate(-360deg);
    }
}
@-webkit-keyframes spin1 {
    50% {
        -webkit-transform: rotate(360deg);
    }
}
@-webkit-keyframes spin2 {
    50% {
        -webkit-transform: rotate(-360deg);
    }
}
                `}</style>
        <div className="container c1">
          <div className="loader1">
            <div className="l1" />
            <div className="l2" />
          </div>
          <div className="container">
            <p style={{ color: 'white', position: 'relative', top: '70px' }}>
              The page is loading. This may take a while.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default LoadingScreen;
