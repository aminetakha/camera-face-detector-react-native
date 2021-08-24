import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button, StatusBar, Image } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
	const [hasPermission, setHasPermission] = useState(false)
	const [flash, setFlash] = useState("off")
	const [type, setType] = useState(Camera.Constants.Type.back);
	const camera = useRef()
	const [image, setImage] = useState(null)
	const [faces, setFaces] = useState([])
	
	const requestTakePicHandler = async () => {
		const {status} = await Camera.requestPermissionsAsync()
		setHasPermission(status === "granted")
	}

	const takePicHandler = async () => {
		let photo = await camera.current.takePictureAsync();
		// setImage(photo)
		const {status} = await MediaLibrary.requestPermissionsAsync()
		if(status === "granted"){
			await MediaLibrary.saveToLibraryAsync(photo.uri)
		}
	}

	const changeFlash = () => {
		if(flash === "off"){
			setFlash('on')
		}else if(flash === "on"){
			setFlash("off")
		}
	}

	const handleFacesDetected = e => {
		setFaces(e.faces)
	}

	// if(image){
	// 	return <Image source={{uri: image.uri}} style={{width: 200, height: 300}} />
	// }

	if(hasPermission){
		return <View style={styles.container}>
			<Camera 
				style={styles.camera} 
				type={type} 
				zoom={0} 
				ratio="16:9" 
				ref={camera} 
				flashMode={flash}
				onFacesDetected={handleFacesDetected}
				faceDetectorSettings={{
					mode: FaceDetector.Constants.Mode.fast,
					detectLandmarks: FaceDetector.Constants.Landmarks.none,
					runClassifications: FaceDetector.Constants.Classifications.none,
					minDetectionInterval: 100,
					tracking: true,
				}}
			>
				<View style={styles.faceContainer} pointerEvents={'box-none'}>
					{faces.map((face, index) => (
						<View key={index}  style={{
							marginLeft: face.bounds.origin.x,
							marginTop: face.bounds.origin.y,
							width: face.bounds.size.width,
							height: face.bounds.size.height,
							borderWidth: 2,
							borderColor: "green"
						}}>

						</View>
					))}
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
						setType(
							type === Camera.Constants.Type.back
							? Camera.Constants.Type.front
							: Camera.Constants.Type.back
						);
						}}>
						<Text style={styles.text}> Flip </Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.takePicButton}
						onPress={takePicHandler}>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={changeFlash}>
							<Text style={styles.text}>Flash: {flash}</Text>
					</TouchableOpacity>
				</View>
			</Camera>
			<StatusBar hidden={true}  />
		</View>
	}

	return (
		<View style={{flex:1, justifyContent: "center"}}>
			<Button title="Take a picture" onPress={requestTakePicHandler} />
			<StatusBar hidden={true}  />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	},
	camera: {
	  flex: 1,
	  position: "relative"
	},
	buttonContainer: {
	  flex: 1,
	  flexDirection: 'row',
	  margin: 20,
	  justifyContent: "space-around",
	  zIndex: 10
	},
	button: {
	  alignSelf: 'flex-end',
	  alignItems: 'center',
	},
	takePicButton: {
		width: 50,
		height: 50,
		borderRadius: 50,
		backgroundColor: "aqua",
		alignSelf: 'flex-end',
	},
	text: {
	  fontSize: 18,
	  color: 'white',
	},
	faceContainer: {
		position: "absolute", 
		top: 0, 
		bottom: 0, 
		right: 0, 
		left: 0, 
		zIndex: 50, 
		backgroundColor: "transparent"
	}
  });
