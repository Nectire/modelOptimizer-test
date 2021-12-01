# modelOptimizer
Service to optimize 3D glb model

## Installation and commands
  Clone repo:
  
    git clone https://github.com/Nectire/modelOptimizer-test 

  Install all dependecies:
  
    npm i
    
  to bulid client-side run command:
  
    npm run build
  bundle file will saved in `public/` dir
  
### How to start
  first of all you should start the server with:
  
    npm run start:server
  then you can just start `index.html` file if you are build the project, but also you can start with dev mode with command:
  
    npm run start
    
## What was done
 
  On client-side i wrote function of adding model to the scene, but before of this, the model is being sent to server for compression. After it compressed model send bacward.
  So problem is here. The server send an buffer array and i tried wrap this data to new blob for load it with GLTFLoader, but error said me: `THREE.GLTFLoader: Unsupported       asset. glTF versions >=2.0 are supported.`. But if you try upload compressed model directly to scene, all working is fine (So, now i'm thinking how to fix it).
  
  Long time I could not understand why the model is not displayed correctly, but then i realized that the problem with size of model :D. So i just increased the size of model.
  
  About model information: in last version in threejs, in renderer.info cannot provide the info about vertices. So i decided to display info about file size and count of triangles.
  
  Bounding box: i just placed only box Helper. So autofocus not implemented. Probably it's not big problem to sovle it.
  
  For lights i just played with some options and i think take some good result.
  
  Also, i refacor code for litle bit.
  
## texture reduction

My opinion about texture reduction may well be amateurish because I'm new to 3D modeling. But I can suggest starting a cycle that will go through all 3D objects or textures and perform the compression function and check the parameter. for example, if a texture contains some text, and contains "text" parameter, and by condition the function for this element will not be executed.

But, as I understood in threejs, the 3D model contains children, which can also contain children. Therefore, the problem lies in the fact that you will need to carry out something like a deep cycle, which is a complex operation.

