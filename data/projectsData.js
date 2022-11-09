const projectsData = [
  {
    title: 'OpenGL Game Engine',
    description: `I built a game engine using C++ and GLSL in the Interactive Computer Graphics course taught by Steve Marschner. It can render complex shading and 3D animation. And as a team, we used this game engine to build a first-person Portal demo including a simple player controll and texture mapping in the scene. The player can seamlessly transit between both side of the portal, and the view through the portal matches up with the player's current perspective. `,
    imgSrc: '/static/images/portal-demo.jpg',
    source: 'https://github.com/vcccaat/OpenGL-Game-Engine',
    custom: 'https://graphics-animation-demo.vercel.app/',
    type: 'self',
  },
  {
    title: 'Multi-Users Chat Room',
    description: `I made a whatsapp-like real-time chat application, allow user register, login with email and password, user can create chat room, clear chating history, all messages are stored in Firebase. Developed using React Hooks, React Context API, and Material UI.`,
    imgSrc: '/static/images/chat-room.jpg',
    href: 'https://vcccaat.github.io/chatroom/',
    source: 'https://github.com/vcccaat/chatroom-dev',
    type: 'self',
  },
  {
    title: 'Visualization for Social Ranking',
    description: `An interactive choropleth map and scatter plot to visualize different social rankings of countries, built using D3.js.`,
    imgSrc: '/static/images/map-plot.jpg',
    href: 'https://info5100-data-visualization.vercel.app/',
    source: 'https://github.com/vcccaat/visualization-project',
    type: 'self',
  },
  {
    title: 'Recipe App',
    description: ` A full-responsive progressive app built using VUE.js. Aim to help students best use of ingredients they have and save time to make quick and simple food in the busy semester.`,
    imgSrc: '/static/images/recipe-app.jpg',
    href: 'https://facipe.herokuapp.com/',
    source: 'https://github.com/vcccaat/recipe-app',
    type: 'self',
  },
  {
    title: 'Animal Crossing Handbook',
    description: `A web app provides a detail card of all characters and items in the game Animal Crossing in Nintendo. Users can serarch items by keywords, sort items by price, and apply multiple filters. Developed in React, CSS3, and Bootstrap.`,
    imgSrc: '/static/images/animal-crossing.jpg',
    href: 'https://acnh-r7eswd6g9-vcccaat.vercel.app/',
    source: 'https://github.com/vcccaat/acnh',
    type: 'self',
  },
  {
    title: 'Kirby Game',
    description: `A fully functional Kirby game with camera control and shading effects developed using three.js. Applied basic animation principles on Kirby: Kirby can fly around, walk around and inhale bombs. Implemented particle system to mimic a waterfall, and used sprite model to mimic a river on a mountain. (The performance on the demo site is quite slow) Feel free to check the source code for more small projects in computer graphics.`,
    imgSrc: '/static/images/kirby-game.jpg',
    href: 'https://cs5620-computer-graphic.vercel.app/',
    source: 'https://github.com/vcccaat/computer-graphics-projects',
    type: 'self',
  },
  {
    title: 'VR Flight Simulator',
    description: `A flight simulator used to study ways to reduce motion sickness in VR, built in Unity and demo using Oculus Quest 2.`,
    imgSrc: '/static/images/flight-simulator.jpg',
    href: 'https://flight-simulator-vcccaat.vercel.app/',
    source: 'https://github.com/vcccaat/Flight-Simulator/tree/main',
    type: 'self',
  },
  {
    title: 'Clinical Trial Information Platform',
    description: `Design a website which can provide fail clinical trial information and allow companies and research insisitutes to upload their information to trade with other industrial partner. This project won 100'000HKD funding in a startup competition held by Hong Kong Cyberport.`,
    imgSrc: '/static/images/clinical-trial.jpg',
    type: 'self',
  },
]

export default projectsData
