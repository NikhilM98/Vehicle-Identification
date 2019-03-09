import React, { Component } from 'react'
import axios from 'axios'

class WebIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            constraints: { audio: false, video: { width: 400, height: 300 } },
            msg: null
        }
    }
    componentDidMount() {
        const constraints = this.state.constraints
        const getUserMedia = (params) => (
            new Promise((successCallback, errorCallback) => {
                navigator.webkitGetUserMedia.call(navigator, params, successCallback, errorCallback)
            })
        )

        getUserMedia(constraints)
            .then((stream) => {
                const video = document.querySelector('video')
                const vendorURL = window.URL || window.webkitURL

                video.src = vendorURL.createObjectURL(stream)
                video.play()
            })
            .catch((err) => {
                console.log(err)
            })

    }

    handleStartClick = () => {
        this.takePicture()
    }

    takePicture = () => {
        const canvas = document.querySelector('canvas')
        const context = canvas.getContext('2d')
        const video = document.querySelector('video')
        const { width, height } = this.state.constraints.video
        canvas.width = width
        canvas.height = height
        context.drawImage(video, 0, 0, width, height)
        const data = canvas.toDataURL('image/png')
        const format = 'image/png'
        const uploadData = {
            image: data,
            format
        }
        console.log(uploadData,'data')
        // axios
        //     .post("https://platerecognizer.com/api/plate-reader/", 
        //          { headers: 
        //             { 'Authorization': "Token 34be0144b537bd895578486e45fa7d354a7c2ded" }
        //          }, 
        //          {
        //              data: {
        //                  image: uploadData.image
        //              }

        //          }
        //     )
            // .then(res => {
            //     console.log(res.data)
            // })
            // .catch(err => {
            //     console.log(err)
            // })
            axios({
                method: "Post",
                url: "https://platerecognizer.com/api/plate-reader/",
                data: uploadData.image,
                headers: {
                    'Authorization': "34be0144b537bd895578486e45fa7d354a7c2ded" 
                },
                responseType: 'json'
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const Camera = (props) => (
            <div className="camera"
            >
                <video id="video"
                ></video>
                <a id="startButton"
                    onClick={props.handleStartClick}
                >Start Capturing</a>
            </div>
        )
        return (
            <div className="capture"
            >
                <Camera
                    handleStartClick={this.handleStartClick} />
                <canvas id="canvas"
                    hidden
                ></canvas>
            </div>
        )
    }
}
export default WebIndex
