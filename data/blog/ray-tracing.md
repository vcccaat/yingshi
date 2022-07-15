---
title: Build a Ray Tracer from Scratch in C++
date: '2022-05-01'
tags: ['Computer Graphics', '3D']
draft: false
summary: 'Follow my guide to learn building VR application in Unity from scratch'
---

## Construct Everything
### Construct camera, materials, lights classes from file or default

```javascript
class Camera {
    glm::vec3 pos;
    glm::vec3 target; // where it look at
    glm::vec3 upVec; 
    float hfov;
    float aspect;
    glm::mat4 transMat;   
}

class Light {
		enum Type { POINT, AREA, AMBIENT }
    string name;
    glm::vec3 pos;
    aiColor3D power;
    float width;
    float height;
    glm::vec3 areaNormal;
    glm::vec3 areaTangent;
    glm::mat4 transMat;
}

class Material {
    glm::vec3 diffuse;
    float roughness;
    float indexofref
}
```

### Add 3D meshes into scene 
```javascript
// aiScene is the pointer to assimp file object
RTCScene initializeScene(const aiScene* aiScene, Camera& cam){
		RTCDevice device = initializeDevice();  //Embree
		RTCScene scene = rtcNewScene(device); //Embree
		traverseNodeHierarchy(scene, aiscene, aiscene->mRootNode, glm::mat4(1.f));
		rtcCommitScene(scene); //Embree
		return scene
}


// DFS: find all meshes in the node hierarchy
void traverseNodeHierarchy(RTCScene scene, const aiScene* aiscene, aiNode* cur,
    glm::mat4 transMatrix){

		// top down, compute transformation matrix while traversing down the tree
    if (cur != NULL) {
        transMatrix = transMatrix * RTUtil::a2g(cur->mTransformation);
        // when it reaches mesh, transform the vertices
        if (cur->mNumMeshes > 0) {
            for (int i = 0; i < cur->mNumMeshes; ++i) {
                aiMesh* mesh = aiscene->mMeshes[cur->mMeshes[i]];
                addMeshToScene(device, scene, mesh, transMatrix, mp);
            }
        }
        for (int i = 0; i < cur->mNumChildren; ++i) {
            traverseNodeHierarchy(device, scene, aiscene, cur->mChildren[i], transMatrix, mp);
        }
    }

}


// retrieve vertices and indices of each triangle of a mesh
void addMeshToScene(RTCDevice device, RTCScene scene, aiMesh* mesh, glm::mat4 transMatrix) {
   
    RTCGeometry geom = rtcNewGeometry(device, RTC_GEOMETRY_TYPE_TRIANGLE);
    float* vertices = (float*)rtcSetNewGeometryBuffer(geom, RTC_BUFFER_TYPE_VERTEX, 0, RTC_FORMAT_FLOAT3,
        3 * sizeof(float), 3 * mesh->mNumVertices);
    unsigned* indices = (unsigned*)rtcSetNewGeometryBuffer(geom, RTC_BUFFER_TYPE_INDEX, 0, RTC_FORMAT_UINT3,
        3 * sizeof(unsigned), 3 * mesh->mNumFaces);

    for (int i = 0; i < mesh->mNumVertices; ++i) {
        float x = mesh->mVertices[i][0];
        float y = mesh->mVertices[i][1];
        float z = mesh->mVertices[i][2];
        glm::vec4 chg = transMatrix * glm::vec4(x, y, z, 1);
        vertices[3 * i + 0] = chg.x;
        vertices[3 * i + 1] = chg.y;
        vertices[3 * i + 2] = chg.z;
    }
    for (int i = 0; i < mesh->mNumFaces; ++i) {
        indices[3 * i + 0] = mesh->mFaces[i].mIndices[0];
        indices[3 * i + 1] = mesh->mFaces[i].mIndices[1];
        indices[3 * i + 2] = mesh->mFaces[i].mIndices[2];
    }
    rtcCommitGeometry(geom);
    rtcAttachGeometryByID(scene, geom);
    rtcReleaseGeometry(geom);
}
```

## Ray Tracing
### Generate ray vector from camera position to each pixel location on the image
```javascript
glm::vec3 Camera::generateRay(float xp, float yp) {
    glm::vec3 w = glm::normalize(-this->target);
    glm::vec3 u = glm::normalize(glm::cross(this->up, w));
    glm::vec3 v = glm::normalize(glm::cross(w, u));

    double wide = 2 * tan(hfov / 2);
    double h = wide / this->aspect;
    double u_small = xp * wide;
    double v_small = yp * h;
    u_small -= wide / 2;
    v_small -= h / 2;
    float x = u.x * u_small + v.x * v_small - w.x;
    float y = u.y * u_small + v.y * v_small - w.y;
    float z = u.z * u_small + v.z * v_small - w.z;
    return glm::vec3(x, y, z); //ray direction
}
```

### Check if the rays emit from camera in each direction can hit the 3D object
```javascript
// plug camera origin pos and ray dir into this rayhit struct,
// it can automatically calculate whether it can hit the object.
RTCRayHit rayhit

// Embree features
struct RTCIntersectContext context;
rtcInitIntersectContext(&context);
rtcIntersect1(scene, &context, &rayhit);

// the pos on 3D object that got hit
// ox oy oz is camera pos
glm::vec3 hitPos = glm::vec3(ox, oy, oz) + rayhit.ray.tfar * rayDir;
```

## Shading
### Shade the location hit by the ray on the pixel image, and leave it as background color if the pixel doesn’t hit by ray
```javascript
// the color of shading depends on the normal on the surface of hit pos
// shad requires BRDF: where do your eye locates and light direction  
// determine the shade color
shade(glm::vec3 eyeRay, glm::vec3 hitPos, glm::vec3 normal){
	// multiple lights in the scene
		aiColor3D color;
	// material of the surface affect reflectance
    Material material = materials[geomIdToMatInd[geomID]];
    for (int i = 0; i < lights.size(); i++) {
        if (lights[i].type == 0) {
						// point light
            color = color + lights[i].pointIlluminate(scene, eyeRay, hitPos, normal, material);
        }
        else if (lights[i].type == 1) {
						// area light
            color = color + lights[i].areaIlluminate(scene, eyeRay, hitPos, normal, material);
        }
        else {
						// ambient light
            color = color + lights[i].ambientIlluminate(scene, eyeRay, hitPos, normal, material);
        }
    }
    return color;
}
```

### Accumulate all light sources effect on the shading point
#### Point Light
```javascript
aiColor3D Light::pointIlluminate(RTCScene scene, glm::vec3 eyeRay, glm::vec3 hitPos, glm::vec3 normal, Material material) {

    // Generate BRDF input and see if occluded
    glm::vec3 wi = glm::normalize(-eyeRay);
    glm::vec3 wo = glm::normalize(pos - hitPos);
    if (isShadowed(scene, wo, hitPos, glm::length(pos - hitPos))) return aiColor3D();

    // Run BRDF
    nori::Frame frame = nori::Frame(normal);
    nori::BSDFQueryRecord BSDFquery(frame.toLocal(wi), frame.toLocal(wo));
    nori::Microfacet bsdf = nori::Microfacet(material.roughness, material.indexofref, 1.f, material.diffuse);
    glm::vec3 fr = bsdf.eval(BSDFquery);

    // Calculate resultant color
    float divise = glm::dot(normal, wo) / (4 * pi * pow(glm::length(pos - hitPos), 2));
    glm::vec3 out = glm::vec3(power[0] * fr[0], power[1] * fr[1], power[2] * fr[2]) * divise;
    return aiColor3D(out[0], out[1], out[2]);
}
```

#### Area light
Estimate this integral by choosing from a uniform random distribution over the surface of the source; this means where is the area of the source
```javascript
aiColor3D Light::areaIlluminate(RTCScene scene, glm::vec3 eyeRay, glm::vec3 hitPos, glm::vec3 normal, Material material) {
    // Determine random position of light
    float r1 = static_cast <float> (rand()) / static_cast <float> (RAND_MAX) - .5;
    float r2 = static_cast <float> (rand()) / static_cast <float> (RAND_MAX) - .5;
    glm::vec3 u = glm::normalize(glm::cross(areaTangent, areaNormal));
    glm::vec3 v = glm::normalize(glm::cross(areaNormal,u));
    glm::vec3 lightpos = pos + u * (r1 * width) + v * (r2 * height);

    // Generate BRDF input and see if occluded
    glm::vec3 wi = glm::normalize(-eyeRay);
    glm::vec3 wo = glm::normalize(lightpos - hitPos);
    if (isShadowed(scene, wo, hitPos, glm::length(lightpos - hitPos))) return aiColor3D();

    // Run BRDF
    nori::Frame frame = nori::Frame(normal);
    nori::BSDFQueryRecord BSDFquery(frame.toLocal(wi), frame.toLocal(wo));
    nori::Microfacet bsdf = nori::Microfacet(material.roughness, material.indexofref, 1.f, material.diffuse);
    glm::vec3 fr = bsdf.eval(BSDFquery);

    // Calculate resultant color
    glm::vec3 radiance = glm::vec3(power[0] / (width * height * pi), power[1] / (width * height * pi), power[2] / (width * height * pi));
    glm::vec3 firstpt = glm::vec3(radiance[0] * fr[0], radiance[1] * fr[1], radiance[2] * fr[2]);
    float toppt = glm::dot(normal, wo) * glm::dot(areaNormal, wo);
    float bottompt = pow(glm::length(hitPos - lightpos), 2);
    glm::vec3 out = width * height * firstpt * (toppt/bottompt);
    return aiColor3D(out[0], out[1], out[2]);
}
```
Raytrace function incorporate monte carol simulation for area light and ambient light: as long as the camera is not moving, the newly computed pixel values are averaged into the existing image in such a way that after waiting for frames, the user is looking at an image rendered with samples per light.
```javascript
void rayTrace(std::vector<glm::vec3>& img_data, float iter) {
    glm::vec3 dir;
    for (int j = 0; j < height; ++j) for (int i = 0; i < width; ++i) {
        dir = camera.generateRay((i + .5) / width, (j + .5) / height);
        aiColor3D col = castRay(camera.pos.x, camera.pos.y, camera.pos.z, dir.x, dir.y, dir.z);
        img_data[j * width + i] = times(img_data[j * width + i], (iter - 1) / iter) + times(glm::vec3(col.r, col.g, col.b), 1 / iter);
    }
}
```

#### Ambient light with Occlusion
nearby surfaces prevent ambient light from reaching our shading point, but if they are too far away we ignore them (otherwise interior scenes would have no ambient light). The ambient lighting model has two parameters: the radiance L of the ambient light and the distance r beyond which occlusion is not counted.

```javascript
aiColor3D Light::ambientIlluminate(RTCScene scene, glm::vec3 eyeRay, glm::vec3 hitPos, glm::vec3 normal, Material material) {
    // Determine random position of light, in local coordinates
    float r1 = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
    float r2 = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
    glm::vec3 samp = RTUtil::squareToCosineHemisphere(glm::vec2(r1, r2));

    // Transform to global coordinates and see if occluded
    nori::Frame frame = nori::Frame(normal);
    glm::vec3 globalSamp = frame.toWorld(samp);
    if (isShadowed(scene, globalSamp, hitPos, dist)) return aiColor3D();

    // Calculate resultant color
    glm::vec3 out = glm::vec3(material.diffuse[0] * power[0], material.diffuse[1] * power[1], material.diffuse[2] * power[2]);
    return aiColor3D(out[0], out[1], out[2]);
}
```

### Compute shadow by setting origin is the pixel location and if the ray emit from origin to the light location is blocked, means has shadow
```javascript
bool isShadowed(RTCScene scene, glm::vec3 lightDir, glm::vec3 hitPos, float maxDist) {
    glm::vec3 newOrig = hitPos + lightDir * .001f;
    RTCRayHit shadowRayhit = generateRay(newOrig[0], newOrig[1], newOrig[2], lightDir[0], lightDir[1], lightDir[2], maxDist);
    struct RTCIntersectContext context;
    rtcInitIntersectContext(&context);
    rtcOccluded1(scene, &context, &shadowRayhit.ray);
    return shadowRayhit.ray.tfar == -std::numeric_limits<float>::infinity();
}
```