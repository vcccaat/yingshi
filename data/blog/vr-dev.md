---
title: Developing VR in Unity on Mac M1 Chip
date: '2022-03-20'
tags: ['VR', 'Unity', 'Oculus Quest']
draft: false
summary: 'Follow my guide to learn building VR application in Unity from scratch'
---

## Let's get started


**Unity version**: 2021.2.17f1 apple silicon 

**Device**: Oculus Quest 2


We know that MacOS doesn’t support Oculus Link, so while we developing VR on Unity, we cannot just hit play button and test directly on the Quest.

For mac user, the current solution is to plug in Quest to your computer, and hit build and run, wait for a few minutes, then you can test it on the Quest. (I know it is frustrating)

- In the Project Setting, go to `XR Plugin Management` , in Android tab, check `Oculus` box
- In the Build Setting, add the scene you want to build, switch to Android platform, select the Oculus run device, and hit on `Build and Run` , then you can see your project on the Quest after you link to your computer (need to first enable developer mode on Quest)

## Setup New Input System for XR

[Reference](https://www.youtube.com/watch?v=UlqdHrfXppo&ab_channel=Valem)

- Open package manager, view packages in Unity Registry, install `openXR plugin` `XR Plugin Management` and `XR Interaction Toolkit` (I switch to Version 1.0.0-pre.8, the newly released version replace XR Rig with XR origin which a lot of tutorials haven’t covered on)
- In project setting, go to XR Plug-in manager and check on the OpenXR option
- Use the default action that Unity provided rather than setup all actions for controller by ourself - in package manager, find `XR Interaction Toolkit` and import `Default Input Actions` in the samples.
- Click the left and right controller in the `Default Input Actions` in the asset, and choose `add to actionBasaedController default` in the inspector
- Create `XR Rig` in the scene, now you will see all default input actions are bind to the left and right controllers
- Now if you test your game on your headset, you will see two red rays can be moved around with your Quest controller

## Keyboard Simulation of XR Controller

- Sometimes it’s more handy to use keyboard control rather than putting on your oculus headset to test your controller, you will need a `XR Device Simulator` which can be imported from the `XR Interaction Toolkit` in package manager samples. (it also help to check if your headset device is plugged in
- In project setting, `XR Plugin Management` , enable `Mock HMD Loader`
- Drag the `XR Device Simulator` to the scene, now you can control the controller using keyboard (you may write a script to detect if oculus is plugged in, then use the oculus controller, otherwise use the simulator)
    
### Some Default XR Key Binding
    
**Transit camera view**: `right click` mouse or use two fingers to press track pad on mac 

**Rotate the camera view**: hold `control` key and use two fingers to press track pad

**Manipulate left/right controller:**

hold `shift` key to manipulate left controller; hold `space` key to manipulate right controller or, press `t` to toggle manipulation of left controller; press `y` to toggle manipulation of right controller; 

**Change where the controller point to**: while `toggle on` the controller, hold the `control` key

now you can create a object with `XR Grab Interactable` component and try to manipulate the controller to point at that object and use grab key `G` to see if you can grab that object using a keyboard

## Hand Tracking in Unity

download **[Oculus Integration SDK](https://developer.oculus.com/downloads/package/unity-integration)**

now you can search for OVRCameraRig and OVRHandPrefab in your asset

follow this [tutorial](https://arvrjourney.com/vr-hand-tracking-with-oculus-quest-and-oculus-link-35568eb3d6f4)

## UI Ray-casting Interaction

This [tutorial](https://www.youtube.com/watch?v=nwKvsRz12l0&ab_channel=SharkJets) teaches you how to create a canvas button and use VR controller ray to press the button. 